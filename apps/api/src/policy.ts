export type Role = 'STUDENT' | 'TUTOR' | 'REVIEWER' | 'ADMIN' | 'SUPER_ADMIN';
export type Action = 'identity:read' | 'identity:manage' | 'institution:read' | 'institution:manage' | 'audit:read';

type Actor = Readonly<{ roles: readonly Role[] }>;

const grants: Partial<Record<Action, readonly Role[]>> = {
  'identity:read': ['STUDENT', 'TUTOR', 'REVIEWER', 'ADMIN', 'SUPER_ADMIN'],
  'identity:manage': ['ADMIN', 'SUPER_ADMIN'],
  'institution:read': ['STUDENT', 'TUTOR', 'REVIEWER', 'ADMIN', 'SUPER_ADMIN'],
  'institution:manage': ['ADMIN', 'SUPER_ADMIN'],
  'audit:read': ['SUPER_ADMIN'],
};

/** Authorization denies unless a role/action pair is explicitly granted here. */
export function can(actor: Actor | null | undefined, action: Action): boolean {
  if (!actor) return false;
  const permittedRoles = grants[action];
  return permittedRoles !== undefined && actor.roles.some((role) => permittedRoles.includes(role));
}
