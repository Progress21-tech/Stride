# Decisions needed

Product name D1 has been answered: **Sylpace**. All launch copy should use Sylpace.

## D2 — Waitlist fields

- **Question:** Which level options should the waitlist offer, and should it collect university and department?
- **Options:** (1) 100–600 Level, Postgraduate, Other, plus university (recommended); (2) choose another list; (3) omit university/department.
- **Blocked:** Enabling the waitlist form, persisting waitlist entries, and defining the final consent text/data map. The marketing site may show a clearly labeled “opening soon” waitlist placeholder until answered.

## D5 — Tutor intake

- **Question:** Is tutor intake invite-only or open application? What vetting, agreement, and compensation terms apply?
- **Options:** Invite-only first (recommended); open applications with owner-defined criteria; defer tutor intake.
- **Blocked:** “Teach with us” CTA destination, tutor interest form, and tutor onboarding screens.

## D6 — Hosting and budget

- **Question:** Which hosting providers and regions should be used, and what is the monthly budget ceiling?
- **Options:** Owner selects provider/region/budget; no provider is assumed in this implementation.
- **Blocked:** Provisioning managed PostgreSQL/Redis/object storage, production/staging deployment, secrets configuration, backup/PITR setup, and restore drill. Local code and environment-variable interfaces can be prepared.

## D8 — Existing data migration

- **Question:** Do existing Sylpace users and their data need to be migrated from the current Supabase-backed app?
- **Options:** Migrate all; migrate selected records; do not migrate and retire the old app after notice.
- **Blocked:** Account/data migration, disabling the old app, removal of the old Supabase auth/data dependencies, and production cutover.

## D9 — Image supply and licensing

- **Question:** Which owner-supplied photographs may be used, and what are their credits/licences and alt text?
- **Options:** Supply original images and metadata; supply licensed images and proof; continue with neutral labeled placeholders.
- **Blocked:** Final image processing and production launch. The site uses labeled placeholders until metadata and images are supplied.

## D10 — Launch market and institutions

- **Question:** Confirm Nigeria and name the first universities/faculties.
- **Recommendation:** Nigeria, with science first and engineering next.
- **Blocked:** Phase 2 institution data, tutor targeting, and course catalogue seed data.

## D11 — Course list ownership

- **Question:** Who defines each university's course list?
- **Options:** Admins using official lists (recommended); tutors; another owner-defined workflow.
- **Blocked:** Phase 2 catalogue administration workflow.

## D12 — Legal and content rights

- **Question:** Approve privacy policy, terms, tutor content ownership/licensing, and takedown process with owner and counsel.
- **Options:** Review the clearly labeled draft pages and provide approved text; counsel supplies final pages.
- **Blocked:** Final legal pages, collection of personal data, production waitlist, and tutor content uploads going live.

## D3, D4, D7

- **D3 admission:** Keep the existing admission flow isolated behind a disabled feature flag, retire it, or repurpose it. Blocks only Phase 3 admission work.
- **D4 commerce:** Pricing/payment decision remains open. Blocks Phase 5 commerce; Phase 1 must not create prices or payment flows.
- **D7 video:** Choose managed provider or self-hosted pipeline. Blocks Phase 2 video implementation.
