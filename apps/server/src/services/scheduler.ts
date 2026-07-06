import { Redis } from 'ioredis';
import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';
import { Welcome } from '@build-server/shared';

const CTA_LABELS = [
  'Wave to say hi!',
  'Send build energy',
  'Welcome builders',
  'Good luck team',
  'Enter build mode',
  'Ship it.',
];

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

export function createScheduler(deps: {
  redis: Redis;
  prisma: PrismaClient;
  displayStateManager: { getCurrentState: () => Promise<any>; publishState: (state: any) => Promise<void> };
  gateway: { broadcast: (type: string, payload: any) => void };
}) {
  const QUEUE_KEY = 'welcome:queue';

  const triggerWelcome = async (teamId: string) => {
    const team = await deps.prisma.team.findUnique({ where: { id: teamId } });
    if (!team) return;

    const welcome: Welcome = {
      id: nanoid(),
      teamId,
      teamName: team.name,
      college: team.college,
      track: team.track,
      template: pick(JOIN_TEMPLATES).replace('{team}', team.name),
      ctaLabel: pick(CTA_LABELS),
      startedAt: new Date().toISOString(),
      endsAt: new Date(Date.now() + 15000).toISOString(),
      reactions: {},
    };

    const state = await deps.displayStateManager.getCurrentState();
    state.welcome = welcome;
    state.activeChannel = 'arrivals';
    await deps.displayStateManager.publishState(state);

    deps.gateway.broadcast('welcome.start', { welcome });

    setTimeout(async () => {
      const current = await deps.displayStateManager.getCurrentState();
      if (current.welcome?.id === welcome.id) {
        current.welcome = null;
        await deps.displayStateManager.publishState(current);
        deps.gateway.broadcast('welcome.end', { welcomeId: welcome.id });
      }
    }, 15000);
  };

  // Start background queue polling for resilient welcome scheduling across restarts
  const pollQueue = async () => {
    try {
      const now = Date.now();
      const readyTeams = await deps.redis.zrangebyscore(QUEUE_KEY, 0, now);
      if (readyTeams.length > 0) {
        for (const teamId of readyTeams) {
          const removed = await deps.redis.zrem(QUEUE_KEY, teamId);
          if (removed > 0) {
            await triggerWelcome(teamId);
          }
        }
      }
    } catch (e) {
      console.error('Error polling welcome queue from Redis:', e);
    }
  };

  const timer = setInterval(pollQueue, 1500);

  return {
    async scheduleWelcome(teamId: string, scheduledFor: string) {
      const targetTime = new Date(scheduledFor).getTime();
      await deps.redis.zadd(QUEUE_KEY, targetTime, teamId);
    },
    stop() {
      clearInterval(timer);
    },
  };
}
