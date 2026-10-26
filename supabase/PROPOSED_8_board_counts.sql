-- SMU+ PROPOSED_8 (NOT RUN): real per-thread reply counts for The Mustang Board.
-- For the admin to review and run in the Supabase SQL Editor after schema.sql, seed.sql and RUN_ME_7. Safe to re-run.
--
-- 1. thread_stats: one row per thread with its real post count (opening post included). Totals only, no titles,
--    bodies or authors. Like forum_stats, it runs with the view owner's rights so a signed-out visitor sees how many
--    replies a members-only thread has while the post bodies stay behind RLS. The site reads it in assets/sb.js and,
--    until this runs, simply hides reply counts it can't see.
-- 2. The seeded threads carry sample reply_count / view_count values (e.g. 1,832 replies, 41,000 views) copied from the
--    old demo data. This resets reply_count to the real number of replies and view_count to 0, since no views were ever
--    counted. The site already ignores these columns for seeded threads; this just stops the database disagreeing.
--    New posts keep reply_count real through the existing posts_after_insert trigger.

create or replace view public.thread_stats as
  select t.id as thread_id, count(p.id)::int as posts
    from public.threads t
    left join public.posts p on p.thread_id = t.id
   group by t.id;

revoke all on public.thread_stats from anon, authenticated;
grant select on public.thread_stats to anon, authenticated;

update public.threads t
   set reply_count = greatest(0, (select count(*) from public.posts p where p.thread_id = t.id) - 1),
       view_count  = 0
 where t.author_handle is not null;
