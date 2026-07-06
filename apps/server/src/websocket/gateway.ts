import { FastifyInstance } from 'fastify';
import { Redis } from 'ioredis';
import { createDisplayStateManager } from '../services/display-state.js';

export function createWebSocketGateway(fastify: FastifyInstance, deps: { redis: Redis; displayStateManager: ReturnType<typeof createDisplayStateManager> }) {
  const clients = new Set<any>();

  fastify.get('/ws/display', { websocket: true }, (connection /*, request*/) => {
    clients.add(connection.socket);
    const displayId = `display_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    connection.socket.on('message', async (message: Buffer) => {
      try {
        const msg = JSON.parse(message.toString());
        if (msg.type === 'display.hello') {
          await deps.redis.hset('display:clients', displayId, JSON.stringify({ connectedAt: new Date().toISOString(), lastHeartbeat: new Date().toISOString() }));
          connection.socket.send(JSON.stringify({ type: 'display.state', data: await deps.displayStateManager.getCurrentState() }));
        } else if (msg.type === 'display.heartbeat') {
          await deps.redis.hset('display:clients', displayId, JSON.stringify({ connectedAt: new Date().toISOString(), lastHeartbeat: new Date().toISOString() }));
        }
      } catch (err) {
        connection.socket.send(JSON.stringify({ type: 'display.error', error: 'Invalid message' }));
      }
    });

    connection.socket.on('close', async () => {
      clients.delete(connection.socket);
      await deps.redis.hdel('display:clients', displayId);
    });
  });

  return {
    broadcast(type: string, payload: any) {
      const msg = JSON.stringify({ type, ...payload });
      for (const socket of clients) {
        try { if (socket.readyState === 1) socket.send(msg); } catch {}
      }
    },
  };
}
