import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { prisma } from '@sylpace/db';
import { problemSchema } from '@sylpace/contracts';
import { can } from '../policy.js';
import { createMailer } from './mailer.js';
import {
  CSRF_COOKIE, SESSION_COOKIE, createSession, getSessionActor, hashOpaqueToken,
  hashPassword, newOpaqueToken, normalizeEmail, safeEqual, validatePassword,
  verifyPassword, revokeSession,
} from './security.js';

type RouteOptions = { allowedOrigins: string[] };
export const authSchemas = {
  signup: z.object({ name: z.string().trim().min(2).max(80), email: z.string().trim().email().max(320), password: z.string() }).strict(),
  login: z.object({ email: z.string().trim().email().max(320), password: z.string() }).strict(),
  email: z.object({ email: z.string().trim().email().max(320) }).strict(),
  reset: z.object({ token: z.string().min(20).max(256), password: z.string() }).strict(),
  token: z.object({ token: z.string().min(20).max(256) }).strict(),
};
const successMessage = 'If the information matches an account, the requested message will be sent.';
const invalidCredentials = 'Email or password is incorrect.';
const sessionCookieOptions = { path: '/', httpOnly: true, secure: true, sameSite: 'lax' as const, maxAge: 60 * 60 * 24 * 30 };
const csrfCookieOptions = { path: '/', httpOnly: false, secure: true, sameSite: 'lax' as const, maxAge: 60 * 60 * 24 };

function problem(reply: FastifyReply, status: number, title: string, code: string) {
  return reply.code(status).type('application/problem+json').send(problemSchema.parse({ type: 'about:blank', title, status, code }));
}

function validCsrf(request: FastifyRequest, allowedOrigins: string[]): boolean {
  const origin = request.headers.origin;
  const cookieToken = request.cookies[CSRF_COOKIE];
  const headerToken = request.headers['x-csrf-token'];
  return typeof origin === 'string' && allowedOrigins.includes(origin) && typeof cookieToken === 'string' && typeof headerToken === 'string' && safeEqual(cookieToken, headerToken);
}

function setSessionCookie(reply: FastifyReply, token: string) {
  reply.setCookie(SESSION_COOKIE, token, sessionCookieOptions);
}

function makeVerificationLink(path: string, token: string): string | null {
  const base = process.env.SYLPACE_APP_URL;
  if (!base) return null;
  return new URL(`${path}?token=${encodeURIComponent(token)}`, base).toString();
}

async function createOneTimeToken(userId: string, email: string, purpose: string, expiresInMs: number): Promise<string> {
  const token = newOpaqueToken();
  await prisma.verificationToken.create({ data: { userId, email, purpose, tokenHash: hashOpaqueToken(token), expiresAt: new Date(Date.now() + expiresInMs) } });
  return token;
}

export async function registerAuthRoutes(app: FastifyInstance, options: RouteOptions) {
  const mailer = createMailer();
  const formRate = { max: 5, timeWindow: '15 minutes' };

  app.get('/csrf', async (_request, reply) => {
    const token = newOpaqueToken();
    reply.setCookie(CSRF_COOKIE, token, csrfCookieOptions);
    return { csrfToken: token };
  });

  app.post('/signup', { config: { rateLimit: formRate } }, async (request, reply) => {
    if (!validCsrf(request, options.allowedOrigins)) return problem(reply, 403, 'Request verification failed', 'CSRF_FAILED');
    const parsed = authSchemas.signup.safeParse(request.body);
    if (!parsed.success) return problem(reply, 400, 'Invalid signup details', 'INVALID_INPUT');
    const passwordError = validatePassword(parsed.data.password);
    if (passwordError) return problem(reply, 400, passwordError, 'WEAK_PASSWORD');
    const email = normalizeEmail(parsed.data.email);
    const existing = await prisma.user.findFirst({ where: { email }, select: { id: true } });
    if (existing) return reply.code(202).send({ message: successMessage });

    const passwordHash = await hashPassword(parsed.data.password);
    const verificationToken = newOpaqueToken();
    const tokenHash = hashOpaqueToken(verificationToken);
    let createdUser: { id: string; name: string };
    try {
      createdUser = await prisma.$transaction(async (tx) => {
        const created = await tx.user.create({ data: { email, name: parsed.data.name, passwordHash, roles: { create: [{ role: 'STUDENT' }] } } });
        await tx.verificationToken.create({ data: { userId: created.id, email, purpose: 'EMAIL_VERIFICATION', tokenHash, expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) } });
        await tx.auditEvent.create({ data: { actorId: created.id, action: 'SIGNUP_REQUESTED', objectType: 'USER', objectId: created.id } });
        return created;
      });
    } catch (error) {
      if (typeof error === 'object' && error && 'code' in error && error.code === 'P2002') return reply.code(202).send({ message: successMessage });
      request.log.error('Signup processing failed.');
      return problem(reply, 503, 'Signup is temporarily unavailable', 'SIGNUP_UNAVAILABLE');
    }
    const link = makeVerificationLink('/verify', verificationToken);
    if (mailer && link) {
      try { await mailer.send({ to: email, subject: 'Verify your Sylpace account', text: `Hello ${createdUser.name},\n\nVerify your email address using this link. It expires in 24 hours:\n${link}\n\nIf you did not request this, you can ignore this email.` }); }
      catch { request.log.error('Verification email delivery failed.'); }
    }
    return reply.code(202).send({ message: successMessage });
  });

  app.post('/login', { config: { rateLimit: formRate } }, async (request, reply) => {
    if (!validCsrf(request, options.allowedOrigins)) return problem(reply, 403, 'Request verification failed', 'CSRF_FAILED');
    const parsed = authSchemas.login.safeParse(request.body);
    if (!parsed.success) return problem(reply, 400, 'Invalid login details', 'INVALID_INPUT');
    const email = normalizeEmail(parsed.data.email);
    const user = await prisma.user.findFirst({ where: { email, status: 'ACTIVE' }, include: { roles: { select: { role: true } } } });
    const validPassword = user?.passwordHash ? await verifyPassword(user.passwordHash, parsed.data.password) : false;
    if (!user || !validPassword || !user.emailVerifiedAt) {
      await prisma.auditEvent.create({ data: { action: 'LOGIN_FAILED', objectType: 'USER', objectId: user?.id ?? null } });
      return problem(reply, 401, invalidCredentials, 'INVALID_CREDENTIALS');
    }
    const token = await createSession(user.id, request.headers['user-agent']);
    setSessionCookie(reply, token);
    await prisma.auditEvent.create({ data: { actorId: user.id, action: 'LOGIN_SUCCEEDED', objectType: 'USER', objectId: user.id } });
    return { user: { id: user.id, name: user.name, email: user.email, roles: user.roles.map(({ role }) => role) } };
  });

  app.post('/logout', async (request, reply) => {
    if (!validCsrf(request, options.allowedOrigins)) return problem(reply, 403, 'Request verification failed', 'CSRF_FAILED');
    const token = request.cookies[SESSION_COOKIE];
    const userId = await revokeSession(token);
    if (userId) await prisma.auditEvent.create({ data: { actorId: userId, action: 'LOGOUT', objectType: 'USER', objectId: userId } });
    reply.clearCookie(SESSION_COOKIE, sessionCookieOptions);
    return reply.code(204).send();
  });

  app.get('/me', async (request, reply) => {
    const user = await getSessionActor(request.cookies[SESSION_COOKIE]);
    if (!user || !can(user, 'identity:read')) return problem(reply, 401, 'Authentication required', 'UNAUTHENTICATED');
    return { user };
  });

  app.post('/verify', { config: { rateLimit: formRate } }, async (request, reply) => {
    if (!validCsrf(request, options.allowedOrigins)) return problem(reply, 403, 'Request verification failed', 'CSRF_FAILED');
    const parsed = authSchemas.token.safeParse(request.body);
    if (!parsed.success) return problem(reply, 400, 'Invalid verification token', 'INVALID_INPUT');
    const tokenHash = hashOpaqueToken(parsed.data.token);
    const now = new Date();
    const verification = await prisma.verificationToken.findFirst({ where: { tokenHash, purpose: 'EMAIL_VERIFICATION', usedAt: null, expiresAt: { gt: now } } });
    if (!verification) return problem(reply, 400, 'Verification link is invalid or expired', 'INVALID_TOKEN');
    const verified = await prisma.$transaction(async (tx) => {
      const claimed = await tx.verificationToken.updateMany({ where: { id: verification.id, usedAt: null, expiresAt: { gt: now } }, data: { usedAt: now } });
      if (claimed.count !== 1) return false;
      const user = await tx.user.findUnique({ where: { id: verification.userId }, select: { id: true } });
      if (!user) return false;
      await tx.user.update({ where: { id: user.id }, data: { emailVerifiedAt: now } });
      await tx.auditEvent.create({ data: { action: 'EMAIL_VERIFIED', objectType: 'USER', objectId: user.id } });
      return true;
    });
    if (!verified) return problem(reply, 400, 'Verification link is invalid or expired', 'INVALID_TOKEN');
    return { message: 'Email verified. You can now sign in.' };
  });

  app.post('/password-reset/request', { config: { rateLimit: formRate } }, async (request, reply) => {
    if (!validCsrf(request, options.allowedOrigins)) return problem(reply, 403, 'Request verification failed', 'CSRF_FAILED');
    const parsed = authSchemas.email.safeParse(request.body);
    if (!parsed.success) return problem(reply, 400, 'Invalid email address', 'INVALID_INPUT');
    const email = normalizeEmail(parsed.data.email);
    const user = await prisma.user.findFirst({ where: { email, status: 'ACTIVE' }, select: { id: true } });
    if (user) {
      const token = await createOneTimeToken(user.id, email, 'PASSWORD_RESET', 60 * 60 * 1000);
      const link = makeVerificationLink('/reset-password', token);
      if (mailer && link) {
        try { await mailer.send({ to: email, subject: 'Reset your Sylpace password', text: `Use this link to reset your password. It expires in one hour:\n${link}\n\nIf you did not request this, you can ignore this email.` }); }
        catch { request.log.error('Password reset email delivery failed.'); }
      }
      await prisma.auditEvent.create({ data: { actorId: user.id, action: 'PASSWORD_RESET_REQUESTED', objectType: 'USER', objectId: user.id } });
    }
    return reply.code(202).send({ message: successMessage });
  });

  app.post('/password-reset/complete', { config: { rateLimit: formRate } }, async (request, reply) => {
    if (!validCsrf(request, options.allowedOrigins)) return problem(reply, 403, 'Request verification failed', 'CSRF_FAILED');
    const parsed = authSchemas.reset.safeParse(request.body);
    if (!parsed.success) return problem(reply, 400, 'Invalid password reset details', 'INVALID_INPUT');
    const passwordError = validatePassword(parsed.data.password);
    if (passwordError) return problem(reply, 400, passwordError, 'WEAK_PASSWORD');
    const tokenHash = hashOpaqueToken(parsed.data.token);
    const now = new Date();
    const token = await prisma.verificationToken.findFirst({ where: { tokenHash, purpose: 'PASSWORD_RESET', usedAt: null, expiresAt: { gt: now } } });
    if (!token) return problem(reply, 400, 'Password reset link is invalid or expired', 'INVALID_TOKEN');
    const passwordHash = await hashPassword(parsed.data.password);
    const completed = await prisma.$transaction(async (tx) => {
      const claimed = await tx.verificationToken.updateMany({ where: { id: token.id, usedAt: null, expiresAt: { gt: now } }, data: { usedAt: now } });
      if (claimed.count !== 1) return false;
      const user = await tx.user.findUnique({ where: { id: token.userId }, select: { id: true } });
      if (!user) return false;
      await tx.user.update({ where: { id: user.id }, data: { passwordHash } });
      await tx.session.updateMany({ where: { userId: user.id, revokedAt: null }, data: { revokedAt: now } });
      await tx.auditEvent.create({ data: { actorId: user.id, action: 'PASSWORD_RESET_COMPLETED', objectType: 'USER', objectId: user.id } });
      return true;
    });
    if (!completed) return problem(reply, 400, 'Password reset link is invalid or expired', 'INVALID_TOKEN');
    return { message: 'Password reset. Sign in using your new password.' };
  });
}
