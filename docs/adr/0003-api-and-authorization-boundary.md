# ADR 0003: Fastify API boundary and default-deny authorization

- **Status:** Accepted for the new platform foundation.
- **Context:** Current pages call Supabase directly. The target architecture needs a typed API, request validation, predictable health checks, and a central authorization decision.
- **Decision:** Start a Fastify API with Pino structured logging, request/body limits, an explicit CORS allowlist, Zod problem details, `/healthz` and database-backed `/readyz`; put an explicit grant table in `can(actor, action)` that denies if there is no actor or grant.
- **Alternatives:** Keep browser-to-database access; place the API inside the Next app; allow routes by default and add checks later.
- **Consequences:** New modules will use the API boundary. This commit does not claim to provide signup/login or business endpoints; route-level auth policies and first-party identity must be implemented before protected API features are exposed.
