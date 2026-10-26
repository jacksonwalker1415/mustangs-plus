-- SMU+ RUN_ME_28 (Oct. 26, 2026): fixes from the full site security audit.
-- Policy, grant, trigger, view-option and index changes only. No rows are deleted or changed.
--
-- 1. Signed-in users could set their own created_at / last_post_at when starting a thread or replying through the API,
--    so a post dated 2099 would sit at the top of every "latest" list forever (a self-made pin). A trigger now stamps
--    created_at = now() (and last_post_at = now() on threads) for anon/authenticated inserts. Server-side code
--    (game_thread(), seed scripts, the service role) is unaffected.
-- 2. Signed-in users could insert a thread with a game_id before the official game thread existed, and game_thread()
--    would then send every game page to their thread. The same trigger clears game_id on anon/authenticated inserts,
--    so only game_thread() can create a game thread.
-- 3. forum_stats and sport_stats were SECURITY DEFINER views (Supabase advisor: ERROR). They now run as the caller
--    (security_invoker). Every board, thread and post is readable by everyone, so the counts do not change.
-- 4. posts had two SELECT policies; "read posts" (member check) has been redundant since RUN_ME_21 opened reads.
--    Dropped, and is_member() / forum_is_premium() are no longer callable through the public API
--    (anyone could ask is_member(<any user id>) whether that user had a paid demo plan).
-- 5. TRUNCATE (which skips row level security) is revoked from anon and authenticated on every public table.
--    The API never issues TRUNCATE, so this is clean-up, not a live hole.
-- 6. Covering indexes for 5 foreign keys flagged by the performance advisor.
--
-- UNDO:
--   drop trigger if exists threads_stamp_insert on public.threads; drop trigger if exists posts_stamp_insert on public.posts;
--   drop function if exists public.stamp_user_insert();
--   alter view public.forum_stats set (security_invoker = false); alter view public.sport_stats set (security_invoker = false);
--   create policy "read posts" on public.posts for select using ((not public.forum_is_premium(thread_id)) or public.is_member(auth.uid()));
--   grant execute on function public.is_member(uuid), public.forum_is_premium(bigint) to public, anon, authenticated;
--   grant truncate on all tables in schema public to anon, authenticated;
--   drop index if exists public.newsletter_signups_user_id_idx, public.post_reports_reporter_id_idx,
--     public.posts_author_handle_idx, public.posts_quote_post_id_idx, public.threads_author_handle_idx;

begin;

-- 1 + 2
create or replace function public.stamp_user_insert()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  if current_user in ('anon', 'authenticated') then
    new.created_at := now();
    if tg_table_name = 'threads' then
      new.last_post_at := now();
      new.game_id := null;
    end if;
  end if;
  return new;
end $$;
revoke all on function public.stamp_user_insert() from public, anon, authenticated;

drop trigger if exists threads_stamp_insert on public.threads;
create trigger threads_stamp_insert before insert on public.threads for each row execute function public.stamp_user_insert();
drop trigger if exists posts_stamp_insert on public.posts;
create trigger posts_stamp_insert before insert on public.posts for each row execute function public.stamp_user_insert();

-- 3
alter view public.forum_stats set (security_invoker = true);
alter view public.sport_stats set (security_invoker = true);

-- 4
drop policy if exists "read posts" on public.posts;
revoke execute on function public.is_member(uuid) from public, anon, authenticated;
revoke execute on function public.forum_is_premium(bigint) from public, anon, authenticated;

-- 5
revoke truncate on all tables in schema public from anon, authenticated;

-- 6
create index if not exists newsletter_signups_user_id_idx on public.newsletter_signups (user_id);
create index if not exists post_reports_reporter_id_idx on public.post_reports (reporter_id);
create index if not exists posts_author_handle_idx on public.posts (author_handle);
create index if not exists posts_quote_post_id_idx on public.posts (quote_post_id);
create index if not exists threads_author_handle_idx on public.threads (author_handle);

commit;
