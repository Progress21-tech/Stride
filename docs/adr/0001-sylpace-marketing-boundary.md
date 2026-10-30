# ADR 0001: Separate Sylpace marketing from the installed app

- **Status:** Accepted
- **Context:** The current Next.js root combines marketing and authenticated features, while the PWA must open on authentication and never on marketing.
- **Decision:** Build the coming-soon experience as a standalone app under `apps/marketing`. Keep the existing application as the legacy member app while a replacement is developed; do not perform account/data cutover until D8 is answered.
- **Alternatives:** Keep marketing at `/` in the PWA; move all current application code immediately; use one deployment with route-specific service workers.
- **Consequences:** Marketing metadata, theme, legal drafts, image placeholders, and waitlist UI can ship independently. Production deployment and form activation remain gated by D2, D6, D9, and D12. Existing Supabase-backed routes remain legacy until a migration plan exists.
