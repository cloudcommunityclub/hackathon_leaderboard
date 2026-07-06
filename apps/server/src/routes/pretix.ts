import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { Redis } from 'ioredis';
import { createScheduler } from '../services/scheduler.js';

export async function pretixRoutes(fastify: FastifyInstance, deps: { prisma: PrismaClient; redis: Redis; scheduler: ReturnType<typeof createScheduler>; gateway: { broadcast: (type: string, payload: any) => void } }) {
  fastify.post('/', async (request, reply) => {
    try {
      const payload = request.body as any;
      const orderCode = payload?.code || payload?.order?.code;
      const attendeeEmail = payload?.attendee_email || payload?.email || '';

      if (!orderCode || !attendeeEmail) {
        return reply.status(400).send({ error: 'Missing order code or attendee email' });
      }

      const team = await deps.prisma.team.findFirst({
        where: { name: { contains: attendeeEmail.split('@')[0] } },
      });

      if (!team) {
        return reply.status(404).send({ error: 'Team not found for attendee' });
      }

      const exists = await deps.prisma.checkIn.findFirst({ where: { teamId: team.id, processed: true } });
      if (exists) {
        return reply.status(200).send({ ok: true, message: 'Already checked in' });
      }

      const receivedAt = new Date().toISOString();
      const scheduledFor = new Date(Date.now() + 18000).toISOString();

      await deps.prisma.checkIn.create({
        data: { teamId: team.id, source: 'pretix', receivedAt, scheduledFor, priority: 70, processed: false },
      });

      await deps.prisma.team.update({
        where: { id: team.id },
        data: { status: 'online', checkedInAt: receivedAt },
      });

      await deps.prisma.event.create({
        data: { type: 'team.checked_in', source: 'pretix', teamId: team.id, payload: JSON.stringify({ orderCode }), createdAt: receivedAt },
      });

      await deps.redis.set('display:current_welcome', JSON.stringify({ active: false }), 'EX', 120);

      await deps.scheduler.scheduleWelcome(team.id, scheduledFor);

      const state = await deps.redis.get('display:current_state');
      if (state) {
        const parsed = JSON.parse(state);
        parsed.teamsOnline = await deps.prisma.team.count({ where: { status: 'online' } });
        parsed.totalTeams = await deps.prisma.team.count();
        await deps.redis.set('display:current_state', JSON.stringify(parsed));
        deps.gateway.broadcast('state', { state: parsed });
      }

      request.log.info({ teamId: team.id, scheduledFor }, 'Check-in received');
      return reply.send({ ok: true, team: team.name, scheduledFor });
    } catch (err) {
      request.log.error(err);
      return reply.status(500).send({ error: 'Webhook processing failed' });
    }
  });
}
