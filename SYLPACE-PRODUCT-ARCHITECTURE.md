# Sylpace: Product and Architecture Summary

> **Upgrade status:** This document preserves the original single-app architecture audit. The current workspace is being split into `apps/marketing`, `apps/app`, `apps/api`, and shared packages. See [CURRENT_STATE.md](docs/CURRENT_STATE.md), [PHASE_STATUS.md](docs/PHASE_STATUS.md), and [DECISIONS_NEEDED.md](docs/DECISIONS_NEEDED.md) for what has been implemented and what is blocked. The code paths and filenames below describe the legacy app unless updated in those status documents.

## 1. Executive summary

Sylpace is a structured learning accountability platform. It is designed for people who want to turn a broad technology-learning ambition into a concrete sequence of goals, milestones, weekly objectives, and daily tasks, then create a truthful record of their work through daily check-ins and periodic review.

The core product loop is:

1. **Choose a direction** through an application and learning track.
2. **Define an outcome** as a goal with a target date.
3. **Break the outcome down** into milestones, weekly objectives, and tasks.
4. **Work the plan** from the Today workspace and calendar planner.
5. **Report honestly** with a daily check-in, learning time, blockers, and next priority.
6. **Protect consistency** with streak tracking, reminders, and a limited emergency-pass mechanism.
7. **Review evidence** through progress metrics and a scheduled group review.
8. **Receive guidance** from curated resources associated with the selected learning track.

The product has two main experiences:

- **Public and applicant experience:** marketing landing page, account creation/sign-in, guided admission application, application status, orientation resource, and pre-onboarding reflection.
- **Authenticated member/admin workspace:** Today, Goals, Planner, Focus, Check-in, Progress, Community, Resources, Review, Settings, and an admin operations console.

## 2. Product purpose and positioning

### Problem addressed

Learning goals commonly fail because they remain abstract, motivation is inconsistent, daily work is not planned, and there is no reliable feedback loop. Sylpace addresses this by combining:

- Outcome-oriented goal setting.
- Hierarchical planning.
- Daily task execution.
- Daily accountability reporting.
- Visible progress evidence.
- Human/group review.
- Curated learning direction.

### Product promise

The landing page expresses the promise as: **“Turn intention into progress.”** The product language consistently emphasizes planning, showing up, keeping moving, and creating evidence rather than relying on motivation alone.

### Primary users

- **Applicants:** people requesting admission to a Sylpace learning/accountability cohort.
- **Members:** approved learners who plan work, complete tasks, submit check-ins, and attend review.
- **Administrators:** operators who review applications, provision members, manage resources and review meetings, and inspect audit history.
- **Super administrators:** represented in the data model as a higher administrative role, although the UI currently treats administrators as one operational group.

## 3. Feature inventory

### 3.1 Marketing and product discovery

Route: `/`

- Large marketing hero with the “Turn intention into progress” message.
- Five explanatory product stages:
  - Set direction.
  - Plan the work.
  - Show up.
  - See the evidence.
  - Review together.
- Interactive animated sections using Framer Motion.
- Reduced-motion support through `useReducedMotion` and global reduced-motion CSS.
- Calls to action to create an account.
- Responsive, light/dark marketing presentation.
- Footer links for Privacy, Terms, and Contact; the Privacy and Terms links are currently placeholders.

### 3.2 Account creation and authentication

Routes: `/signup`, `/login`, `/auth/callback`

- Email/password sign-up.
- Email/password sign-in.
- Google OAuth sign-in/sign-up.
- Supabase Auth session handling.
- Browser-origin-based OAuth callback URL construction.
- Session exchange at `/auth/callback`.
- Sign-out from Settings.
- Middleware protection for authenticated routes.
- Automatic profile creation/synchronization from `auth.users` into `public.users` through a Supabase trigger.

### 3.3 Admission application and screening

Routes: `/apply`, `/application-status`

The application is a guided, 12-question flow with a final summary. It collects:

- Full name.
- Email address.
- WhatsApp number.
- Time zone.
- Current technical status.
- Primary area of interest.
- Daily learning capacity.
- Why accountability is needed now.
- Daily reporting commitment.
- Saturday review-call commitment.
- Emergency-pass acceptance.
- A personal discipline plan.

Behavior and workflow:

- Step-by-step navigation with Back and Next controls.
- Per-step validation.
- Progress indicator.
- Draft persistence in `localStorage` under `stride_onboarding_draft`.
- Application submission to Supabase.
- Deterministic application score:
  - Base score: 70.
  - +15 when the accountability rationale is non-empty.
  - +15 when all three commitments are accepted.
- Application audit event on submission.
- Local persistence of the submitted application for the status view.
- Status page showing selected track, daily commitment, expected review timing, and contact guidance.
- Introductory track resource/video while the applicant waits.
- Optional pre-onboarding reflection interaction.

Application states represented in the database include `DRAFT`, `SUBMITTED`, `UNDER_REVIEW`, `CLARIFICATION_REQUIRED`, `APPROVED`, `REJECTED`, and `WITHDRAWN`.

### 3.4 Today workspace

Route: `/today`

The Today page is the daily operating dashboard:

- Shows the active primary goal.
- Shows the active or first milestone.
- Shows the signed-in member email.
- Displays the local daily deadline of 11:59 PM.
- Loads tasks due on the member’s local date.
- Allows tasks to be completed/uncompleted.
- Allows a new daily task to be created.
- Displays task completion percentage.
- Displays the reporting streak.
- Detects whether today’s check-in exists.
- Counts emergency passes used in the current calendar month.
- Links directly to the daily check-in.
- Shows a dismissible daily reminder banner.
- Stores reminder preferences and dismissal state locally.

The page uses the member’s profile time zone when resolving “today,” rather than assuming UTC.

### 3.5 Goal hierarchy

Route: `/goals`

Sylpace models planning as:

```text
Goal
  -> Milestone
      -> Weekly objective
          -> Task
```

The Goals page currently supports:

- Loading active goals for the signed-in member.
- Creating a goal with title, description, and target date.
- Displaying goal status and target date.
- Creating milestones under a goal.
- Displaying milestone status and target date.
- Displaying existing weekly objectives under milestones.
- Loading nested tasks through the database helper.

The data model also supports pausing, completing, or cancelling goals, but the current member UI primarily creates and reads goals and milestones; full lifecycle controls are not exposed in this page.

### 3.6 Calendar planner

Route: `/plan`

- Calendar navigation by month, week, and day.
- Previous, next, and Today navigation.
- Task loading for the visible date range.
- Active-goal summary cards.
- Selected-day task list.
- Creation of a task on the selected date.
- Optimistic task completion toggling with rollback on update failure.
- Status visualization for planned and completed tasks.
- Date handling through `date-fns`.
- Error presentation for task query and update failures.

The planner writes directly to the Supabase `tasks` table, while Today uses shared database helpers for equivalent task operations.

### 3.7 Focus and distraction setup

Route: `/focus`

Focus is a guidance feature rather than an enforcement engine:

- Detects Android, iOS/iPadOS, or an unsupported/desktop environment from the user agent.
- Provides device-specific instructions.
- Links to Android Digital Wellbeing or Apple Screen Time guidance.
- Explains how to select distracting apps, create a study window, and protect the limit.
- Links back to the planner to choose a task.
- Clearly states that a web browser cannot read, change, or enforce phone app limits.

### 3.8 Daily check-in and accountability

Route: `/check-in`

Members can submit one daily report with:

- Completion status:
  - `YES`
  - `PARTIAL`
  - `NO`
  - `EMERGENCY_PASS`
- What they learned.
- What they completed.
- Learning time in minutes.
- Blockers.
- Next priority.

Behavior:

- Uses the member’s profile/browser time zone to determine the local date.
- Upserts by `(user_id, date)`, so a day has one current check-in.
- Logs an audit event.
- Redirects back to Today after success.
- Supports emergency-pass submission with a required reason.
- Shows the 11:59 PM local cut-off.
- Uses explicit error state and loading state.

### 3.9 Emergency passes and streaks

Emergency passes are designed to preserve an honest attendance record when a member cannot report normally:

- Maximum of two passes per member per calendar month.
- A pass records the month and reason.
- A corresponding `EMERGENCY_PASS` check-in is written for the local date.
- Pass use is included in streak calculations.
- Exceeding the monthly allowance returns an explicit error.

Streak calculation counts consecutive local dates with `YES`, `PARTIAL`, or `EMERGENCY_PASS` check-ins.

### 3.10 Progress and historical evidence

Route: `/progress`

The page queries live Supabase data and displays:

- Number of check-ins submitted.
- Task completion percentage.
- Total learning time converted to hours and minutes.
- Completed milestones versus total milestones.

The page is intentionally evidence-oriented: it reports stored activity instead of a manually entered progress claim.

The type layer also defines a richer `WeeklyReport` shape containing completion rate, check-in count, learning time, streak, blockers, milestone progress, and next-week objective. A complete weekly-report UI or automated report generation is not currently present in the active page set.

### 3.11 Curated learning resources

Route: `/resources`

- Finds the member’s selected track from the latest application.
- Loads active resources for that track from Supabase.
- Falls back to local seed resources when the database has no matching records.
- Displays title, category, provider, level, duration, cost, recommendation reason, and external URL.
- Embeds YouTube resources using the privacy-enhanced `youtube-nocookie.com` host.
- Supports a connected LMS URL stored locally in the browser.
- Embeds the LMS in a sandboxed iframe when possible.
- Provides an “Open separately” fallback for platforms that block embedding.
- Explains that Sylpace does not automatically receive grades or course progress from the LMS.

The local catalog covers development, data, AI, cybersecurity, design, product, cloud, DevOps, and general orientation tracks.

### 3.12 Weekly group review

Route: `/review`

- Loads the active meeting from Supabase.
- Displays meeting title and schedule.
- Provides a Join review link when an active meeting URL exists.
- Shows a pending state when administrators have not published a link.
- Prompts members to prepare three reflections:
  - What moved forward?
  - What got in the way?
  - What happens next?

### 3.13 Community

Route: `/community`

The repository includes a Community route and the Supabase schema includes a `community_messages` table with policies for authenticated members to read and post messages. The route is part of the navigation surface. The current source should be treated as the authoritative implementation for the exact interaction details; the feature is not represented in the Prisma schema.

### 3.14 Admin operations console

Route: `/admin`

The admin console provides:

- Pending application count.
- Active member count.
- Audit-event count.
- Application review queue.
- Application score and status display.
- Applicant contact and screening details.
- Expandable full application details.
- Discipline-plan and reflection visibility.
- Per-application audit history.
- Request clarification action.
- Reject action with optional notes.
- Approve and provision action.
- Approval email delivery through the server API route.
- Add a curated resource for a track.
- Publish an active Saturday review meeting link.
- Link back to the member Today view.

Application decision workflow:

- **Approve:** marks the application approved, makes the user an active member, records reviewer information, writes an audit event, and attempts to send an approval email.
- **Reject:** marks the application rejected, stores optional reviewer notes, and records an audit event.
- **Request clarification:** changes the application to `CLARIFICATION_REQUIRED`, stores the reviewer’s question/notes, and records an audit event.

The UI contains placeholder/constant values for some operational widgets, such as “At-Risk Members” and “Passes Used”; these are not currently computed from live data.

### 3.15 Settings and preferences

Route: `/settings`

- Light, dark, and system theme selection.
- Profile loading and fallback profile display.
- Sign-out.
- Daily reminder preference stored locally.
- LMS URL configuration stored locally.
- Explanation of browser notification limitations.
- Placeholder for a weekly review summary notification marked “coming soon.”
- About Sylpace section.

### 3.16 Progressive Web App support

The application includes:

- Web app manifest.
- 192px and 512px icons.
- Service worker registration.
- Install prompt component for supported browsers.
- iOS Home Screen guidance.
- Cache-first behavior for cached assets and dynamic requests where appropriate.
- Network fallback to `/` for navigation requests.
- Offline response fallback when the landing page is not cached.

`InstallAppPrompt` exists as a reusable component, but it is not currently mounted in the root layout.

## 4. Route map

| Route | Access intent | Purpose |
|---|---|---|
| `/` | Public | Marketing and product explanation |
| `/login` | Public | Email/password and Google sign-in |
| `/signup` | Public | Account creation |
| `/auth/callback` | Public callback | OAuth code exchange |
| `/apply` | Authenticated applicant | Guided admission application |
| `/application-status` | Authenticated applicant | Application status and orientation |
| `/today` | Authenticated member | Daily dashboard and task execution |
| `/goals` | Authenticated member | Goal and milestone hierarchy |
| `/plan` | Authenticated member | Day/week/month task planner |
| `/focus` | Authenticated member | Device focus setup guidance |
| `/check-in` | Authenticated member | Daily accountability report |
| `/progress` | Authenticated member | Historical activity metrics |
| `/community` | Authenticated member | Cohort/community interaction |
| `/resources` | Authenticated member | Track-specific learning resources |
| `/review` | Authenticated member | Scheduled group review |
| `/settings` | Authenticated user | Preferences, theme, LMS, sign-out |
| `/admin` | Admin | Application and operations console |
| `/api/admin/send-approval-email` | Authenticated admin API | Sends approval email through Resend |

## 5. High-level architecture

```text
Browser
  |
  | Next.js App Router pages and React client components
  | Tailwind CSS, Framer Motion, Lucide icons
  |
  +--> Supabase browser client (@supabase/ssr)
  |      |
  |      +--> Supabase Auth
  |      +--> PostgreSQL tables
  |      +--> Row Level Security policies
  |      +--> RPC functions (is_admin, community_member_names)
  |
  +--> Next.js middleware
  |      +--> Refreshes/verifies Supabase auth cookies
  |      +--> Redirects unauthenticated users to /login
  |
  +--> Next.js route handlers
         +--> OAuth callback session exchange
         +--> Admin approval email endpoint
                 |
                 +--> Resend API

Browser-local capabilities
  +--> localStorage: drafts, theme, reminders, LMS URL, submitted application snapshot
  +--> Service worker: PWA caching and offline navigation fallback
  +--> Phone OS: external Digital Wellbeing / Screen Time controls
```

### Application layer

- Next.js 14 App Router.
- React 18.
- Most workspace pages are client components because they read Supabase sessions, handle forms, and update UI state interactively.
- Root layout provides metadata, theme provider, service-worker registration, responsive shell, and sidebar.
- Route-specific page components own much of their presentation and data-fetching logic.

### Shared UI layer

- `AppSidebar` owns workspace navigation and hides the admin route unless the Supabase `is_admin` RPC returns true.
- `StrideLogo` provides branding.
- `ThemeProvider` manages light/dark/system mode.
- `ThemeToggle` provides theme controls.
- `RegisterSW` registers the service worker.
- `InstallAppPrompt` implements install UX but is not mounted currently.

### Data-access layer

`src/lib/supabase.ts` contains:

- Supabase browser client creation.
- Direct helper queries for check-ins and pending applications.

`src/lib/stride-db.ts` contains domain operations:

- Profile access.
- Application submission and reflection.
- Application audit lookup.
- Today task loading, creation, and status changes.
- Goal and milestone loading/creation.
- Check-in upsert.
- Streak calculation.
- Emergency-pass enforcement.
- Application approval/rejection/clarification.
- Audit-event creation.

Some pages also query Supabase directly instead of routing all operations through `stride-db.ts`, particularly Planner, Progress, Resources, Review, Settings, and parts of Today/Admin.

### Authentication and authorization

- Supabase Auth is the identity provider.
- `middleware.ts` protects all non-public, non-API routes matched by the middleware configuration.
- Server-side Supabase clients preserve auth state through cookies.
- Database RLS is the primary authorization boundary.
- `is_admin()` is a security-definer database function used by UI and server operations.
- Admin actions are additionally gated by database policies and the server approval-email route.

## 6. Database and domain model

The production-oriented schema is `supabase/schema.sql` and uses PostgreSQL/Supabase naming (`snake_case`). The main entities are:

| Entity | Responsibility | Important relationships |
|---|---|---|
| `users` | Profile, role, status, time zone | Auth user; parent of most member data |
| `applications` | Admission screening and review state | Belongs to a user; reviewed by a user |
| `goals` | Long-term outcome | Belongs to a user; has milestones |
| `milestones` | Outcome checkpoints | Belongs to a goal; has weekly objectives |
| `weekly_objectives` | Short-term milestone objectives | Belongs to a milestone; has tasks |
| `weekly_plans` | Weekly planning container | Belongs to a user and goal; has tasks |
| `tasks` | Executable work items | Belongs to a user and optionally a plan/objective |
| `check_ins` | One daily accountability report | Belongs to a user; unique per local date |
| `emergency_passes` | Excused attendance records | Belongs to a user; counted per month |
| `resources` | Curated learning catalog | Can have recommendations |
| `recommendations` | User-specific resource rationale | Joins user and resource |
| `meetings` | Active review-session links | Readable by members, managed by admins |
| `community_messages` | Cohort messages | Authenticated members read/post |
| `notifications` | Notification records | Belongs to a user |
| `audit_events` | Immutable-style operational trail | Actor, action, object type, object ID, metadata |

### Key constraints and lifecycle rules

- One check-in per user per date through a unique constraint.
- Emergency-pass allowance is enforced in application logic at two per month.
- User roles are `APPLICANT`, `MEMBER`, `ADMIN`, and `SUPER_ADMIN`.
- User statuses are `ACTIVE`, `UNDER_REVIEW`, `SUSPENDED`, and `WITHDRAWN`.
- Application statuses cover submission, review, clarification, approval, rejection, and withdrawal.
- Goal, milestone, task, and meeting status fields are constrained by database checks.
- Cascading deletes are used for member-owned application, goal, check-in, pass, recommendation, and related hierarchy records where appropriate.

### Row Level Security

The schema enables RLS across the product tables. Representative policies include:

- Users can read/update their own profile.
- Users can create/read/update their own application while it is still pending or clarification-required.
- Users can access their own goals, tasks, check-ins, passes, plans, and recommendations.
- Hierarchical milestones/objectives are accessible when they belong to the authenticated user’s goal chain.
- Members can read active resources and active meetings.
- Admins can manage resources and meetings.
- Members can read community messages and post messages as themselves.
- Users can read their own notifications and audit events.
- Admins have broader access to users, applications, operational records, and audit events.

## 7. Time-zone and date behavior

Time zone is a first-class member profile attribute:

- Application captures a time zone.
- Today and check-in operations resolve the local date with `Intl.DateTimeFormat`.
- The local date is used for task lookup, check-in uniqueness, emergency-pass month, and local deadline messaging.
- The database stores check-in dates as dates and pass months as `YYYY-MM`.

The codebase should continue treating the member’s selected time zone as the source of truth. The local browser time zone is a fallback when a profile time zone is unavailable.

## 8. Styling, UX, and accessibility

- Tailwind CSS provides utility styling.
- A small CSS variable system defines light/dark surfaces, text, borders, and Sylpace green.
- `glass-card` is the shared card treatment.
- Sylpace green is `#18A957`.
- Responsive layouts support mobile and desktop.
- The sidebar collapses to an icon rail on desktop and a full-width expandable control on small screens.
- Active navigation state is visually marked.
- Focus-visible outlines are globally configured.
- Buttons and controls use labels/ARIA attributes in important interactive areas.
- Reduced-motion preferences are respected globally and in landing-page animation.
- Embedded third-party content is sandboxed where practical.

## 9. External services and integrations

### Supabase

- Authentication.
- OAuth provider integration.
- PostgreSQL database.
- RLS authorization.
- RPC functions.
- Browser and server-side session clients.

### Google OAuth

- Sign-in/sign-up provider through Supabase Auth.
- Callback returns to `/auth/callback`.

### Resend

- Transactional approval email after an admin approves an application.
- Requires `RESEND_API_KEY`.
- Sender is configured with `RESEND_FROM_EMAIL`.

### YouTube

- Curated resources and orientation videos.
- Privacy-enhanced embeds through `youtube-nocookie.com`.

### LMS embedding

- User-provided LMS URL.
- Stored only in browser local storage.
- Displayed through a sandboxed iframe when the third-party platform permits it.

### Phone operating systems

- Focus guidance links to Android Digital Wellbeing and Apple Screen Time.
- Sylpace does not directly control phone settings.

## 10. Configuration and deployment

Defined environment variables:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser-safe Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Reserved server-side administrative key; not used by the reviewed active route code |
| `NEXT_PUBLIC_APP_URL` | Production app URL and email link base |
| `RESEND_API_KEY` | Resend transactional email key |
| `RESEND_FROM_EMAIL` | Approval-email sender |

Package scripts:

- `npm run dev`: development server.
- `npm run build`: production build.
- `npm run start`: serve the production build.
- `npm run lint`: Next lint command.
- `npm run prisma:generate`: generate Prisma client.
- `npm run prisma:push`: push the Prisma schema.
- `npm run prisma:seed`: invoke Prisma seed configuration if present.

## 11. Repository structure

```text
Stride/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Marketing landing page
│   │   ├── layout.tsx               # Root shell, metadata, theme, sidebar, SW
│   │   ├── globals.css              # Theme variables and shared CSS
│   │   ├── api/admin/...            # Approval-email API route
│   │   ├── auth/callback/           # OAuth callback route
│   │   └── <feature>/page.tsx       # App Router feature pages
│   ├── components/
│   │   ├── AppSidebar.tsx
│   │   ├── ThemeProvider.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── RegisterSW.tsx
│   │   ├── InstallAppPrompt.tsx
│   │   └── StrideLogo.tsx
│   ├── lib/
│   │   ├── supabase.ts              # Browser client and direct query helpers
│   │   ├── auth-supabase.ts         # Auth operations
│   │   ├── stride-db.ts             # Domain data operations
│   │   ├── types.ts                 # TypeScript domain types
│   │   └── store.ts                 # Local seed/demo data and calculations
│   └── middleware.ts                # Auth cookie/session protection
├── supabase/
│   └── schema.sql                   # Production Supabase/PostgreSQL schema and RLS
├── prisma/
│   └── schema.prisma                # Parallel SQLite/Prisma domain schema
├── public/
│   ├── manifest.json
│   ├── sw.js
│   ├── icon-192.png
│   ├── icon-512.png
│   └── logo.png
├── package.json
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
├── .env.example
└── README.md
```

## 12. Important implementation observations

### Two database schemas exist

The application’s active queries use Supabase/PostgreSQL tables and snake_case columns. The repository also contains `prisma/schema.prisma`, which defines a similar domain using SQLite and camelCase fields. This is a meaningful architectural split:

- `supabase/schema.sql` is the effective production schema for the current client and RLS model.
- `prisma/schema.prisma` appears to be an alternative/local schema and is not the path used by the active Supabase data-access helpers.
- Changes to domain fields should be reconciled deliberately across both schemas or the unused schema should be retired.

### Data access is partly centralized and partly page-local

Core accountability operations are centralized in `stride-db.ts`, but several pages query or mutate Supabase directly. This works, but it creates two patterns for error handling, mapping, and business-rule enforcement. A future refactor could consolidate these operations behind one typed data-access layer.

### Community schema and route are not mirrored in Prisma

Community support exists in the Supabase schema and navigation surface, but the Prisma model does not include `CommunityMessage`. Supabase is therefore the source of truth for this feature.

### PWA installation UI is not mounted

The install prompt component is implemented but root layout mounts only `RegisterSW`. The service worker can still register, but the in-app install suggestion will not appear until `InstallAppPrompt` is included in the shell.

### Offline route mismatch

The service worker names `/offline` as an offline page but does not cache or provide a dedicated `/offline` route. Navigation fallback currently returns the cached `/` page or a plain 503 response.

### Application status reflection persistence is incomplete

The status page provides an optional reflection interaction and reports that admins can view it, but the current page only changes local component state; it does not call `saveReflectionAnswer`. The domain helper and database column exist, so wiring this interaction is a clear future completion item.

### Some operational metrics are placeholders

The Admin page displays live application/member/audit counts, but at-risk-member and pass-used values are currently static. Weekly summary notifications are also explicitly marked as coming soon.

### Middleware/API boundary

The middleware matcher excludes `/api`, so API route handlers must perform their own authentication and authorization. The approval-email route does this by checking the current user and invoking `is_admin()`.

## 13. Recommended next architectural improvements

These are recommendations derived from the current implementation, not claims that they already exist:

1. **Choose one production persistence model.** Keep Supabase as the production source of truth or formally introduce Prisma as a server-side data layer; avoid silently maintaining two divergent schemas.
2. **Centralize domain operations.** Move Planner, Progress, Resources, Review, and Settings queries into typed helpers or server-side actions.
3. **Generate shared database types.** Use generated Supabase TypeScript types to reduce `any` usage and protect column-name mappings.
4. **Move privileged workflows server-side.** Keep approval decisions, provisioning, and audit writes in protected server actions or RPCs with transactional guarantees.
5. **Make application review transactional.** Approval currently updates the application and user in separate calls; a database function/transaction would prevent partial provisioning.
6. **Complete reflection persistence.** Call the existing save helper and refresh the admin view after a saved reflection.
7. **Complete PWA wiring.** Mount `InstallAppPrompt`, add a real offline route, and verify cache behavior against Next.js asset URLs.
8. **Compute operational metrics.** Replace static admin widgets with queries for at-risk members, pass usage, and review readiness.
9. **Add automated validation.** Add unit tests for streak/date logic, emergency-pass limits, application scoring, and authorization-sensitive workflows.
10. **Validate third-party URLs.** Apply stricter URL and email validation to admin resource and meeting forms, and consider server-side validation for all externally supplied links.

## 14. Source files reviewed

This summary is based on the active repository source, including:

- `src/app` route pages and route handlers.
- `src/components` shared shell and PWA/theme components.
- `src/lib` authentication, Supabase, domain helpers, types, and seed data.
- `src/middleware.ts`.
- `supabase/schema.sql`.
- `prisma/schema.prisma`.
- `public/manifest.json` and `public/sw.js`.
- `package.json`, `tailwind.config.ts`, `.env.example`, and `README.md`.

