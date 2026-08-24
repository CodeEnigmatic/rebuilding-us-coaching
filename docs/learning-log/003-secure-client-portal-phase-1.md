# Entry 003 — Secure Client Portal Phase 1

**Project phase:** Client Portal Phase 1

**Status:** Implementation complete locally; hosted Supabase application and live RLS tests pending

## Objective

Extend the static React website with the first secure portal layer: authentication flows, protected client and administrator locations, cumulative tier visibility, backend-enforced manual access management, and audit records.

## Repository and architecture audit

The existing project was confirmed as a Vite-built React single-page application deployed to GitHub Pages. It had public marketing and storefront behavior, disabled enrollment controls, and an unapplied Supabase schema, but no active account UI, protected routes, payment processing, or live database.

Supabase was retained because it adds managed authentication, PostgreSQL, migrations, APIs, and Row-Level Security without replacing the public frontend or introducing a custom server prematurely.

## Work completed

- Documented the current system, alternatives, trust boundaries, Stripe direction, and four-phase roadmap.
- Added registration, email verification direction, login, logout, password reset, and password update flows.
- Added session restoration and authentication-state handling.
- Added protected client and administrator portal locations compatible with GitHub Pages.
- Preserved the original public application and branding.
- Added a client dashboard with membership status and cumulative pathway locks.
- Added administrator client listing, manual tier grants, and manual revocation.
- Extended the database with access sources, onboarding state, client lookup data, and audit events.
- Enforced administrator operations inside security-definer PostgreSQL functions that check the protected application role.
- Added RLS policies for client isolation and explicit administrator reads.
- Added unit tests for route access and cumulative tier logic.
- Added ESLint and Vitest scripts.
- Added production configuration and security-test documentation.

## Security design

The React route guard is a usability control. PostgreSQL remains the authorization control. Members cannot write their own roles or memberships. Manual access changes execute only after the database confirms the caller has the administrator role, and each successful change writes an audit event.

Access lifecycle and origin are modeled separately. A grant may originate manually now or from Stripe later, while its lifecycle may be active, trialing, past due, canceled, or expired.

## Verification

- TypeScript and production build passed.
- ESLint passed.
- Four unit tests passed.
- Git whitespace checks passed.
- Original public application remains the default route.
- Missing Supabase configuration produces an isolated portal setup screen rather than breaking the public site.

Live authentication and database policy tests remain pending until the Free project is created, migrations are applied, and test identities are available.

## Dependency-security remediation

The audit identified one high-severity advisory in transitive `nanoid` 3.3.16 involving custom zero-length generator behavior. The package entered the project through the Vite and PostCSS build chain rather than portal application code.

The dependency tree was inspected before changing it. `nanoid` was upgraded to patched version 3.3.18 within the same major version and deduplicated across the build toolchain. A complete online audit then reported zero known vulnerabilities. Linting, tests, and the production build all passed after remediation.

## Skills demonstrated

- Full-stack architecture auditing
- React authentication flows
- Session-state management
- Protected-route design
- PostgreSQL schema evolution
- Row-Level Security
- Security-definer functions
- Role-based access control
- Entitlement lifecycle modeling
- Audit-event design
- Unit testing and lint configuration
- Secure deployment documentation
- Dependency vulnerability triage

## Interview summary

I extended a statically hosted React and TypeScript site with a Supabase-backed client portal architecture. I implemented account flows, protected client and admin views, cumulative membership states, and PostgreSQL-enforced manual tier management. I treated the browser as untrusted, used RLS for client isolation, restricted administrative mutations to role-checking database functions, and recorded significant access changes in an audit table.

## Resume evidence

- Implemented a React and Supabase client portal foundation with authentication flows, protected client/admin views, cumulative membership access, responsive states, and typed data integration.
- Designed PostgreSQL Row-Level Security and least-privilege RPC functions to isolate client records, prevent self-assigned entitlements, and audit administrator access changes.
- Added Vitest authorization tests, ESLint checks, production-build validation, and a structured security-testing checklist.

## Current limitations

- Hosted Supabase setup and live policy testing are pending.
- Assessment, coaching-direction, and protected-content systems belong to later phases.
- Stripe synchronization is not implemented.
- The portal uses query-based routes to remain compatible with GitHub Pages.
- First administrator promotion requires a controlled SQL operation.
- Account deletion/export and production privacy operations remain to be designed.

## Next milestone

Create and configure the Supabase Free project, apply both migrations, bootstrap one verified administrator, execute the multi-user security checklist, and configure GitHub Actions build variables before enabling the portal publicly.
