# Phase execution status

Updated: 30 October 2026. The implementation is a foundation pass, not a launch approval.

## Phase 0 — Waitlist and coming-soon site

- **Built:** Separate `apps/marketing` Next app; Sylpace launch copy; mobile layouts; light/system-dark styling; reduced-motion handling; shared UI token import; placeholder image blocks; privacy and terms drafts; metadata, Open Graph image, robots, sitemap; image manifest validation and AVIF/WebP generation pipeline.
- **Built:** A Contact page with no invented email address, plus a tutor information section that does not open applications while D5 is unresolved.
- **Built:** The public homepage is the waitlist page, open without login. It collects email only with explicit consent, persists normalized entries and consent version/time through a rate-limited, origin-checked API endpoint, rejects duplicate emails safely, and provides a generic response.
- **Blocked on D5:** Tutor intake destination/form; the public page explains intake details are still being decided.
- **Blocked on D9:** Production photography and licensing. Build passes with neutral labeled placeholders only.
- **Blocked on D6/D12:** Production database/API configuration and final privacy/legal review.
- **Not verified:** Lighthouse targets and automated accessibility checks. No local Node.js runtime or dependencies are available in the current workspace.
- **Phase 0 acceptance:** Not complete. Do not enable production API collection until D6 and D12 are resolved, the privacy notice is approved, a monitored privacy contact and retention period are set, and staging review is complete.

## Phase 1 — Platform foundation

- **Built:** `apps/api` Fastify service with health/readiness routes, structured Pino logs, Helmet headers, explicit CORS origin list, Redis-backed rate limiting, body/request limits, Zod problem-details and OpenAPI schemas; deny-by-default policy helper with a role matrix test; `packages/db` PostgreSQL Prisma 7 schema and initial forward migration for identity, hashed sessions, roles, invites, audit, feature flags, and institutions; PostgreSQL smoke test in CI; Codespaces Node 24 configuration.
- **Built:** First-party API signup, login, logout, current-user, email verification, password-reset request/completion, Argon2id password hashing, normalized email, hashed one-time/session tokens, session idle/absolute expiry, CSRF origin and double-submit token checks, generic email responses, and audit records. New `apps/app` has sign-in, signup, verification, reset, and protected home shell.
- **Built:** PWA start URL and `/` redirect to `/login`; `/offline` route; update prompt; legacy cache removal; only generic offline HTML and static icons/manifest are cached. Authenticated HTML and API responses are network-only.
- **Blocked on D6:** Managed PostgreSQL, Redis, storage, staging/production environments, secrets manager, backups/PITR, restore drill, deployments, and provider-specific connection setup.
- **Blocked on D8:** Existing-account/data migration, Supabase removal from legacy member features, and production cutover.
- **Still to implement before Phase 1 acceptance:** Google OIDC with PKCE/state, email change, logout-all-devices, progressively delayed per-account failure protection, auth-flow and session security tests, route-policy coverage for all future protected endpoints, admin shell against the API, waitlist invitation import, OpenAPI client generation, and decommission schedule with D8-confirmed dates. The new PWA currently has only an initial Today shell.
- **CI limitation:** Supabase import checking covers new code. The existing `apps/app` is temporarily allowlisted as legacy until D8; removing that exception is required before final cutover.
- **Phase 1 acceptance:** Not complete. No production data is connected to the new schema. Apply the migration only to an isolated development/staging database after D6 is answered.

## Verification environment

This machine has neither a runnable Node.js executable nor pnpm on `PATH`; the discovered Node installation directory did not contain `node.exe`. JSON, source formatting, Next builds, Prisma validation/migration, and automated tests still need to run in the provided Codespaces environment or another supported Node 24 environment. CI has been configured to run those checks against PostgreSQL 16.
