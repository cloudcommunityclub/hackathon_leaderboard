import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { Redis } from 'ioredis';
import { createScheduler } from '../services/scheduler.js';
import { createDisplayStateManager } from '../services/display-state.js';
import { pretixRoutes } from './pretix.js';
import { gitlabRoutes } from './gitlab.js';
import { adminRoutes } from './admin.js';
import { waveRoutes } from './wave.js';
import { getWavePageHtml } from '../templates/wave-page.js';

export function registerRoutes(
  fastify: FastifyInstance,
  deps: { prisma: PrismaClient; redis: Redis; scheduler: ReturnType<typeof createScheduler>; displayStateManager: ReturnType<typeof createDisplayStateManager>; gateway: { broadcast: (type: string, payload: any) => void } }
) {
  fastify.get('/health', async () => ({ status: 'ok', service: 'digital-india-build-server' }));

  fastify.register(pretixRoutes, { prefix: '/api/webhooks/pretix', ...deps });
  fastify.register(gitlabRoutes, { prefix: '/api/webhooks/gitlab', ...deps });
  fastify.register(adminRoutes, { prefix: '/api/admin', ...deps });
  fastify.register(waveRoutes, { prefix: '/api/wave', ...deps });

  fastify.get('/api/state', async (request, reply) => {
    const state = await deps.displayStateManager.getCurrentState();
    return reply.send(state);
  });

  fastify.get('/api/teams', async (request, reply) => {
    const teams = await deps.prisma.team.findMany({ orderBy: { name: 'asc' } });
    const onlineCount = teams.filter((t) => t.status === 'online').length;
    return reply.send({ teams, onlineCount, total: teams.length });
  });

  fastify.get('/api/messages/:channel', async (request, reply) => {
    const channel = (request.params as any).channel as string;
    const messages = await deps.prisma.displayMessage.findMany({ where: { channel }, orderBy: { createdAt: 'desc' }, take: 50 });
    return reply.send(messages.reverse());
  });

  fastify.post('/api/messages', async (request, reply) => {
    const { channel, author, content } = request.body as { channel: string; author: string; content: string };
    const message = await deps.prisma.displayMessage.create({ data: { channel, author, content, createdAt: new Date().toISOString() } });
    deps.gateway.broadcast('bot.message', message);
    return reply.send(message);
  });

  fastify.get('/wave', async (request, reply) => {
    return reply.type('text/html').send(getWavePageHtml());
  });
}

