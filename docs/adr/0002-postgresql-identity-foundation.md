# ADR 0002: PostgreSQL and first-party identity foundation

- **Status:** Accepted for new platform modules; production use is pending D6 and D8.
- **Context:** The repository has a SQLite Prisma model and a separate Supabase/Postgres schema. The target platform uses managed PostgreSQL and first-party sessions.
- **Decision:** Add a separate `packages/db` Prisma schema and forward migration for identity, opaque session hashes, roles, invites, verification tokens, audit events, feature flags, and institution structure. Existing app tables remain isolated under `apps/app` until migration is decided.
- **Alternatives:** Continue extending SQLite; use Supabase Auth; use separate schema/migration systems.
- **Consequences:** New modules have a single PostgreSQL schema. Email must be normalized before writes; the migration adds a functional lower-case unique index because Prisma cannot represent that expression in its model. Schema evolution uses expand-and-contract with tested forward migrations and documented roll-forward recovery. No account migration or production cutover is authorized until D8 is answered.
