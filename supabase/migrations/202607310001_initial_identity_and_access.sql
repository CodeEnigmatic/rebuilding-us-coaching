-- AU-STELLAR LIFE backend foundation
-- Creates member profiles, application roles, memberships, and row-level authorization.

create type public.app_role as enum ('member', 'coach', 'admin');
create type public.membership_tier as enum ('individual', 'relationship', 'community');
create type public.membership_status as enum ('trialing', 'active', 'past_due', 'canceled', 'expired');

create table public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  display_name text check (display_name is null or char_length(display_name) between 1 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_roles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role public.app_role not null default 'member',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  tier public.membership_tier not null,
  status public.membership_status not null default 'active',
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint memberships_valid_period check (ends_at is null or ends_at > starts_at)
);

create index memberships_user_id_idx on public.memberships (user_id);
create index memberships_access_lookup_idx
  on public.memberships (user_id, status, tier, starts_at, ends_at);

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger user_roles_set_updated_at
before update on public.user_roles
for each row execute function public.set_updated_at();

create trigger memberships_set_updated_at
before update on public.memberships
for each row execute function public.set_updated_at();

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (user_id, display_name)
  values (new.id, nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''));

  insert into public.user_roles (user_id, role)
  values (new.id, 'member');

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create function public.has_membership_tier(required_tier public.membership_tier)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.memberships as membership
    where membership.user_id = (select auth.uid())
      and membership.status in ('trialing', 'active')
      and membership.starts_at <= now()
      and (membership.ends_at is null or membership.ends_at > now())
      and case membership.tier
        when 'individual' then 1
        when 'relationship' then 2
        when 'community' then 3
      end >= case required_tier
        when 'individual' then 1
        when 'relationship' then 2
        when 'community' then 3
      end
  );
$$;

revoke all on function public.set_updated_at() from public, anon, authenticated;
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.has_membership_tier(public.membership_tier) from public, anon;
grant execute on function public.has_membership_tier(public.membership_tier) to authenticated;

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.memberships enable row level security;

create policy "Members can read their own profile"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Members can update their own profile"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Members can read their own role"
on public.user_roles
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Members can read their own memberships"
on public.memberships
for select
to authenticated
using ((select auth.uid()) = user_id);

revoke all on table public.profiles from anon, authenticated;
revoke all on table public.user_roles from anon, authenticated;
revoke all on table public.memberships from anon, authenticated;

grant select on table public.profiles to authenticated;
grant update (display_name) on table public.profiles to authenticated;
grant select on table public.user_roles to authenticated;
grant select on table public.memberships to authenticated;
