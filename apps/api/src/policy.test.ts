import { describe, expect, it } from 'vitest';
import { can } from './policy.js';

describe('can', () => {
  it('denies missing actors and actions without a grant', () => {
    expect(can(null, 'identity:read')).toBe(false);
    expect(can({ roles: ['STUDENT'] }, 'audit:read')).toBe(false);
  });

  it('allows only an explicitly authorized role', () => {
    expect(can({ roles: ['SUPER_ADMIN'] }, 'audit:read')).toBe(true);
    expect(can({ roles: ['ADMIN'] }, 'audit:read')).toBe(false);
  });

  it('supports users who hold more than one role', () => {
    expect(can({ roles: ['STUDENT', 'ADMIN'] }, 'identity:manage')).toBe(true);
  });

  it('covers every role against each protected action with an explicit matrix', () => {
    const roles = ['STUDENT', 'TUTOR', 'REVIEWER', 'ADMIN', 'SUPER_ADMIN'] as const;
    const cases = [
      ['identity:read', [true, true, true, true, true]],
      ['identity:manage', [false, false, false, true, true]],
      ['institution:read', [true, true, true, true, true]],
      ['institution:manage', [false, false, false, true, true]],
      ['audit:read', [false, false, false, false, true]],
    ] as const;
    for (const [action, expected] of cases) roles.forEach((role, index) => expect(can({ roles: [role] }, action)).toBe(expected[index]));
  });
});
