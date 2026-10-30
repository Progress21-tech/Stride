# Vercel deployment layout

Deploy the marketing site and PWA as two Vercel projects from this repository. Give each project its own custom domain so the marketing homepage can own `/` and the installable app can own `/login` and `/app` without route collisions.

## Marketing project

- Framework preset: Next.js
- Root Directory: `apps/marketing`
- Production domain: the public Sylpace domain (for example, `sylpace.com`)
- Build command: default Next.js build
- Install command: `pnpm install` from the workspace root, with Vercel's option to include source files outside the Root Directory enabled
- Environment: `NEXT_PUBLIC_API_URL=https://<your-api-origin>`, `NEXT_PUBLIC_APP_URL=https://app.<your-domain>`, and `MARKETING_INDEXING_ENABLED` set according to launch readiness

## PWA project

- Framework preset: Next.js
- Root Directory: `apps/app`
- Production domain: `app.<your-domain>`
- Build command: default Next.js build
- Install command: `pnpm install` from the workspace root, with Vercel's option to include source files outside the Root Directory enabled
- Environment: `NEXT_PUBLIC_API_URL` set to the API origin; configure CORS to allow the PWA origin and configure the mail link origin as `SYLPACE_APP_URL`

## Temporary Supabase workspace

Keep the existing Supabase-backed member/admin workspace deployed while migration is in progress. If it is not already deployed separately, create a third Vercel project with Root Directory `apps/legacy` and its existing Supabase Auth environment variables. Use this workspace domain to sign in with your verified owner account and open `/admin/waitlist`.

The PWA manifest starts at `/login`. That route checks the session and forwards an already signed-in user to `/app`. A successful sign-in also goes to `/app`; `/today` remains a compatibility redirect to `/app`. The public marketing site owns `/` on its separate domain.

## API project

The API is a separate Fastify service in `apps/api`, not a Next.js site. Deploy it to a Node 24 compatible service with PostgreSQL, Redis, and mail credentials after D6 is resolved. Point the PWA and marketing app's `NEXT_PUBLIC_API_URL` at that service and set `API_CORS_ORIGINS` to the exact PWA and marketing origins. For the temporary waitlist, set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` on the API service only; never add the service role key to Vercel frontend project variables.

## Temporary waitlist owner access

Run `supabase/schema.sql` in the existing Supabase project. Create or use your verified Supabase Auth account, find its Auth user UUID in Supabase Authentication, then run `INSERT INTO public.waitlist_admins (user_id) VALUES ('YOUR_VERIFIED_AUTH_USER_UUID') ON CONFLICT DO NOTHING;` in Supabase SQL Editor. Sign into the legacy app and open `/admin/waitlist`. The server verifies the Supabase session and confirmed email; row-level security limits waitlist reads to UUIDs explicitly inserted into `waitlist_admins`. The marketing homepage has no login or signup links.

Use Node.js 24 for both Vercel projects. The root `engines` range is pinned below Node 25 so Vercel does not automatically select a future major. Install dependencies with the repository's pnpm workspace rather than npm in the app subdirectory.
