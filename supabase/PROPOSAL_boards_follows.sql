-- PROPOSAL (not applied): Boards #3, follow threads + in-app reply notifications. No email.
-- For Grok Bot to review and apply in Supabase project mustangs-plus. Safe to re-run.
-- Adds one table (public.thread_follows) and two functions. Nothing existing is altered or deleted.
-- Uses the existing index posts_thread_created_idx (schema.sql) for the unread count.
-- After applying: set FOLLOWS=true in assets/sb.js (or MP.FEATURES.follows=true in data.js) so the site uses the
-- server instead of keeping follows in each browser. Until then the site never requests these objects (no 404s).

begin;

create table if not exists public.thread_follows (
  user_id      uuid        not null default auth.uid() references auth.users(id) on delete cascade,
  thread_id    bigint      not null references public.threads(id) on delete cascade,
  created_at   timestamptz not null default now(),
  last_read_at timestamptz not null default now(),
  primary key (user_id, thread_id)
);
create index if not exists thread_follows_thread_idx on public.thread_follows (thread_id);

alter table public.thread_follows enable row level security;

-- Each member reads and writes only their own follows. Anonymous visitors get nothing.
revoke all on public.thread_follows from public, anon, authenticated;
grant select, insert, delete on public.thread_follows to authenticated;
grant update (last_read_at) on public.thread_follows to authenticated;

drop policy if exists "read own follows"   on public.thread_follows;
drop policy if exists "add own follow"     on public.thread_follows;
drop policy if exists "mark own follow"    on public.thread_follows;
drop policy if exists "remove own follow"  on public.thread_follows;
create policy "read own follows"  on public.thread_follows for select to authenticated using (user_id = auth.uid());
-- Cap of 500 follows per member keeps the notification query small.
create policy "add own follow"    on public.thread_follows for insert to authenticated
  with check (user_id = auth.uid()
    and (select count(*) from public.thread_follows f where f.user_id = auth.uid()) < 500);
create policy "mark own follow"   on public.thread_follows for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "remove own follow" on public.thread_follows for delete to authenticated using (user_id = auth.uid());

-- Unread replies on the caller's followed threads: posts newer than last_read_at, not written by the caller.
-- security invoker, so the posts and threads read policies still apply (members-only posts stay hidden from free accounts).
create or replace function public.follow_notifications(p_limit int default 20)
returns table (thread_id bigint, title text, unread int, first_unread_post_id bigint, last_post_at timestamptz)
language sql stable security invoker set search_path = public
as $$
  select f.thread_id, t.title, count(p.id)::int, min(p.id), max(p.created_at)
  from public.thread_follows f
  join public.threads t on t.id = f.thread_id
  join public.posts p on p.thread_id = f.thread_id and p.created_at > f.last_read_at
                     and p.author_id is distinct from auth.uid()
  where f.user_id = auth.uid()
  group by f.thread_id, t.title
  order by max(p.created_at) desc
  limit least(greatest(coalesce(p_limit, 20), 1), 50)
$$;

-- Mark one followed thread read (p_thread), or all of them (null). Only the caller's rows; returns rows touched.
create or replace function public.follow_mark_read(p_thread bigint default null)
returns int
language sql volatile security invoker set search_path = public
as $$
  with u as (
    update public.thread_follows set last_read_at = now()
    where user_id = auth.uid() and (p_thread is null or thread_id = p_thread)
    returning 1)
  select count(*)::int from u
$$;

revoke all on function public.follow_notifications(int) from public, anon, authenticated;
revoke all on function public.follow_mark_read(bigint) from public, anon, authenticated;
grant execute on function public.follow_notifications(int) to authenticated;
grant execute on function public.follow_mark_read(bigint) to authenticated;

commit;

-- Rollback (only if asked): drop function public.follow_mark_read(bigint); drop function public.follow_notifications(int);
-- drop table public.thread_follows;   (removes follows only; no other data is touched)
