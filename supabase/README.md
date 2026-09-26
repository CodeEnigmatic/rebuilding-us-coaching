# Supabase backend

This directory contains the version-controlled database definition for the AU-STELLAR LIFE backend.

## Current scope

The first migration creates:

- A profile for each authenticated user
- A protected application role (`member`, `coach`, or `admin`)
- Cumulative membership tiers
- Membership status and access periods
- Row-Level Security policies
- A database function that checks whether the signed-in user has a required tier

The migration has not been applied to a hosted project yet.

The second migration adds the client portal's manual access workflow, administrator-only database functions, onboarding fields, and append-only audit events.

## Local frontend configuration

1. Create a Supabase Free project.
2. Copy `.env.example` to `.env.local`.
3. Replace the placeholders with the Project URL and publishable key from the Supabase Connect panel.
4. Never put a secret key or service-role key in a `VITE_` variable.

## Authentication configuration

In the Supabase Authentication URL settings, configure:

- Site URL: `https://liveaustellarlife.com`
- Redirect URL: `https://liveaustellarlife.com/?portal=dashboard`
- Redirect URL: `https://liveaustellarlife.com/?portal=update-password`

Keep email confirmation enabled for production registration.

## First administrator

Register and verify the intended administrator account first. Then use the Supabase SQL editor once to promote that specific UUID:

```sql
update public.user_roles
set role = 'admin'
where user_id = '<verified-user-uuid>';
```

Do not build a public “make me admin” workflow. Subsequent role-management functionality should use a separately reviewed administrator function with audit logging.

## GitHub Pages deployment variables

The GitHub Actions build needs these repository variables or environment values:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

They are publishable browser configuration, not privileged secrets. Secret/service-role credentials still must not be added.

Vite embeds every `VITE_` value in the browser bundle. The publishable key identifies the project but does not grant unrestricted access. Row-Level Security policies authorize each database operation.

## Trust boundary

```text
Untrusted browser
    |  session token + publishable project key
    v
Supabase API and Auth
    |  PostgreSQL Row-Level Security
    v
Authorized rows only
```

The browser is not trusted to decide whether someone is a member, coach, or administrator. It may request data, but the database policies make the final access decision.

## Applying the migration

The migration can be applied after a Supabase project is created and linked. Before applying it to any production project, test it in a separate development project and verify that:

- Anonymous requests cannot read any private tables.
- A signed-in user can read only their profile, role, and memberships.
- A signed-in user can change only their own `display_name`.
- A signed-in user cannot assign a role or membership.
- The tier helper respects cumulative access and expiration dates.

Use [the Phase 1 security test checklist](../docs/PORTAL_PHASE_1_SECURITY_TESTS.md) before production use.

## Administrative writes

The frontend intentionally has no permission to create roles or memberships. Those records must later be written by a trusted server process, such as a verified Stripe webhook or a carefully protected administrative function.

## Client invitations

Deploy the authenticated `invite-client` Edge Function to enable **Invite a client** in the administrator portal:

```sh
npx supabase@latest functions deploy invite-client
```

The function verifies the caller's session and administrator role before using Supabase Auth's server-only invitation API. It then grants the selected tier through `admin_grant_membership`, preserving the existing PostgreSQL audit event. The secret key is supplied automatically inside hosted Edge Functions and must never be added to a frontend or `VITE_` variable.

Production invitations also require custom SMTP under **Supabase Dashboard → Authentication → Emails → SMTP Settings**. The built-in Supabase mail service sends only to project-team addresses. Use a verified transactional sending domain and ensure this redirect remains allowed:

```text
https://liveaustellarlife.com/?portal=update-password
```

## Client support email

Apply `202608160001_client_support_requests.sql`, then deploy the authenticated `send-support-request` Edge Function. Configure these Edge Function secrets before deployment:

```text
RESEND_API_KEY=<Resend API key>
ADMIN_SUPPORT_EMAIL=Liveaustellarlife@gmail.com
SUPPORT_FROM_EMAIL=AU-STELLAR LIFE <support@your-verified-domain.example>
```

The Resend sending domain must be verified. Never add the Resend key to a `VITE_` variable or frontend file. The function authenticates the client, stores the request for the administrator inbox, and sends an email with the client's account address as the reply-to address.
