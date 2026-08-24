-- Secure client portal Phase 1: onboarding state, manual grants, admin functions, and audit events.

create type public.access_source as enum ('manual', 'stripe', 'trial', 'promotional');

alter table public.profiles
  add column email text,
  add column onboarding_completed boolean not null default false;

alter table public.memberships
  add column source public.access_source not null default 'manual';

create unique index memberships_one_current_manual_grant_idx
  on public.memberships (user_id)
  where source = 'manual' and status in ('trialing', 'active');

create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references auth.users (id) on delete set null,
  target_user_id uuid references auth.users (id) on delete set null,
  event_type text not null check (char_length(event_type) between 1 and 100),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index audit_events_actor_idx on public.audit_events (actor_user_id, created_at desc);
create index audit_events_target_idx on public.audit_events (target_user_id, created_at desc);

alter table public.audit_events enable row level security;
revoke all on table public.audit_events from anon, authenticated;

create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = (select auth.uid()) and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

create policy "Admins can read all profiles"
on public.profiles for select to authenticated
using ((select public.is_admin()));

create policy "Admins can read all roles"
on public.user_roles for select to authenticated
using ((select public.is_admin()));

create policy "Admins can read all memberships"
on public.memberships for select to authenticated
using ((select public.is_admin()));

create policy "Admins can read audit events"
on public.audit_events for select to authenticated
using ((select public.is_admin()));

grant select on table public.audit_events to authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (user_id, display_name, email)
  values (
    new.id,
    nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''),
    lower(new.email)
  );

  insert into public.user_roles (user_id, role) values (new.id, 'member');
  return new;
end;
$$;

create function public.admin_list_clients()
returns table (
  user_id uuid,
  display_name text,
  email text,
  role public.app_role,
  tier public.membership_tier,
  membership_status public.membership_status,
  membership_id uuid,
  membership_ends_at timestamptz
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then raise exception 'administrator access required' using errcode = '42501'; end if;

  return query
  select p.user_id, p.display_name, p.email, r.role,
    m.tier, m.status, m.id, m.ends_at
  from public.profiles p
  join public.user_roles r on r.user_id = p.user_id
  left join lateral (
    select membership.* from public.memberships membership
    where membership.user_id = p.user_id
      and membership.status in ('trialing', 'active', 'past_due')
    order by membership.created_at desc limit 1
  ) m on true
  order by p.created_at desc;
end;
$$;

create function public.admin_grant_membership(
  target_user_id uuid,
  granted_tier public.membership_tier,
  grant_ends_at timestamptz default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare new_membership_id uuid;
begin
  if not public.is_admin() then raise exception 'administrator access required' using errcode = '42501'; end if;
  if target_user_id is null or target_user_id = auth.uid() then raise exception 'invalid membership target'; end if;
  if grant_ends_at is not null and grant_ends_at <= now() then raise exception 'expiration must be in the future'; end if;

  update public.memberships set status = 'canceled', ends_at = coalesce(ends_at, now())
  where user_id = target_user_id and source = 'manual' and status in ('trialing', 'active');

  insert into public.memberships (user_id, tier, status, source, ends_at)
  values (target_user_id, granted_tier, 'active', 'manual', grant_ends_at)
  returning id into new_membership_id;

  insert into public.audit_events (actor_user_id, target_user_id, event_type, metadata)
  values (auth.uid(), target_user_id, 'membership.granted', jsonb_build_object('membership_id', new_membership_id, 'tier', granted_tier));
  return new_membership_id;
end;
$$;

create function public.admin_revoke_membership(target_membership_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare target_id uuid;
begin
  if not public.is_admin() then raise exception 'administrator access required' using errcode = '42501'; end if;

  update public.memberships set status = 'canceled', ends_at = coalesce(ends_at, now())
  where id = target_membership_id and source = 'manual' and status in ('trialing', 'active')
  returning user_id into target_id;
  if target_id is null then raise exception 'active manual membership not found'; end if;

  insert into public.audit_events (actor_user_id, target_user_id, event_type, metadata)
  values (auth.uid(), target_id, 'membership.revoked', jsonb_build_object('membership_id', target_membership_id));
end;
$$;

revoke all on function public.admin_list_clients() from public, anon;
revoke all on function public.admin_grant_membership(uuid, public.membership_tier, timestamptz) from public, anon;
revoke all on function public.admin_revoke_membership(uuid) from public, anon;
grant execute on function public.admin_list_clients() to authenticated;
grant execute on function public.admin_grant_membership(uuid, public.membership_tier, timestamptz) to authenticated;
grant execute on function public.admin_revoke_membership(uuid) to authenticated;

-- Bootstrap the first admin only from the SQL editor after registration:
-- update public.user_roles set role = 'admin' where user_id = '<verified-user-uuid>';
