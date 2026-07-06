import { Redis } from 'ioredis';
import { PrismaClient } from '@prisma/client';
import { DisplayState } from '@build-server/shared';

const prisma = new PrismaClient();

export function createDisplayStateManager(redis: Redis) {
  const STATE_KEY = 'display:current_state';

  const getDefaultState = async (): Promise<DisplayState> => {
    const [onlineCount, total] = await Promise.all([
      prisma.team.count({ where: { status: 'online' } }),
      prisma.team.count(),
    ]);
    return {
      activeChannel: 'hall-of-builders',
      phase: 'check_in',
      welcome: null,
      teamsOnline: onlineCount,
      totalTeams: total,
      rotationPaused: false,
    };
  };

  return {
    async getCurrentState(): Promise<DisplayState> {
      const raw = await redis.get(STATE_KEY);
      if (!raw) return getDefaultState();
      try { return JSON.parse(raw); } catch { return getDefaultState(); }
    },

    async publishState(state: DisplayState) {
      await redis.set(STATE_KEY, JSON.stringify(state));
      await redis.publish('display:updates', JSON.stringify({ type: 'state', state }));
    },

    async channelChange(channel: string) {
      const state = await this.getCurrentState();
      state.activeChannel = channel;
      await this.publishState(state);
    },
  };
}
