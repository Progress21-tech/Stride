# Vercel Services deployment

The repository is configured as one Vercel project in Services mode. Set the Vercel project's Root Directory to the repository root (`.`), set its Framework Preset to **Services**, and attach the public, app, and admin hostnames to this project. Vercel Services are currently in beta; confirm Services is available for your project before switching the existing production project.

## Host routing in `vercel.json`

- The main domain routes to the public marketing/waitlist app.
- `app.<your-domain>` routes to the PWA, preserving `/login`, `/signup`, `/app`, and other app paths.
- `admin.<your-domain>` routes to the legacy Supabase workspace. Its `/admin/waitlist` page requires a confirmed Supabase account registered in `waitlist_admins`.
- `/api/*` routes to Fastify on the main and app hosts. The API handles `/api/v1/...` and `/api/healthz`.
- The API and the three browser apps are publicly routable on those paths/hosts. The legacy page protects its data with Supabase Auth and RLS; the service is not a private Vercel service.

The order matters: admin-host routing comes first so the legacy app's own `/api/admin/...` handler is not sent to Fastify; API routing comes before the app-host and marketing catch-alls.

## Inter-service calls and bindings

The marketing form and the PWA call `/api/...` from the browser, through the public Vercel rewrite. Those are browser-to-public-API calls, not server-side service-to-service calls. The legacy app uses its own API routes and Supabase. Fastify calls Supabase and Resend, which are external services. There are currently no server-side calls between these four Vercel services, so no Vercel service bindings are declared. If a server-side call is added later, add a binding to the caller and consume its injected URL at runtime.

## Environment variables

- Configure `NEXT_PUBLIC_API_URL=http://localhost:4000` only for local development. Leave it unset on Vercel so browser requests use same-origin `/api/...` and work on the main and app hosts.
- Set `NEXT_PUBLIC_MARKETING_URL` and `NEXT_PUBLIC_APP_URL` to the actual public and app origins as needed for metadata and email links.
- Configure `API_CORS_ORIGINS` with the exact marketing and app origins.
- Set `SUPABASE_URL` and `SUPABASE_ANON_KEY` for the API's waitlist write path. The anon key is public; Supabase RLS grants it waitlist insert only. Do not configure a service-role key for this flow. The legacy frontend also needs only the Supabase URL and anon key.
- Configure the other API variables from `.env.example` for auth email, PostgreSQL, and Redis.

Vercel Services use the service-specific roots listed in `vercel.json`. The service framework slugs are `fastify` for Fastify and `nextjs` for Next.js.

## Temporary owner setup

Run `supabase/schema.sql` in the existing Supabase project. Create or use your verified Supabase Auth account, find its Auth user UUID, then run `INSERT INTO public.waitlist_admins (user_id) VALUES ('YOUR_VERIFIED_AUTH_USER_UUID') ON CONFLICT DO NOTHING;` in Supabase SQL Editor. Sign in on the admin host and open `/admin/waitlist`.
