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

## Local frontend configuration

1. Create a Supabase Free project.
2. Copy `.env.example` to `.env.local`.
3. Replace the placeholders with the Project URL and publishable key from the Supabase Connect panel.
4. Never put a secret key or service-role key in a `VITE_` variable.

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

## Administrative writes

The frontend intentionally has no permission to create roles or memberships. Those records must later be written by a trusted server process, such as a verified Stripe webhook or a carefully protected administrative function.
