# Entry 002 — Supabase Security Foundation

**Project phase:** Backend Phase 1

**Status:** Local foundation completed; hosted project connection pending

## Objective

Establish a secure, version-controlled backend foundation for authentication, user profiles, application roles, and cumulative Academy memberships without disrupting the existing production website.

## Work completed

- Selected the Supabase Free plan as the initial hosted backend platform.
- Added the official Supabase JavaScript client as a production dependency.
- Added a safe environment-variable template for the public project URL and publishable key.
- Created a lazy, typed Supabase browser-client module that does not initialize until backend functionality requests it.
- Defined TypeScript representations for profiles, roles, memberships, tiers, statuses, and the initial authorization function.
- Added a version-controlled PostgreSQL migration for the initial identity and access model.
- Added automatic profile and default-member-role creation following user registration.
- Enabled Row-Level Security on every table exposed through the public schema.
- Restricted members to reading their own profile, role, and membership records.
- Restricted profile updates to the signed-in user's `display_name` column.
- Prevented browser clients from creating roles or memberships.
- Added a cumulative membership-tier authorization function.
- Documented the trust boundary and required authorization tests.
- Audited dependencies and updated vulnerable development tooling to patched versions.

## Architecture

```text
GitHub Pages
    |
    | serves React, TypeScript, CSS, and browser assets
    v
Untrusted browser
    |
    | Supabase publishable key + authenticated user session
    v
Supabase Auth and Data API
    |
    | PostgreSQL grants + Row-Level Security policies
    v
Authorized profile, role, and membership rows
```

GitHub Pages remains responsible for static frontend delivery. Supabase will provide the stateful backend services that a static host cannot provide: identity, database persistence, and server-enforced data authorization.

## Data model

### Profiles

Stores a user-controlled display name while using the Supabase Auth user UUID as its primary key.

### User roles

Stores one protected application role per user: member, coach, or administrator. Browser clients have read-only access to their own role and cannot promote themselves.

### Memberships

Stores tier, status, access start time, and optional expiration. Individual, Relationship, and Community tiers are ordered cumulatively for authorization checks.

## Security decisions

- No service-role or secret key is accepted by the frontend configuration.
- Only `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are expected in the browser.
- The browser is treated as an untrusted client even after login.
- Authorization is enforced in PostgreSQL rather than relying on hidden React components.
- RLS policies compare each protected row's user ID with the authenticated identity returned by `auth.uid()`.
- Table grants prevent members from changing protected profile columns, roles, or memberships.
- Role and membership writes are reserved for a future trusted administrative process or verified payment webhook.
- Foreign keys remove associated application records when the underlying authentication account is deleted.
- Database constraints reject invalid membership periods and invalid display-name lengths.
- Indexed authorization columns support efficient policy evaluation.
- Security-definer functions use an empty search path and restricted execution grants to reduce privilege abuse.

## Dependency-security finding

Installing the backend client surfaced two high-severity audit findings in existing development tooling. The affected packages were Vite and PostCSS. The issues related to development-server path handling and malicious CSS source-map processing.

Compatible patched versions were installed. The remediation audit then reported zero known vulnerabilities, and the production build continued to pass with Vite 8.2.0.

## Verification

- `npm run build` passed after the integration and dependency update.
- TypeScript successfully checked the typed client and database interfaces.
- Vite created the production bundle successfully.
- `git diff --check` found no whitespace errors.
- `npm audit fix` completed with zero reported vulnerabilities.
- The Supabase module is not imported by the visible application yet, so missing project credentials do not break the existing production site.

The SQL migration has not yet been applied to a hosted Supabase project. Live authorization behavior must be tested after the project is created and connected.

## Skills demonstrated

- Backend platform evaluation
- PostgreSQL schema design
- Database migrations
- TypeScript data modeling
- Environment configuration
- Authentication architecture
- Row-Level Security
- Role and entitlement modeling
- Least-privilege permissions
- Database constraints and indexes
- Dependency auditing and remediation
- Trust-boundary documentation

## Interview summary

I established the first backend foundation for a React and TypeScript coaching platform using Supabase and PostgreSQL. I modeled profiles, protected roles, and cumulative membership entitlements; wrote version-controlled migrations; and used grants plus Row-Level Security to ensure browser clients can access only their records. I also separated publishable frontend configuration from privileged server credentials and remediated dependency vulnerabilities discovered during integration.

## Resume evidence

- Designed a Supabase and PostgreSQL identity foundation with version-controlled migrations, typed frontend integration, cumulative membership entitlements, and Row-Level Security policies.
- Applied least-privilege access controls to prevent client-side role or membership modification and isolate member records by authenticated user identity.
- Investigated and remediated high-severity Vite and PostCSS dependency advisories while preserving successful TypeScript and production builds.

## Current limitations

- A hosted Supabase project has not been created or linked.
- The migration has not been executed against a live database.
- Registration, login, logout, and account pages are not implemented.
- RLS behavior has not yet been tested with multiple authenticated users.
- Coach and administrator policies are intentionally deferred.
- Payment processing does not yet create or update memberships.
- TypeScript database definitions are maintained manually until Supabase type generation is configured.

## Next milestone

Create a Supabase Free project, apply the migration in a development environment, configure the local publishable credentials, and test anonymous and multi-user authorization behavior before adding authentication screens.
