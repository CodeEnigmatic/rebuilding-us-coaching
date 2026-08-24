-- AU-STELLAR LIFE persisted course platform.
-- Public users may discover published tracks/modules. Paid lesson content and all
-- participant data remain protected by membership entitlements and owner RLS.

create type public.course_status as enum ('draft', 'published', 'archived');
create type public.progress_status as enum ('not_started', 'in_progress', 'completed');
create type public.assessment_type as enum ('entry', 'midpoint', 'exit');
create type public.entry_visibility as enum ('private', 'coach_shared');

create table public.course_tracks (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text not null,
  description text not null,
  transformation_statement text not null,
  audience text not null,
  estimated_weeks int not null default 12 check (estimated_weeks between 1 and 52),
  access_level public.membership_tier not null,
  status public.course_status not null default 'draft',
  display_order int not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.course_modules (
  id uuid primary key default gen_random_uuid(),
  track_id uuid not null references public.course_tracks(id) on delete cascade,
  slug text not null,
  framework_principle text not null,
  title text not null,
  summary text not null,
  desired_outcome text not null,
  guiding_question text,
  applied_work jsonb not null default '[]'::jsonb,
  module_type text not null check (module_type in ('orientation', 'framework', 'capstone')),
  display_order int not null,
  is_required boolean not null default true,
  status public.course_status not null default 'published',
  unique (track_id, slug)
);

create table public.course_lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.course_modules(id) on delete cascade,
  slug text not null,
  title text not null,
  objective text not null,
  content text not null default '',
  content_status text not null default 'outline' check (content_status in ('outline', 'draft', 'final')),
  media_url text,
  reflection_prompts jsonb not null default '[]'::jsonb,
  display_order int not null,
  is_required boolean not null default true,
  estimated_minutes int not null default 12 check (estimated_minutes between 1 and 240),
  unique (module_id, slug)
);

create table public.course_resources (
  id uuid primary key default gen_random_uuid(),
  module_id uuid references public.course_modules(id) on delete cascade,
  lesson_id uuid references public.course_lessons(id) on delete cascade,
  title text not null,
  resource_type text not null,
  file_url text,
  description text not null default '',
  display_order int not null default 1,
  check ((module_id is not null) <> (lesson_id is not null))
);

create table public.course_exercises (
  id uuid primary key default gen_random_uuid(),
  module_id uuid references public.course_modules(id) on delete cascade,
  lesson_id uuid references public.course_lessons(id) on delete cascade,
  slug text not null,
  title text not null,
  instructions text not null,
  response_schema jsonb not null default '{"type":"long_text"}'::jsonb,
  visibility public.entry_visibility not null default 'private',
  display_order int not null default 1,
  check ((module_id is not null) <> (lesson_id is not null))
);

create table public.course_enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  track_id uuid not null references public.course_tracks(id) on delete cascade,
  entitlement_source public.access_source not null default 'manual',
  status public.progress_status not null default 'not_started',
  enrolled_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (user_id, track_id)
);

create table public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.course_lessons(id) on delete cascade,
  status public.progress_status not null default 'not_started',
  started_at timestamptz,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create table public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid references public.course_lessons(id) on delete cascade,
  module_id uuid references public.course_modules(id) on delete cascade,
  prompt_key text not null,
  content text not null check (char_length(content) <= 10000),
  visibility public.entry_visibility not null default 'private',
  updated_at timestamptz not null default now(),
  unique nulls not distinct (user_id, lesson_id, module_id, prompt_key),
  check ((lesson_id is not null) <> (module_id is not null))
);

create table public.exercise_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  exercise_id uuid not null references public.course_exercises(id) on delete cascade,
  response jsonb not null,
  status public.progress_status not null default 'in_progress',
  coach_feedback text,
  submitted_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, exercise_id)
);

create table public.course_assessments (
  id uuid primary key default gen_random_uuid(),
  track_id uuid not null references public.course_tracks(id) on delete cascade,
  assessment_type public.assessment_type not null,
  title text not null,
  version int not null default 1,
  status public.course_status not null default 'published',
  unique (track_id, assessment_type, version)
);

create table public.assessment_questions (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.course_assessments(id) on delete cascade,
  dimension text not null,
  prompt text not null,
  response_type text not null default 'scale_1_5',
  options jsonb not null default '[1,2,3,4,5]'::jsonb,
  scoring_rule jsonb not null default '{"method":"direct"}'::jsonb,
  display_order int not null
);

create table public.assessment_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  assessment_id uuid not null references public.course_assessments(id) on delete restrict,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  dimension_scores jsonb not null default '{}'::jsonb
);

create table public.assessment_responses (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.assessment_attempts(id) on delete cascade,
  question_id uuid not null references public.assessment_questions(id) on delete restrict,
  response jsonb not null,
  score numeric,
  unique (attempt_id, question_id)
);

create table public.course_safety_resources (
  id uuid primary key default gen_random_uuid(),
  track_id uuid not null references public.course_tracks(id) on delete cascade,
  title text not null,
  body text not null,
  resource_url text,
  region text,
  status public.course_status not null default 'published',
  display_order int not null default 1
);

create index course_modules_track_order_idx on public.course_modules(track_id, display_order);
create index course_lessons_module_order_idx on public.course_lessons(module_id, display_order);
create index lesson_progress_user_idx on public.lesson_progress(user_id, status);
create index assessment_attempts_user_idx on public.assessment_attempts(user_id, started_at desc);

create trigger course_tracks_set_updated_at before update on public.course_tracks
for each row execute function public.set_updated_at();
create trigger lesson_progress_set_updated_at before update on public.lesson_progress
for each row execute function public.set_updated_at();
create trigger journal_entries_set_updated_at before update on public.journal_entries
for each row execute function public.set_updated_at();
create trigger exercise_submissions_set_updated_at before update on public.exercise_submissions
for each row execute function public.set_updated_at();

create function public.can_access_track(target_track_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.course_tracks track
    where track.id = target_track_id
      and public.has_membership_tier(track.access_level)
  );
$$;

create function public.can_access_lesson(target_lesson_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.course_lessons lesson
    join public.course_modules module on module.id = lesson.module_id
    where lesson.id = target_lesson_id and public.can_access_track(module.track_id)
  );
$$;

revoke all on function public.can_access_track(uuid) from public, anon;
revoke all on function public.can_access_lesson(uuid) from public, anon;
grant execute on function public.can_access_track(uuid) to authenticated;
grant execute on function public.can_access_lesson(uuid) to authenticated;

alter table public.course_tracks enable row level security;
alter table public.course_modules enable row level security;
alter table public.course_lessons enable row level security;
alter table public.course_resources enable row level security;
alter table public.course_exercises enable row level security;
alter table public.course_enrollments enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.journal_entries enable row level security;
alter table public.exercise_submissions enable row level security;
alter table public.course_assessments enable row level security;
alter table public.assessment_questions enable row level security;
alter table public.assessment_attempts enable row level security;
alter table public.assessment_responses enable row level security;
alter table public.course_safety_resources enable row level security;

create policy "Published tracks are discoverable" on public.course_tracks for select
using (status = 'published' or (select public.is_admin()));
create policy "Published module outlines are discoverable" on public.course_modules for select
using (status = 'published' or (select public.is_admin()));
create policy "Entitled members read lessons" on public.course_lessons for select to authenticated
using (public.can_access_lesson(id));
create policy "Entitled members read resources" on public.course_resources for select to authenticated
using (case when lesson_id is not null then public.can_access_lesson(lesson_id) else exists (
  select 1 from public.course_modules module where module.id = course_resources.module_id and public.can_access_track(module.track_id)
) end);
create policy "Entitled members read exercises" on public.course_exercises for select to authenticated
using (case when lesson_id is not null then public.can_access_lesson(lesson_id) else exists (
  select 1 from public.course_modules module where module.id = course_exercises.module_id and public.can_access_track(module.track_id)
) end);

create policy "Members manage own enrollments" on public.course_enrollments for all to authenticated
using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()) and public.can_access_track(track_id));
create policy "Members manage own lesson progress" on public.lesson_progress for all to authenticated
using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()) and public.can_access_lesson(lesson_id));
create policy "Members manage own journals" on public.journal_entries for all to authenticated
using (user_id = (select auth.uid())) with check (
  user_id = (select auth.uid()) and
  case
    when lesson_id is not null then public.can_access_lesson(lesson_id)
    else exists (
      select 1 from public.course_modules module
      where module.id = journal_entries.module_id
        and public.can_access_track(module.track_id)
    )
  end
);
create policy "Members manage own exercise submissions" on public.exercise_submissions for all to authenticated
using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()) and exists (
  select 1 from public.course_exercises exercise where exercise.id = exercise_submissions.exercise_id and
    (case when exercise.lesson_id is not null then public.can_access_lesson(exercise.lesson_id) else exists (
      select 1 from public.course_modules module where module.id = exercise.module_id and public.can_access_track(module.track_id)
    ) end)
));

create policy "Entitled members read assessments" on public.course_assessments for select to authenticated
using (status = 'published' and public.can_access_track(track_id));
create policy "Entitled members read assessment questions" on public.assessment_questions for select to authenticated
using (exists (select 1 from public.course_assessments assessment where assessment.id = assessment_questions.assessment_id and public.can_access_track(assessment.track_id)));
create policy "Members manage own assessment attempts" on public.assessment_attempts for all to authenticated
using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()) and exists (
  select 1 from public.course_assessments assessment where assessment.id = assessment_attempts.assessment_id and public.can_access_track(assessment.track_id)
));
create policy "Members manage own assessment responses" on public.assessment_responses for all to authenticated
using (exists (
  select 1
  from public.assessment_attempts attempt
  join public.assessment_questions question
    on question.assessment_id = attempt.assessment_id
   and question.id = assessment_responses.question_id
  where attempt.id = assessment_responses.attempt_id
    and attempt.user_id = (select auth.uid())
))
with check (exists (
  select 1
  from public.assessment_attempts attempt
  join public.assessment_questions question
    on question.assessment_id = attempt.assessment_id
   and question.id = assessment_responses.question_id
  where attempt.id = assessment_responses.attempt_id
    and attempt.user_id = (select auth.uid())
));
create policy "Published safety resources are readable" on public.course_safety_resources for select
using (status = 'published' or (select public.is_admin()));

grant select on public.course_tracks, public.course_modules to anon, authenticated;
grant select on public.course_lessons, public.course_resources, public.course_exercises, public.course_assessments, public.assessment_questions to authenticated;
grant select on public.course_safety_resources to anon, authenticated;
grant select, insert, update on public.course_enrollments, public.lesson_progress, public.journal_entries, public.exercise_submissions, public.assessment_attempts, public.assessment_responses to authenticated;

insert into public.course_tracks (slug, title, subtitle, description, transformation_statement, audience, access_level, status, display_order)
values
('individual', 'AU-STELLAR INDIVIDUAL™', 'Refine Yourself', 'Level 1 — You. Identity-centered development for intentional personal growth.', 'Move from unconsciously repeating patterns to intentionally building an identity, lifestyle, and legacy aligned with your highest values.', 'Adults seeking greater self-awareness, responsibility, alignment, and resilience.', 'individual', 'published', 1),
('relationship', 'AU-STELLAR RELATIONSHIP™', 'Build Together — The Rebuilding Us Journey', 'Levels 2 and 3 — Relationships and Us. Designed for couples or one person becoming healthier in present or future relationships.', 'Move from reacting against one another to understanding, repairing, and intentionally building together.', 'Couples and individuals seeking healthier communication, repair, shared culture, and long-term resilience.', 'relationship', 'published', 2);

insert into public.course_safety_resources (track_id, title, body, display_order)
select id, 'Relationship course scope and safety', 'This course is educational coaching content, not emergency, medical, mental-health, or legal treatment. Joint conflict exercises are not appropriate when there is active violence, credible threats, intimidation, coercive control, or immediate danger. Prioritize safety and seek qualified local support appropriate to your circumstances.', 1
from public.course_tracks where slug = 'relationship';

with module_seed(track_slug, slug, principle, title, summary, outcome, question, module_type, ordering, lessons, work) as (values
('individual','identity-orientation','Identity','Orientation: Identity at the Center','Identity is the organizing center of the framework.','Distinguish essential identity from roles, wounds, responsibilities, and public image.',null,'orientation',0,'["Who Are You Beneath the Titles?","Inherited Identity Versus Chosen Identity","The Person You Are Becoming"]'::jsonb,'["Complete the Individual entry assessment","Review the opening personal dimensions","Select two priority areas","Write an initial Who I Am statement"]'::jsonb),
('individual','awareness','Awareness','Module 1: Awareness','Observe present reality before trying to change it.','Separate observable facts from internal stories and recognize recurring triggers.','What story am I telling myself that may not be completely true?','framework',1,'["The Observer and the Automatic Self","Story Versus Reality","Triggers, Habits, and Repeating Patterns"]'::jsonb,'["Seven-Day Pattern Observation Log","Facts-versus-story worksheet","What becomes visible when I stop defending the pattern?"]'::jsonb),
('individual','understanding','Understanding','Module 2: Understanding','Explore the causes and protective logic beneath repeated patterns.','Explain needs, fears, experiences, and beliefs without using them to excuse harm.','Why do I keep repeating this pattern?','framework',2,'["The Roots Beneath the Reaction","Needs, Fears, and Protective Strategies","Accountability Without Self-Condemnation"]'::jsonb,'["Trigger → Story → Emotion → Reaction → Result map","Pattern origin reflection","What has this protected, and what is it costing now?"]'::jsonb),
('individual','strategy','Strategy','Module 3: Strategy','Convert values and desired identity into practical systems.','Design observable habits, boundaries, cues, and decision rules.','What practical system will move me toward the person I want to become?','framework',3,'["From Values to Behavior","Identity-Based Goals and Habits","Designing the Environment for Success"]'::jsonb,'["Thirty-Day Personal Strategy","Habit and environment audit","Implementation intention for each priority area"]'::jsonb),
('individual','transformation','Transformation','Module 4: Transformation','Practice healthier responses until change becomes visible.','Replace one destructive pattern with a specific practiced response.','What action can I take today?','framework',4,'["Transformation Requires Evidence","Replacing the Old Response","Using Discomfort and Feedback"]'::jsonb,'["Seven-Day Proof-of-Change Challenge","Before-and-after behavioral sequence","Accountability check-in"]'::jsonb),
('individual','excellence','Excellence','Module 5: Excellence','Pursue mature quality and character without perfectionism.','Establish realistic standards supported by discipline and responsibility.',null,'framework',5,'["Excellence Is Not Perfection","Character, Discipline, and Responsibility","Personal Leadership"]'::jsonb,'["Personal Code of Excellence","Weekly standards scorecard","Excellence in this season reflection"]'::jsonb),
('individual','love','Love','Module 6: Love','Direct growth toward dignity, truthful care, and service.','Practice self-respect, compassionate accountability, and appropriate boundaries.',null,'framework',6,'["Self-Love Versus Self-Indulgence","Compassionate Accountability","Boundaries, Service, and Love in Action"]'::jsonb,'["Love-in-Action Plan","Compassionate accountability letter","Personal boundary script"]'::jsonb),
('individual','legacy','Legacy','Module 7: Legacy','Turn gifts, experience, and purpose toward durable contribution.','Articulate a personal legacy and begin one meaningful contribution.',null,'framework',7,'["The Meaningful Problem You Are Here to Address","Gifts, Contribution, and Generational Influence","Turning Purpose Into Present Action"]'::jsonb,'["Personal Legacy Statement","Contribution inventory","One small legacy project"]'::jsonb),
('individual','alignment','Alignment','Module 8: Alignment','Bring stated values and daily behavior into greater agreement.','Align time, money, work, relationships, and habits with core values.',null,'framework',8,'["When Values and Behavior Disagree","Aligning Time, Money, Work, and Relationships","Integrity as Internal Coherence"]'::jsonb,'["Whole-Life Alignment Audit","Calendar and spending comparison","Personal decision filter"]'::jsonb),
('individual','resilience','Resilience','Module 9: Resilience','Adapt, recover, and continue the growth cycle through adversity.','Create a realistic recovery plan for setbacks and stressful seasons.',null,'framework',9,'["Responding Rather Than Surrendering to Setbacks","Emotional Regulation, Recovery, and Adaptation","Returning to the Path Without Starting Over"]'::jsonb,'["Personal Resilience Playbook","Early-warning-sign inventory","Setback recovery plan"]'::jsonb),
('individual','personal-operating-system','Capstone','Individual Capstone: Personal Operating System','Integrate identity, standards, systems, love, resilience, and legacy.','Complete a personal blueprint and 90-day transformation plan.',null,'capstone',10,'["Integrating Your Personal Operating System","Comparing Baseline and Exit Growth","Building the Next 90 Days"]'::jsonb,'["Refined identity statement and core values","Trigger map, disciplines, boundaries, and decision filters","Resilience and legacy plans","90-day transformation plan"]'::jsonb),
('relationship','relationship-orientation','Identity','Orientation: Two Identities, One Relationship','Clarify what belongs to me, you, and us.','Maintain individual identity while naming a healthy shared direction.',null,'orientation',0,'["A Relationship Is Made of Two Whole People","Personal Identity and Shared Identity","What Are We Trying to Build Together?"]'::jsonb,'["Complete the Relationship entry assessment individually","Identify strengths and two growth priorities","Write who I am, what I bring, and what I hope we build","Establish conversation boundaries and a pause process"]'::jsonb),
('relationship','awareness','Awareness','Module 1: Awareness','Notice interpretations, projections, triggers, and the repeating relationship dance.','See the interaction cycle without treating a partner as the enemy.',null,'framework',1,'["The Story I Tell About My Partner","Triggers, Projections, and Negative Narratives","The Relationship Dance"]'::jsonb,'["Our Cycle Map","Facts-versus-interpretation dialogue","Twenty-four-hour relationship observation challenge"]'::jsonb),
('relationship','understanding','Understanding','Module 2: Understanding','Discover primary emotions, needs, attachment patterns, and learned roles.','Hold empathy and accountability together without excusing harm.',null,'framework',2,'["What Lives Beneath the Behavior?","Attachment, Upbringing, and Learned Roles","Empathy Without Excusing Harm"]'::jsonb,'["Beneath-the-Behavior Worksheet","Attachment and role reflection","When this happens, the meaning I make is conversation"]'::jsonb),
('relationship','strategy','Strategy','Module 3: Strategy','Build communication, connection, and responsibility systems.','Use clearer requests, agreements, boundaries, and shared ownership.',null,'framework',3,'["Building Communication Agreements","Connection Requires a System","Shared Responsibility and Initiative"]'::jsonb,'["AU-STELLAR Weekly Relationship Meeting","Responsibility and mental-load map","Connection rhythm calendar"]'::jsonb),
('relationship','transformation','Transformation','Module 4: Transformation','Regulate escalation and practice vulnerability, repair, and reconnection.','Interrupt the cycle with a repeatable conflict-repair process.',null,'framework',4,'["Regulate Before You Relate","Vulnerability Instead of Accusation","Interrupt, Repair, and Try Again"]'::jsonb,'["Seven-Day Cycle-Breaking Challenge","Conflict replacement script","Guided repair conversation"]'::jsonb),
('relationship','excellence','Excellence','Module 5: Excellence','Practice the character of a strong, reliable partner.','Demonstrate initiative, accountability, honor, and realistic standards.',null,'framework',5,'["The Character of a Strong Partner","Reliability, Initiative, and Accountability","High Standards Without Perfectionism"]'::jsonb,'["Relationship Covenant","Partnership standards scorecard","One-week initiative challenge"]'::jsonb),
('relationship','love','Love','Module 6: Love','Practice care through dignity, friendship, affection, intimacy, and consent.','Create mutually agreed ways to honor, cherish, and connect.',null,'framework',6,'["Love as a Practice, Not Only a Feeling","To Honor and Cherish","Friendship, Affection, Emotional Intimacy, Physical Intimacy, and Consent"]'::jsonb,'["Personalized Connection Plan","Honor-and-cherish reflection","Mutually agreed connection menu"]'::jsonb),
('relationship','legacy','Legacy','Module 7: Legacy','Recognize and intentionally shape the culture every relationship creates.','Define family culture, traditions, service, and generational influence.',null,'framework',7,'["Every Relationship Creates a Culture","The Story Our Family Will Inherit","Traditions, Service, and Generational Influence"]'::jsonb,'["Family Constitution","Shared Legacy Statement","One relationship or family tradition"]'::jsonb),
('relationship','alignment','Alignment','Module 8: Alignment','Clarify shared values and expectations across practical life domains.','Create agreements around time, money, parenting, intimacy, and responsibility.',null,'framework',8,'["Shared Values and Unspoken Expectations","Alignment Around Time, Money, Parenting, Intimacy, and Responsibility","Individual Freedom Within a Shared Future"]'::jsonb,'["Shared Alignment Agreement","Expectations inventory","Relationship decision rules"]'::jsonb),
('relationship','resilience','Resilience','Module 9: Resilience','Repair rupture and protect connection through setbacks and stress.','Build trust-repair and stress-season practices without equating forgiveness with restored access.',null,'framework',9,'["Repair After Rupture","Trust, Forgiveness, Reconciliation, and Changed Behavior","Protecting Connection During Stressful Seasons"]'::jsonb,'["Relationship Resilience Plan","Trust-repair commitments","Stress-season communication plan"]'::jsonb),
('relationship','relationship-blueprint','Capstone','Relationship Capstone: Relationship Blueprint','Integrate identity, cycle awareness, agreements, culture, and resilience.','Complete a relationship blueprint and 90-day plan usable jointly or individually.',null,'capstone',10,'["Integrating the Relationship Blueprint","Comparing Baseline and Exit Growth","Building the Next 90 Days"]'::jsonb,'["Individual and shared identity statements","Cycle map, communication, conflict, roles, and boundaries","Culture, intimacy, legacy, and resilience commitments","90-day relationship plan"]'::jsonb)
), inserted as (
  insert into public.course_modules (track_id, slug, framework_principle, title, summary, desired_outcome, guiding_question, applied_work, module_type, display_order)
  select track.id, seed.slug, seed.principle, seed.title, seed.summary, seed.outcome, seed.question, seed.work, seed.module_type, seed.ordering
  from module_seed seed join public.course_tracks track on track.slug = seed.track_slug
  returning id, track_id, slug
)
insert into public.course_lessons (module_id, slug, title, objective, content, reflection_prompts, display_order)
select module.id,
  regexp_replace(lower(regexp_replace(item.title, '[^a-zA-Z0-9]+', '-', 'g')), '(^-|-$)', '', 'g'),
  item.title,
  'Understand and apply ' || item.title || ' within the AU-STELLAR learning cycle.',
  'Lesson outline ready for authoring. Add the final teaching, story or case study, practice guidance, and optional faith-and-philosophy reflection.',
  jsonb_build_array('What became visible?', 'What healthier response will you practice?', 'How could this growth serve someone beyond you?'),
  item.ordering::int
from inserted module
join module_seed seed on seed.slug = module.slug and (select slug from public.course_tracks where id = module.track_id) = seed.track_slug
cross join lateral jsonb_array_elements_text(seed.lessons) with ordinality as item(title, ordering);

insert into public.course_exercises (module_id, slug, title, instructions, display_order)
select module.id,
  regexp_replace(lower(regexp_replace(work.title, '[^a-zA-Z0-9]+', '-', 'g')), '(^-|-$)', '', 'g'),
  work.title,
  'Complete this applied work privately. Save a draft and return when ready. Sharing with a coach must be an intentional choice.',
  work.ordering::int
from public.course_modules module
cross join lateral jsonb_array_elements_text(module.applied_work) with ordinality as work(title, ordering);

insert into public.course_assessments (track_id, assessment_type, title, version)
select track.id, assessment.kind, track.title || ' ' || initcap(assessment.kind::text) || ' Assessment', 1
from public.course_tracks track cross join (values ('entry'::public.assessment_type), ('midpoint'), ('exit')) assessment(kind);

insert into public.assessment_questions (assessment_id, dimension, prompt, display_order)
select assessment.id, dimension.name,
  case assessment.assessment_type
    when 'entry' then 'At the start of this course, how consistently is ' || lower(dimension.name) || ' reflected in your current life?'
    when 'midpoint' then 'At the midpoint, how consistently are you practicing ' || lower(dimension.name) || '?'
    else 'At the end of this course, how consistently is ' || lower(dimension.name) || ' reflected in your current life?'
  end,
  dimension.ordering
from public.course_assessments assessment
join public.course_tracks track on track.id = assessment.track_id
cross join lateral (
  select * from (values
    (1, 'Awareness'), (2, 'Understanding'), (3, 'Strategy'), (4, 'Transformation'), (5, 'Excellence'),
    (6, 'Love'), (7, 'Legacy'), (8, 'Alignment'), (9, 'Resilience')
  ) dimensions(ordering, name)
) dimension;
