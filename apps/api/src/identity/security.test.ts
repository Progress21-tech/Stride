import { describe, expect, it } from 'vitest';
import { hashOpaqueToken, hashPassword, newOpaqueToken, validatePassword, verifyPassword } from './security.js';

describe('identity security helpers', () => {
  it('creates high-entropy opaque tokens and stores only their digest', () => {
    const token = newOpaqueToken();
    expect(Buffer.from(token, 'base64url')).toHaveLength(32);
    expect(hashOpaqueToken(token)).not.toBe(token);
    expect(hashOpaqueToken(token)).toHaveLength(64);
  });

  it('checks minimum length and rejects common passwords', () => {
    expect(validatePassword('short')).toMatch(/10 characters/);
    expect(validatePassword('Password123')).toMatch(/common/);
    expect(validatePassword('correct horse battery')).toBeNull();
  });

  it('hashes and verifies using Argon2id', async () => {
    const hash = await hashPassword('correct horse battery');
    expect(hash).toMatch(/^\$argon2id\$/);
    await expect(verifyPassword(hash, 'correct horse battery')).resolves.toBe(true);
    await expect(verifyPassword(hash, 'incorrect password')).resolves.toBe(false);
  });
});
