# Learning notes

## Phase 0 foundation

- **Separate applications:** Marketing pages and the installed app have different jobs and entry routes. Separate deployments keep public pages out of the authenticated PWA. If the routes are mixed, the installed app can open on marketing content and caching rules can expose the wrong shell.
- **Decision gates:** A form can encode personal data and promises. Its fields and consent need owner/legal agreement before collection. An unapproved form can collect data without a defensible purpose or retention policy.
- **Image manifests:** Every supplied photo needs a source, licence, credit, alt text, and focal point. Without that record, the team cannot verify permission or provide accessible descriptions.

## Phase 1 foundation

- **Monorepo:** A workspace contains separately deployable apps and shared packages in one repository. This lets marketing and the installed app use different entry points while sharing code; a missing workspace dependency can break builds across app boundaries.
- **PostgreSQL schema and migrations:** Prisma models describe application data, and migrations move a real database from one structure to the next. Treat migrations as forward changes with a tested roll-forward recovery plan; never point them at production before configuration and review.
- **Opaque sessions:** The browser receives a random token while the server stores only its hash. A database leak then does not directly reveal session tokens; expired and revoked rows must still be rejected on every protected request.
- **Default-deny authorization:** A route requires an explicit grant for the actor's role and action. A missing grant denies access; a missing route policy must fail CI before protected functionality ships.
- **Service-worker caching:** The new worker only shares static shell assets and one generic offline page. Caching personalized HTML or API output can show one signed-in person's content on another browser session.
