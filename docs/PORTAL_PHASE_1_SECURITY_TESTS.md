# Client Portal Phase 1 — Security Test Checklist

These tests require a connected development Supabase project with both migrations applied. Do not use real client data.

## Test identities

- Anonymous browser session
- Client A
- Client B
- Administrator

## Authentication

- Registration requires a valid email and password meeting the configured policy.
- A new user receives a verification message.
- An unverified user cannot sign in when email confirmation is required.
- Verified credentials create a session.
- Incorrect credentials produce a generic failure without revealing sensitive account details.
- Password-reset email returns only to an allow-listed portal URL.
- Updating the password requires a valid recovery session.
- Sign-out removes the active session.

## Client isolation

- Anonymous requests cannot read `profiles`, `user_roles`, `memberships`, or `audit_events`.
- Client A can read only Client A's profile, role, and memberships.
- Client A receives no rows when directly requesting Client B's UUID.
- Client A can update only their own display name.
- Client A cannot change email, onboarding state, role, tier, status, source, or expiration through direct API requests.
- Client A cannot insert or delete memberships.
- Client A cannot read audit events.

## Administrator authorization

- A member calling `admin_list_clients` receives an authorization error.
- A member calling either grant or revoke function receives an authorization error.
- An administrator can list registered clients.
- An administrator can grant Individual, Relationship, or Community access to another user.
- A new manual grant cancels the previous active manual grant.
- An administrator cannot grant access to their own account through the portal function.
- An administrator cannot create an already-expired grant.
- An administrator can revoke an active manual grant.
- Revoking a nonexistent, inactive, or non-manual grant fails.
- Every successful grant and revoke creates an audit event with actor, target, event type, and membership identifier.

## Tier behavior

- Individual unlocks only Individual.
- Relationship unlocks Individual and Relationship.
- Community unlocks all three pathways.
- Trialing and active states unlock eligible tiers.
- Past-due, canceled, and expired states do not unlock content.
- An access end time in the past does not pass `has_membership_tier` even if the status was not updated.

## Browser tampering

- Editing React state or HTML does not return protected database rows.
- Changing a client UUID in a network request does not expose another client.
- Calling administrator RPC endpoints directly as a member fails.
- The production JavaScript contains no service-role key, database password, or privileged API credential.

## Failure states

- Missing frontend configuration displays a setup-required screen without crashing the public site.
- Network errors display a recoverable portal error.
- An unauthenticated protected route redirects to login.
- A non-admin visiting the administrator location receives Access Denied.
- An empty client list and an unassigned membership both display understandable messages.

## Evidence to retain

Record the date, test environment, migration versions, expected result, actual result, and pass/fail status. Screenshots and sanitized network responses may be retained, but never capture passwords, tokens, real assessment answers, or private coaching data.
