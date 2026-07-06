import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { Redis } from 'ioredis';
import { createScheduler } from '../services/scheduler.js';

const WINDOW_SECONDS = 15;
const MAX_REACTIONS_ANIMATED = 30;

export async function waveRoutes(fastify: FastifyInstance, deps: { prisma: PrismaClient; redis: Redis; scheduler: ReturnType<typeof createScheduler> }) {
  fastify.get('/current', async (request, reply) => {
    const welcome = await deps.redis.get('display:current_welcome');
    if (!welcome) {
      return reply.send({ active: false, message: 'No team is being welcomed right now. Stay ready for the next arrival.' });
    }
    return reply.send({ active: true, ...JSON.parse(welcome) });
  });

  fastify.post('/reactions', async (request, reply) => {
    const { welcomeId, kind, sessionIdHash } = request.body as { welcomeId: string; kind: string; sessionIdHash: string };

    if (!welcomeId || !kind || !sessionIdHash) {
      return reply.status(400).send({ error: 'Missing fields' });
    }

    const rateKey = `reaction:rate:${welcomeId}:${sessionIdHash}`;
    const exists = await deps.redis.get(rateKey);
    if (exists) {
      return reply.status(429).send({ error: 'You already reacted to this welcome', ok: false });
    }

    const countsKey = `reaction:counts:${welcomeId}`;
    const newCounts = await deps.redis.hincrby(countsKey, kind, 1);
    await deps.redis.set(rateKey, '1', 'EX', WINDOW_SECONDS);

    await deps.prisma.reaction.create({
      data: { welcomeId, teamId: '', kind, sessionHash: sessionIdHash, createdAt: new Date().toISOString() },
    });

    const rawCounts = await deps.redis.hgetall(countsKey);
    const displayCounts: Record<string, number> = {};
    if (rawCounts) {
      for (const [k, v] of Object.entries(rawCounts)) {
        displayCounts[k] = Number(v);
      }
    }

    const welcomeData = await deps.redis.get('display:current_welcome');
    if (welcomeData) {
      const parsed = JSON.parse(welcomeData) as Record<string, any>;
      parsed.reactions = displayCounts;
      await deps.redis.set('display:current_welcome', JSON.stringify(parsed), 'EX', 120);
    }

    return reply.send({ ok: true, counts: displayCounts });
  });
}
