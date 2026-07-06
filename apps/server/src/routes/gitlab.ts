import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';

const JOIN_TEMPLATES = [
  '{team} joined the Build Server.',
  '{team} is now online.',
  '{team} entered build mode.',
  '{team} connected to the venue.',
  '{team} arrived in the lobby.',
  '{team} synced with the Hall.',
  'Signal acquired: {team}.',
  '{team} is ready to build.',
  '{team} entered the Hall of Builders.',
  'Welcome, {team}. Build something remarkable.',
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function gitlabRoutes(fastify: FastifyInstance, deps: { prisma: PrismaClient }) {
  fastify.post('/', async (request, reply) => {
    try {
      const payload = request.body as any;
      const teamName = payload?.project?.namespace?.full_path || payload?.user?.username || 'Unknown Team';
      const eventType = payload?.object_kind || 'push';
      const totalCommits = payload?.commits?.length || 0;
      const linesAdded = payload?.commits?.reduce((sum: number, c: any) => sum + (c?.stats?.additions || 0), 0) || 0;

      let message = '';
      if (eventType === 'push') {
        message = `pushed ${totalCommits} commits with +${linesAdded} lines`;
      } else if (eventType === 'merge_request') {
        message = `opened MR: ${payload?.object_attributes?.title || 'unnamed'}`;
      } else {
        message = `${eventType} event received`;
      }

      const content = `**GitLab Bot**\n\n\`\`\`\n${teamName} ${message}\n\`\`\``;

      await deps.prisma.displayMessage.create({
        data: { channel: 'gitlab-live', author: 'GitLab Bot', content, metadata: JSON.stringify({ teamName, eventType, totalCommits, linesAdded }), createdAt: new Date().toISOString() },
      });

      return reply.send({ ok: true });
    } catch (err) {
      request.log.error(err);
      return reply.status(500).send({ error: 'GitLab webhook failed' });
    }
  });

  fastify.post('/milestone', async (request, reply) => {
    const { teamName, milestone } = request.body as { teamName: string; milestone: string };
    const message = `**GitLab Bot**\n\n🎉 ${teamName} unlocked ${milestone}.`;

    await deps.prisma.displayMessage.create({
      data: { channel: 'milestones', author: 'GitLab Bot', content: message, createdAt: new Date().toISOString() },
    });

    return reply.send({ ok: true });
  });
}
