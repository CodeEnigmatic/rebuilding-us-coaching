-- Authenticated client questions with administrator-only review access.

create type public.support_request_status as enum ('new', 'reviewed', 'closed');

create table public.support_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  message text not null check (char_length(message) between 10 and 2000),
  status public.support_request_status not null default 'new',
  email_delivery_id text,
  created_at timestamptz not null default now()
);

create index support_requests_user_created_idx on public.support_requests (user_id, created_at desc);

alter table public.support_requests enable row level security;

create policy "Members can read their own support requests"
on public.support_requests for select to authenticated
using (user_id = (select auth.uid()));

create policy "Admins can read support requests"
on public.support_requests for select to authenticated
using ((select public.is_admin()));

revoke all on table public.support_requests from anon, authenticated;
grant select on table public.support_requests to authenticated;

