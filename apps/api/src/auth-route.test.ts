import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { buildServer } from './server.js';

describe('auth request protections', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    process.env.API_CORS_ORIGINS = 'http://localhost:3000';
    const built = await buildServer();
    app = built.app;
    await app.ready();
  });

  afterAll(async () => { await app.close(); });

  it('requires an allowed origin and matching CSRF cookie/header for account changes', async () => {
    const csrfResponse = await app.inject({ method: 'GET', url: '/v1/auth/csrf' });
    const csrfToken = (csrfResponse.json() as { csrfToken: string }).csrfToken;
    const cookieHeader = csrfResponse.headers['set-cookie'];
    const cookie = (Array.isArray(cookieHeader) ? cookieHeader[0] : cookieHeader)?.split(';')[0] ?? '';
    expect(csrfResponse.statusCode).toBe(200);

    const missingOrigin = await app.inject({ method: 'POST', url: '/v1/auth/signup', payload: {} });
    expect(missingOrigin.statusCode).toBe(403);

    const wrongToken = await app.inject({ method: 'POST', url: '/v1/auth/signup', headers: {
      origin: 'http://localhost:3000', cookie, 'x-csrf-token': 'wrong-token',
    }, payload: {} });
    expect(wrongToken.statusCode).toBe(403);

    const validCsrfInvalidBody = await app.inject({ method: 'POST', url: '/v1/auth/signup', headers: {
      origin: 'http://localhost:3000', cookie, 'x-csrf-token': csrfToken,
    }, payload: {} });
    expect(validCsrfInvalidBody.statusCode).toBe(400);
  });
});
