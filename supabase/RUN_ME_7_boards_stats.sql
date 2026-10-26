-- SMU+ RUN_ME_7: real board totals for The Mustang Board (forum_stats and sport_stats views).
-- Run after schema.sql and seed.sql in the Supabase SQL Editor. Safe to re-run: create or replace only, no DROP or DELETE.
--
-- Totals only: no titles, bodies or authors leave the database. The views run with the view owner's rights on
-- purpose, so a signed-out visitor sees the same board totals as a member (premium post bodies stay protected by RLS).
-- Posts count real rows in public.posts (each thread's opening post included), not the sample reply_count numbers.
--
-- "rec" marks recruiting rows: anything in the recruiting board, or a thread whose title matches the site's
-- recruiting filter (keep this pattern in step with REC_RE in assets/app.js). While MP.FEATURES.recruiting is false,
-- the site leaves rec rows out of every total.

create or replace view public.forum_stats as
  select f.id as forum_id,
         coalesce(f.id = 'recruiting' or t.title ~* '(recruit|portal|visit weekend|visit list|offer tracker|commitment|2028 (board|class))', false) as rec,
         count(distinct t.id)::int as threads,
         count(p.id)::int          as posts,
         max(t.last_post_at)       as last_post_at
    from public.forums f
    left join public.threads t on t.forum_id = f.id
    left join public.posts   p on p.thread_id = t.id
   group by 1, 2;

create or replace view public.sport_stats as
  select t.sport,
         (t.forum_id = 'recruiting' or t.title ~* '(recruit|portal|visit weekend|visit list|offer tracker|commitment|2028 (board|class))') as rec,
         count(distinct t.id)::int as threads,
         count(p.id)::int          as posts,
         max(t.last_post_at)       as last_post_at
    from public.threads t
    left join public.posts p on p.thread_id = t.id
   where t.sport is not null
   group by 1, 2;

revoke all on public.forum_stats, public.sport_stats from anon, authenticated;
grant select on public.forum_stats, public.sport_stats to anon, authenticated;
