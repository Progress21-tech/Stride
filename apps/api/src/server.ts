import Fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import Redis from 'ioredis';
import { z } from 'zod';
import { prisma } from '@sylpace/db';
import { problemSchema } from '@sylpace/contracts';
import { registerAuthRoutes } from './identity/routes.js';
import { openApiDocument } from './openapi.js';

const envSchema = z.object({
  API_PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  API_CORS_ORIGINS: z.string().default('http://localhost:3000,http://localhost:3001'),
  REDIS_URL: z.string().optional().transform((value) => value?.trim() || undefined).pipe(z.string().url().optional()),
});

export async function buildServer() {
  const env = envSchema.parse(process.env);
  if (process.env.NODE_ENV === 'production' && (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL || !process.env.SYLPACE_APP_URL)) {
    throw new Error('Email delivery and app URL configuration are required in production.');
  }
  const allowedOrigins = env.API_CORS_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean);
  if (process.env.NODE_ENV === 'production' && !env.REDIS_URL) throw new Error('REDIS_URL is required in production.');
  const redis = env.REDIS_URL ? new Redis(env.REDIS_URL, { lazyConnect: true, maxRetriesPerRequest: 1 }) : undefined;
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL ?? 'info',
      redact: ['req.headers.authorization', 'req.headers.cookie', 'res.headers.set-cookie'],
    },
    bodyLimit: 1_048_576,
    requestTimeout: 15_000,
  });

  await app.register(helmet);
  await app.register(cookie);
  await app.register(cors, { origin: allowedOrigins, credentials: true, methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'] });
  await app.register(rateLimit, { max: 100, timeWindow: '1 minute', ...(redis ? { redis } : {}) });
  app.get('/healthz', async () => ({ status: 'ok' }));
  app.get('/v1/openapi.json', async () => openApiDocument);
  app.get('/readyz', async (_request, reply) => {
    try {
      if (redis) await redis.ping();
      else if (process.env.NODE_ENV === 'production') throw new Error('Redis unavailable');
      await prisma.$queryRaw`SELECT 1`;
      return { status: 'ready' };
    } catch {
      return reply.code(503).send(problemSchema.parse({
        type: 'about:blank', title: 'Service unavailable', status: 503, code: 'DATABASE_UNAVAILABLE',
      }));
    }
  });
  await app.register(registerAuthRoutes, { prefix: '/v1/auth', allowedOrigins });

  return { app, port: env.API_PORT, redis };
}

if (process.env.NODE_ENV !== 'test') {
  const main = await buildServer();
  await main.app.listen({ port: main.port, host: '0.0.0.0' });
  const close = async () => { await main.app.close(); await main.redis?.quit(); await prisma.$disconnect(); };
  process.once('SIGINT', () => void close());
  process.once('SIGTERM', () => void close());
}
