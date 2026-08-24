# AU-STELLAR LIFE Client Portal — Phase 1 Audit and Implementation Plan

## Repository audit

### Current capabilities

- React 19 and TypeScript application built with Vite.
- Responsive, black-and-gold public marketing website.
- Public sections for the brand vision, three Academy pathways, merchandise, book, video, contact, and cumulative membership tiers.
- Client-side merchandise cart state with no checkout.
- Structured but currently unrendered curriculum data and components.
- Initial local Supabase client, database types, and migration for profiles, roles, and memberships.
- Automated production builds and GitHub Pages deployment from `main`.
- Custom domain through `public/CNAME`: `liveaustellarlife.com`.

### Missing or incomplete capabilities

- No hosted Supabase project is connected and no migration has been applied.
- No registration, email verification, login, logout, or password-reset interface.
- No protected client or administrator routes.
- No live dashboard, assessment engine, progress tracking, coaching plans, or notes.
- No administrator interface for role or tier assignment.
- No Stripe integration, webhook verification, fulfillment, or subscription synchronization.
- Enrollment and checkout buttons are disabled placeholders.
- Membership descriptions are public marketing data, not authorization rules.
- Contact email remains a placeholder.
- No lint or automated test command existed before this phase.

## Hosting and runtime model

GitHub Pages hosts static frontend assets. It cannot safely execute privileged business logic or store private user records. Supabase supplies managed backend services over HTTPS.

```text
Browser
├── downloads React/CSS/assets from GitHub Pages
├── maintains the Supabase user session
└── sends untrusted requests to Supabase
         ├── Auth verifies identity
         ├── PostgreSQL grants allow operations
         └── Row-Level Security filters rows
```

The frontend may render navigation and locked states for usability, but it is never the final authority for private data or tier access.

## Architecture decision

### Selected: Supabase

Supabase fits the existing Vite/React application with minimal infrastructure and provides PostgreSQL, authentication, an API, migrations, and Row-Level Security. The Free plan is sufficient for development and early use.

### Alternatives considered

- **Firebase:** Strong authentication and managed data services, but the document model and security rules would require reshaping the relational coaching and assessment model.
- **Auth provider plus separate database/API:** Flexible but introduces more services, integration points, cost, and operational work.
- **Custom Node API and PostgreSQL:** Maximum control and educational value, but substantially more hosting, patching, session, email, deployment, and monitoring responsibility for the first release.

Supabase is the simplest secure production path now. Its PostgreSQL schema remains portable if a custom API is introduced later.

## Routing decision

The portal uses query-based application locations such as `/?portal=login` and `/?portal=dashboard`. This works reliably on GitHub Pages without server rewrite rules. The public page remains available at `/`.

The route layer controls user experience only. Supabase RLS remains responsible for authorization.

## Phase 1 implementation

### Database

- Extend profiles with onboarding state and a protected email copy for administrator lookup.
- Preserve application roles as member, coach, or administrator.
- Extend membership records with manual, Stripe, trial, or promotional sources.
- Add administrator-only client listing.
- Add controlled administrator functions for granting and revoking tier access.
- Record significant role and access changes in an append-only audit table.
- Enforce cross-client isolation with RLS.

### Authentication

- Email/password registration with display name.
- Email verification through Supabase Auth configuration.
- Email/password login.
- Password-reset email and password-update completion screen.
- Logout.
- Session restoration and auth-state subscription.

### Portal UI

- Account pages for login, registration, forgot password, and password update.
- Protected client dashboard.
- Tier and access-status presentation.
- Locked pathway cards explaining the required tier.
- Administrator dashboard for manual grants and revocations.
- Loading, empty, configuration-error, request-error, and unauthorized states.

### Testing and verification

- Unit tests for route authorization and cumulative tier access.
- Type checking.
- ESLint.
- Production build.
- Dependency audit.
- Database policy test checklist for anonymous, client A, client B, and administrator identities.

## Security boundaries

### Public configuration

The Supabase project URL and publishable key may be included in the browser bundle. They do not confer administrative access.

### Secrets

Service-role keys, database passwords, Stripe secrets, and webhook signing secrets must never use a `VITE_` variable, enter frontend code, or be committed.

### Administrative access

Administrator status is stored in a protected database table. A user cannot promote themselves from browser-controlled metadata. Manual access changes execute through database functions that verify the caller's protected role and write an audit event.

### Client isolation

Clients can read their own profile, role, memberships, and future records. Administrator policies are explicit and separate. Knowing another user's UUID does not grant access.

## Stripe integration plan

Stripe belongs in Phase 4:

1. A trusted server or Supabase Edge Function creates Checkout sessions.
2. Stripe sends signed webhook events to a server endpoint.
3. The endpoint verifies the webhook signature and processes events idempotently.
4. Verified subscription state creates or updates database access grants.
5. RLS evaluates those database grants when content is requested.

A successful browser redirect never grants access because redirect parameters can be replayed or fabricated.

## Phased roadmap

### Phase 1 — Identity and access

Authentication, roles, protected portal views, basic dashboards, manual tier assignment, RLS, audit events, and tests.

### Phase 2 — Assessments and coaching direction

Versioned assessments, resumable submissions, scoring, non-diagnostic summaries, coach review, and editable coaching-direction priorities.

### Phase 3 — Content and progress

Protected content metadata and delivery, tier permissions, lesson/module/worksheet/video progress, plans, goals, and action steps.

### Phase 4 — Payments

Stripe Checkout, customer portal, verified webhooks, subscription synchronization, upgrades, downgrades, cancellation, and expiration.

## Operational decisions deferred

- Production privacy policy, terms, retention schedule, and account-deletion workflow.
- Coach assignment rules when more than one coach exists.
- Whether clients may register freely or require an invitation after launch.
- Transactional email branding and delivery configuration.
- Backup and recovery requirements beyond the Supabase Free plan.
- Production uptime requirements that may require a paid plan.

Dependency selection and remediation follow the repository's [Dependency Security Policy](./DEPENDENCY_SECURITY_POLICY.md).
