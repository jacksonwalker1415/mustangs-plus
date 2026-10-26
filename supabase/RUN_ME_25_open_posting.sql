-- SMU+ RUN_ME_25 (Oct. 26, 2026): any signed-in account can post on every board; signed-out visitors can only read.
-- Jackson: "No one should be able to post anything without getting a free account first."
-- (Named 25 because RUN_ME_24 is already game threads.)
-- Policy and grant changes only. No rows are deleted or changed.
--
-- 1. threads/posts INSERT: drop the paid-membership check on The Paddock and Film Room Lounge. Keep ownership checks.
-- 2. threads/posts/post_likes/post_reports writes: limited to the authenticated role (anon never matches).
-- 3. Belt and braces: revoke INSERT/UPDATE/DELETE table grants from anon on every table except the three
--    signed-out forms (waitlist, newsletter_signups and page_views keep INSERT only). RLS already blocked these; this
--    makes anon writes fail at the grant level too. Security-definer RPCs (game_thread, bump_thread_view) are unaffected.
--
-- UNDO (restores the old member-only rule and grants):
--   drop policy "start own thread" on public.threads;
--   create policy "start own thread" on public.threads for insert with check ((auth.uid() = author_id) and (author_handle is null)
--     and (pinned = false) and (hot = false) and (reply_count = 0) and (view_count = 0)
--     and ((not (select forums.premium from public.forums where forums.id = threads.forum_id)) or public.is_member(auth.uid())));
--   drop policy "write own post" on public.posts;
--   create policy "write own post" on public.posts for insert with check ((auth.uid() = author_id) and (author_handle is null)
--     and ((not public.forum_is_premium(thread_id)) or public.is_member(auth.uid())));
--   alter policy "edit own thread" on public.threads to public;  alter policy "delete own thread" on public.threads to public;
--   alter policy "edit own post" on public.posts to public;      alter policy "delete own post" on public.posts to public;
--   grant insert, delete on public.threads, public.posts, public.profiles, public.memberships to anon;
--   grant insert, update, delete on public.game_catalog, public.forums, public.personas, public.content_items,
--     public.watch_progress, public.saved_athletes to anon;
--   grant update, delete on public.newsletter_signups to anon;

begin;

drop policy if exists "start own thread" on public.threads;
create policy "start own thread" on public.threads for insert to authenticated
  with check (auth.uid() is not null and auth.uid() = author_id and author_handle is null
    and pinned = false and hot = false and reply_count = 0 and view_count = 0);

drop policy if exists "write own post" on public.posts;
create policy "write own post" on public.posts for insert to authenticated
  with check (auth.uid() is not null and auth.uid() = author_id and author_handle is null);

alter policy "edit own thread"   on public.threads to authenticated;
alter policy "delete own thread" on public.threads to authenticated;
alter policy "edit own post"     on public.posts   to authenticated;
alter policy "delete own post"   on public.posts   to authenticated;

revoke insert, update, delete on public.threads, public.posts, public.post_likes, public.post_reports,
  public.profiles, public.memberships, public.saved_athletes, public.watch_progress, public.forums,
  public.personas, public.content_items, public.game_catalog, public.student_verifications,
  public.live_games, public.game_plays, public.cfbd_sync_state from anon;
revoke update, delete on public.newsletter_signups, public.waitlist, public.page_views from anon;

commit;
