import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import argon2 from 'argon2';
import { prisma } from '@sylpace/db';

export const SESSION_COOKIE = '__Host-sylpace_session';
export const CSRF_COOKIE = '__Host-sylpace_csrf';
const IDLE_DAYS = 30;
const ABSOLUTE_DAYS = 90;
const REFRESH_AFTER_MS = 15 * 60 * 1000;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function hashOpaqueToken(token: string): string {
  return createHash('sha256').update(token, 'utf8').digest('hex');
}

export function newOpaqueToken(): string {
  return randomBytes(32).toString('base64url');
}

export function safeEqual(left: string, right: string): boolean {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

export const commonPasswords = new Set([
  'password123', '1234567890', 'qwerty12345', 'iloveyou123', 'password1234',
  'welcome1234', 'admin123456', 'letmein1234', 'passw0rd123', 'football123',
]);

export function validatePassword(password: string): string | null {
  if (password.length < 10) return 'Password must be at least 10 characters.';
  if (password.length > 128) return 'Password must be 128 characters or fewer.';
  if (commonPasswords.has(password.toLowerCase())) return 'Choose a less common password.';
  return null;
}

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, { type: argon2.argon2id, memoryCost: 19456, timeCost: 2, parallelism: 1 });
}

export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  // Argon2's encoded hash carries its algorithm and parameters; verification
  // needs no hashing options.
  try { return await argon2.verify(hash, password); }
  catch { return false; }
}

export type Role = 'STUDENT' | 'TUTOR' | 'REVIEWER' | 'ADMIN' | 'SUPER_ADMIN';
export type SessionActor = { id: string; name: string; email: string; roles: Role[] };

export async function createSession(userId: string, userAgent?: string): Promise<string> {
  const token = newOpaqueToken();
  const now = new Date();
  await prisma.session.create({ data: {
    userId,
    tokenHash: hashOpaqueToken(token),
    expiresAt: new Date(now.getTime() + IDLE_DAYS * 24 * 60 * 60 * 1000),
    lastUsedAt: now,
    userAgent: userAgent?.slice(0, 512),
  } });
  return token;
}

export async function getSessionActor(token: string | undefined): Promise<SessionActor | null> {
  if (!token || token.length > 100) return null;
  const now = new Date();
  const session = await prisma.session.findFirst({
    where: { tokenHash: hashOpaqueToken(token), revokedAt: null, expiresAt: { gt: now }, user: { status: 'ACTIVE' } },
    include: { user: { include: { roles: { select: { role: true } } } } },
  });
  if (!session) return null;
  const absoluteExpiry = new Date(session.createdAt.getTime() + ABSOLUTE_DAYS * 24 * 60 * 60 * 1000);
  if (absoluteExpiry <= now) {
    await prisma.session.update({ where: { id: session.id }, data: { revokedAt: now } });
    return null;
  }
  if (now.getTime() - session.lastUsedAt.getTime() >= REFRESH_AFTER_MS) {
    await prisma.session.update({ where: { id: session.id }, data: {
      lastUsedAt: now,
      expiresAt: new Date(Math.min(now.getTime() + IDLE_DAYS * 24 * 60 * 60 * 1000, absoluteExpiry.getTime())),
    } });
  }
  return { id: session.user.id, name: session.user.name, email: session.user.email, roles: session.user.roles.map(({ role }) => role) };
}

export async function revokeSession(token: string | undefined): Promise<string | null> {
  if (!token || token.length > 100) return null;
  const session = await prisma.session.findUnique({ where: { tokenHash: hashOpaqueToken(token) }, select: { id: true, userId: true } });
  if (!session) return null;
  await prisma.session.update({ where: { id: session.id }, data: { revokedAt: new Date() } });
  return session.userId;
}
