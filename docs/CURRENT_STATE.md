# Current repository state

Audit date: 30 October 2026. Product name: Sylpace.

## What exists

- Before implementation (audit snapshot): one Next.js 14 application at the repository root, with public landing page, member pages, admin pages, and PWA assets in the same deployment.
- A SQLite Prisma schema in `prisma/schema.prisma` and a separate PostgreSQL/Supabase schema in `supabase/schema.sql`.
- Client-side Supabase auth and data access in `src/lib/auth-supabase.ts`, `src/lib/supabase.ts`, and `src/lib/stride-db.ts`. Multiple member and admin pages depend on those operations.
- A service worker and install prompt exist. The app currently serves marketing copy at `/`, so the installed PWA does not yet meet the requirement to open on authentication.
- The current design has green `#18A957`, light and dark theme variables, reduced-motion CSS, focus-visible outlines, Lucide icons, and Framer Motion.
- The repository has `.env.example`, but no marketing/app monorepo, waitlist repository, API, shared UI package, CI workflow, hosted development setup, or documentation for decisions and learning notes.
- At the time of the audit, `README.md` was effectively empty, the package was named `stride`, and visible copy, email defaults, PWA metadata, and storage keys contained the old product name.

## Main gaps against the PRD

- Public marketing and authenticated PWA need separate applications and deployments.
- Waitlist consent, validated server submission, abuse protection, confirmation email, privacy pages, and export do not exist.
- The new PostgreSQL/Prisma API architecture, first-party identity, sessions, policy checks, audit flow, observability, and deployment infrastructure do not exist.
- Current data access is directly from browser pages to Supabase; it is not routed through a typed API.
- Current PWA starts on marketing content and does not provide the required authenticated route behavior.
- Legal, image licensing, waitlist fields, tutor intake, hosting/budget, migration, and launch institution decisions are unresolved as recorded in `DECISIONS_NEEDED.md`.

## Execution constraints

- D1 is resolved: use Sylpace.
- Do not migrate or cut over existing accounts/data until D8 is answered.
- Do not configure production or staging infrastructure until D6 is answered.
- Do not collect waitlist data until D2 is answered and legal text is reviewed under D12.
- Existing Supabase code is legacy production behavior. Keep it isolated and explicitly out of the new marketing app while the replacement is built; remove it only with a documented migration/cutover plan.
- The workspace does not currently have Node.js on `PATH`, pnpm, or installed dependencies. Node appears to exist under `C:\node\node-v22.14.0-win-x64`; verification may require invoking it directly and installing dependencies.

## Changes made in the first implementation pass

- Isolated the legacy Next.js app under `apps/legacy`, created the new PWA under `apps/app`, and added the separate Sylpace marketing app under `apps/marketing`.
- Added workspace manifests, shared UI tokens, a generic waitlist repository interface, PostgreSQL Prisma identity/platform schema and forward migration, Fastify API health/readiness foundation, default-deny policy tests, GitHub Actions CI, and Codespaces configuration.
- Updated PWA launch behavior to `/login`, added a generic offline route and update prompt, removed private HTML/API caching, and migrated old browser storage keys to Sylpace keys without discarding existing local values.
- Rebranded visible app copy and renamed the legacy database helper to `accountability-db.ts`; retained old names only in explicit browser-key migration code and historical audit references.
- See `PHASE_STATUS.md` for acceptance status and remaining gates. Neither Phase 0 nor Phase 1 is complete.
