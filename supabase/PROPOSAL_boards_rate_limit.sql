-- SMU+ PROPOSAL (Oct. 26, 2026): posting rate limit for the message boards. NOT APPLIED. Do not run until Jackson says so.
--
-- PURPOSE
--   Any signed-in free account can post on every board (RUN_ME_25), and nothing limits how fast. This adds a
--   BEFORE INSERT trigger on public.posts and public.threads that refuses a write when the same account has
--   posted too much recently:
--     posts   : 5 per minute, 60 per hour   (replies and the first post of a new thread both count)
--     threads : 2 per minute, 10 per hour   (create_thread() inserts a thread, then its first post; both are checked)
--   Only signed-in site traffic is limited (current_user = 'authenticated'). Staff tools, the SQL editor, the
--   service role and security-definer functions such as game_thread() run as other roles and are not limited.
--   The function is SECURITY INVOKER (like stamp_user_insert in RUN_ME_28) so current_user is the caller's role; the
--   counts read posts/threads under the open read policies (RUN_ME_21). A per-user advisory lock serializes one account's concurrent inserts so parallel requests can't slip past the count.
--
-- WHAT THE CLIENT SEES
--   The trigger raises SQLSTATE 'PT429' with message 'slow_down: ...'. PostgREST turns PTxyz codes into HTTP xyz,
--   so the API answers HTTP 429 and supabase-js returns error.code = 'PT429'. The site (assets/app.js boards(),
--   slowDown()) maps that to: "Slow down. You're posting faster than the boards allow. Wait a minute, then try again."
--   The client mapping is already on branch bot/boards-compact and does nothing until this file is applied.
--
-- HOW TO APPLY (when approved)
--   1. Run the test sketch below against a throwaway local Postgres first (never the live project).
--   2. Supabase dashboard > SQL editor > paste this whole file > Run. Safe to re-run (create or replace / drop if exists).
--   3. Check: select tgname from pg_trigger where tgname in ('posts_rate_limit','threads_rate_limit');  -- 2 rows
--
-- ROLLBACK
--   drop trigger if exists posts_rate_limit on public.posts;
--   drop trigger if exists threads_rate_limit on public.threads;
--   drop function if exists public.boards_rate_limit();
--   drop index if exists public.posts_author_created_idx;
--   drop index if exists public.threads_author_created_idx;
--
-- TEST SKETCH (local Postgres, same pattern as supabase/tests/post_reports_test.sh)
--   load tests/supabase_stubs.sql, schema.sql, seed.sql, RUN_ME_25_open_posting.sql, RUN_ME_28_security_audit.sql, this file (twice)
--   A = a test uuid in auth.users + profiles; T = any thread id
--   as A (set role authenticated; set request.jwt.claim.sub = A):
--     5 x  insert into posts(thread_id, author_id, body) values (T, A, 'hi')   -> all succeed
--     6th  insert                                                              -> ERROR PT429 'slow_down: ...'
--   q: update posts set created_at = now() - interval '2 minutes' where author_id = A   -> as A, insert succeeds again
--   q: insert 60 posts for A dated within the last hour (as postgres, not limited)       -> as A, insert fails PT429
--   as A: select create_thread('hilltop', null, 'Title one', 'Body') twice  -> ok;  third within a minute -> PT429
--   as postgres (not authenticated): 100 inserts in a row -> all succeed (staff/backfill not limited)
--   as B (another user) while A is limited -> succeeds (limits are per account)

begin;

create index if not exists posts_author_created_idx   on public.posts   (author_id, created_at desc);
create index if not exists threads_author_created_idx on public.threads (author_id, created_at desc);

create or replace function public.boards_rate_limit()
returns trigger language plpgsql security invoker set search_path = '' as $$
declare
  uid uuid := auth.uid();
  per_min int; per_hour int; n_min int; n_hour int;
begin
  if current_user <> 'authenticated' or uid is null then
    return new;
  end if;
  perform pg_advisory_xact_lock(hashtextextended('boards_rate_limit:' || uid::text, 0));
  if tg_table_name = 'posts' then
    per_min := 5;  per_hour := 60;
    select count(*) filter (where created_at > now() - interval '1 minute'), count(*)
      into n_min, n_hour
      from public.posts where author_id = uid and created_at > now() - interval '1 hour';
  else
    per_min := 2;  per_hour := 10;
    select count(*) filter (where created_at > now() - interval '1 minute'), count(*)
      into n_min, n_hour
      from public.threads where author_id = uid and created_at > now() - interval '1 hour';
  end if;
  if n_min >= per_min or n_hour >= per_hour then
    raise exception 'slow_down: % limit reached (% per minute, % per hour)', tg_table_name, per_min, per_hour
      using errcode = 'PT429',
            hint = case when n_min >= per_min then 'Wait a minute, then try again.' else 'Wait a while, then try again.' end;
  end if;
  return new;
end $$;
revoke all on function public.boards_rate_limit() from public, anon, authenticated;

drop trigger if exists posts_rate_limit on public.posts;
create trigger posts_rate_limit before insert on public.posts
  for each row execute function public.boards_rate_limit();

drop trigger if exists threads_rate_limit on public.threads;
create trigger threads_rate_limit before insert on public.threads
  for each row execute function public.boards_rate_limit();

commit;
