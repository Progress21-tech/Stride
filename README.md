# Sylpace

Sylpace is a university learning platform in development. This repository is moving from a single Next.js/Supabase application to a pnpm monorepo with separate marketing, PWA, API, database, and shared packages.

## Workspace

- `apps/marketing`: coming-soon site and draft legal pages.
- `apps/app`: new installable PWA using the first-party API for its initial identity flows.
- `apps/legacy`: existing member application, retained while the D8 data-migration decision is open.
- `apps/api`: Fastify modular API foundation.
- `packages/db`: PostgreSQL Prisma schema for the new platform.
- `packages/ui`, `packages/contracts`, and `packages/waitlist`: planned shared packages; waitlist collection remains gated by D2 and D12.

## Local setup

Use Node.js 24.11+ and pnpm 9, then run `pnpm install`. Copy `.env.example` to `.env` and fill in the hosted services you have configured. Codespaces creates the example `.env` automatically. Production services and credentials are not provisioned until D6 is answered. Secure `__Host-` auth cookies require HTTPS, which Codespaces supplies for forwarded ports.

Run `pnpm dev:marketing` for the public site, `pnpm dev:app` for the new PWA, or `pnpm dev:api` for the API foundation. The root `vercel.json` configures one multi-service Vercel project: marketing at `/` on the main host, PWA at `/login` and `/app` on the app host, the legacy Supabase workspace on the admin host, and Fastify under `/api`. See `docs/VERCEL_DEPLOYMENT.md`.

The app still depends on the existing Supabase project. This is legacy behavior only, pending the D8 migration decision and the first-party identity implementation. New code must not add Supabase usage outside `packages/waitlist`.

See `docs/CURRENT_STATE.md`, `docs/DECISIONS_NEEDED.md`, and `SYLPACE-PRODUCT-ARCHITECTURE.md` before changing architecture or enabling data collection.
