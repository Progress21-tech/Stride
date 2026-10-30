# Vercel deployment layout

Deploy the marketing site and PWA as two Vercel projects from this repository. Give each project its own custom domain so the marketing homepage can own `/` and the installable app can own `/login` and `/app` without route collisions.

## Marketing project

- Framework preset: Next.js
- Root Directory: `apps/marketing`
- Production domain: the public Sylpace domain (for example, `sylpace.com`)
- Build command: default Next.js build
- Install command: `pnpm install` from the workspace root, with Vercel's option to include source files outside the Root Directory enabled
- Environment: `NEXT_PUBLIC_APP_URL=https://app.<your-domain>` and `MARKETING_INDEXING_ENABLED` set according to launch readiness

## PWA project

- Framework preset: Next.js
- Root Directory: `apps/app`
- Production domain: `app.<your-domain>`
- Build command: default Next.js build
- Install command: `pnpm install` from the workspace root, with Vercel's option to include source files outside the Root Directory enabled
- Environment: `NEXT_PUBLIC_API_URL` set to the API origin; configure CORS to allow the PWA origin and configure the mail link origin as `SYLPACE_APP_URL`

The PWA manifest starts at `/login`. That route checks the session and forwards an already signed-in user to `/app`. A successful sign-in also goes to `/app`; `/today` remains a compatibility redirect to `/app`. The public marketing site owns `/` on its separate domain.

## API project

The API is a separate Fastify service in `apps/api`, not a Next.js site. Deploy it to a Node 24 compatible service with PostgreSQL, Redis, and mail credentials after D6 is resolved. Point the PWA and marketing app's `NEXT_PUBLIC_API_URL` at that service and set `API_CORS_ORIGINS` to the exact PWA and marketing origins.

Use Node.js 24 for both Vercel projects. The root `engines` range is pinned below Node 25 so Vercel does not automatically select a future major. Install dependencies with the repository's pnpm workspace rather than npm in the app subdirectory.
