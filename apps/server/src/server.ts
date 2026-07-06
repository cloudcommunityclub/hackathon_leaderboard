import Fastify from 'fastify';
import cors from '@fastify/cors';
import websocket from '@fastify/websocket';
import { Redis } from 'ioredis';
import { PrismaClient } from '@prisma/client';
import { registerRoutes } from './routes/index.js';
import { createWebSocketGateway } from './websocket/gateway.js';
import { createScheduler } from './services/scheduler.js';
import { createDisplayStateManager } from './services/display-state.js';

const fastify = Fastify({ logger: true });

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379');
const displayStateManager = createDisplayStateManager(redis);
const gateway = createWebSocketGateway(fastify, { redis, displayStateManager });
const scheduler = createScheduler({ redis, prisma, displayStateManager, gateway });

await fastify.register(cors, { origin: '*' });
await fastify.register(websocket);

registerRoutes(fastify, { prisma, redis, scheduler, displayStateManager, gateway });

const start = async () => {
  try {
    await fastify.listen({ port: Number(process.env.PORT) || 3001, host: '0.0.0.0' });
    console.log('Digital India Build Server running on port', process.env.PORT || 3001);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();