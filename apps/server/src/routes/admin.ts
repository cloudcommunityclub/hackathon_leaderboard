import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';

export async function adminRoutes(fastify: FastifyInstance, deps: { prisma: PrismaClient; gateway: { broadcast: (type: string, payload: any) => void } }) {
  fastify.post('/announcement', async (request, reply) => {
    const body = request.body as { content: string; channel: string; isEmergency?: boolean; createdBy: string };
    if (!body?.content || !body?.channel || !body?.createdBy) {
      return reply.status(400).send({ error: 'Missing required fields' });
    }

    const announcement = await deps.prisma.announcement.create({
      data: { content: body.content, channel: body.channel, isEmergency: Boolean(body.isEmergency), createdBy: body.createdBy, createdAt: new Date().toISOString() },
    });

    await deps.prisma.displayMessage.create({
      data: { channel: body.channel, author: 'Ops Bot', content: `**${body.isEmergency ? 'EMERGENCY' : 'Announcement'}**\n\n${body.content}`, createdAt: new Date().toISOString() },
    });

    if (body.isEmergency) {
      deps.gateway.broadcast('announcement.show', { content: body.content, channel: body.channel });
    } else {
      deps.gateway.broadcast('bot.message', { channel: body.channel, author: 'Ops Bot', content: body.content });
    }

    return reply.send(announcement);
  });

  fastify.post('/emergency/start', async (request, reply) => {
    const { content, createdBy } = request.body as { content: string; createdBy: string };
    if (!content || !createdBy) return reply.status(400).send({ error: 'Missing fields' });

    const announcement = await deps.prisma.announcement.create({
      data: { content, channel: 'announcements', isEmergency: true, createdBy, createdAt: new Date().toISOString() },
    });

    await deps.prisma.displayMessage.create({
      data: { channel: 'announcements', author: 'Ops Bot', content: `**🚨 EMERGENCY**\n\n${content}`, createdAt: new Date().toISOString() },
    });

    deps.gateway.broadcast('announcement.show', { content, channel: 'announcements' });
    return reply.send(announcement);
  });

  fastify.post('/emergency/end', async (request, reply) => {
    deps.gateway.broadcast('announcement.end', {});
    return reply.send({ ok: true });
  });

  fastify.post('/phase', async (request, reply) => {
    const { phase } = request.body as { phase: string };
    if (!phase) return reply.status(400).send({ error: 'Missing phase' });

    const state = await deps.prisma.$queryRaw`SELECT * FROM events WHERE type = 'ops.phase_changed' ORDER BY created_at DESC LIMIT 1`;
    
    deps.gateway.broadcast('phase.change', { phase });
    return reply.send({ ok: true, phase });
  });

  fastify.post('/rotation/pause', async (request, reply) => {
    deps.gateway.broadcast('rotation.pause', { rotationPaused: true });
    return reply.send({ ok: true, rotationPaused: true });
  });

  fastify.post('/rotation/resume', async (request, reply) => {
    deps.gateway.broadcast('rotation.resume', { rotationPaused: false });
    return reply.send({ ok: true, rotationPaused: false });
  });

  fastify.post('/channel', async (request, reply) => {
    const { channel } = request.body as { channel: string };
    if (!channel) return reply.status(400).send({ error: 'Missing channel' });
    deps.gateway.broadcast('channel.change', { channel });
    return reply.send({ ok: true, channel });
  });

  fastify.get('/displays', async (request, reply) => {
    const displays = await deps.prisma.displayClient.findMany();
    return reply.send(displays);
  });

  fastify.get('/announcements', async (request, reply) => {
    const announcements = await deps.prisma.announcement.findMany({ orderBy: { createdAt: 'desc' }, take: 20 });
    return reply.send(announcements);
  });
}
