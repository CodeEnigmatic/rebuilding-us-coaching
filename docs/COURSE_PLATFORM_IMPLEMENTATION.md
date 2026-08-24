# AU-STELLAR LIFE Course Platform — Implementation Record

## Scope

This implementation adds the persisted foundation for AU-STELLAR INDIVIDUAL™ and AU-STELLAR RELATIONSHIP™. AU-STELLAR COMMUNITY™ remains future scope.

## Architecture

- React, TypeScript, and Vite render the public site and query-based portal routes compatible with GitHub Pages.
- Supabase Auth owns identity and sessions.
- PostgreSQL memberships remain the entitlement source. Relationship access inherits Individual access.
- PostgreSQL Row-Level Security protects lessons and isolates participant progress, journals, exercises, and assessments.
- Public catalog metadata and module previews are separate from protected lesson content.
- Identity is the orientation center of each course; nine A.U.-S.T.E.L.L.A.R. modules and a capstone follow.

## Implemented

- Two published course-track records with transformation statements and access requirements.
- Identity orientation, nine framework modules, and capstone for each course.
- Sixty-six ordered lesson outlines with stable slugs.
- Applied exercises for every unit, including Personal Operating System, Relationship Blueprint, and 90-day plans.
- Responsive Academy catalog, course overview, lesson, assessment, and exercise experiences.
- Server-enforced lesson and exercise access through membership-aware RLS helpers.
- Explicit lesson completion and course progress based on required lessons and exercises.
- Resume-course link to the next incomplete lesson.
- Private journal entries with manual save and restoration.
- Private exercise drafts, completion, restoration, and a reserved coach-feedback display.
- Versioned entry, midpoint, and exit assessments.
- Persisted attempts, individual responses, and dimension scores.
- Accessible radar visualization with equivalent score and entry-to-exit comparison tables.
- Loading, unavailable, locked, incomplete, success, and error states.

## Database setup

Apply migrations in filename order:

1. `202607310001_initial_identity_and_access.sql`
2. `202608130001_portal_phase_1.sql`
3. `202608160001_client_support_requests.sql`
4. `202608160002_course_platform.sql`

The fourth migration creates and seeds the course platform. Apply it to a development Supabase project before testing. Do not use real client data during policy verification.

## Content editing

Seeded lesson records intentionally use `content_status = 'outline'`. Final authored teaching should replace each outline’s `content`, then set the status to `draft` or `final`. Media URLs remain nullable so videos may be divided into any number of parts before publishing.

Do not put paid long-form lesson content back into browser TypeScript objects. Store it in protected course records so RLS remains the content boundary.

## Privacy boundaries

- A member can retrieve only content allowed by their active membership.
- A member can manage only their own progress, journals, exercise submissions, and assessment records.
- Relationship answers are individual by default and are not automatically exposed to a partner.
- Journal and exercise visibility defaults to `private`.
- Coach sharing requires a later explicit product control and policy review.
- Assessment results are coaching snapshots, not diagnoses.
- Joint exercises are not presented as appropriate where there is violence, threats, intimidation, coercive control, or immediate danger.

## Validation commands

```sh
npm test
npm run lint
npm run build
npm audit
git diff --check
```

## Development demo flow

1. Apply the migrations to a non-production Supabase project.
2. Register and verify one administrator and at least two test members.
3. Grant one test member Individual access and another Relationship access.
4. Confirm Individual cannot retrieve Relationship lessons or exercises.
5. Complete lessons and exercises, refresh, and verify progress restoration.
6. Complete entry and exit assessments and verify the accessible comparison.
7. Confirm another authenticated member cannot retrieve those private records directly.

## Remaining limitations

- The new migration has not yet been applied to the connected hosted project from this workspace.
- Lesson records are production outlines; final long-form teaching, edited videos, downloadable files, challenges, and knowledge-check questions still require authoring.
- No payment provider is connected. Administrator grants remain the current entitlement source.
- Coach sharing and feedback writes are intentionally not enabled until explicit consent and role policies are designed.
- No partner-linking model exists; relationship work remains private to the submitting account.
- The support-email function still requires deployment and a configured email-provider secret.
- Browser/device verification and live multi-user RLS testing must be completed after migration deployment.

