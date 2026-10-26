-- SMU+ board counts: real thread and post totals per board and per sport, for The Mustang Board index.
-- Run after schema.sql (and seed.sql) in the Supabase SQL Editor. Safe to re-run.
--
-- These views count every row, including posts in members-only boards, but they expose only totals:
-- no titles, bodies or authors. They run with the view owner's rights on purpose, so a signed-out
-- visitor sees the same board totals as a member. Posts count actual rows in public.posts (every post,
-- including each thread's opening post), not the sample reply_count numbers on seeded threads.

create or replace view public.forum_stats as
  select f.id as forum_id,
         count(distinct t.id)::int as threads,
         count(p.id)::int          as posts,
         max(t.last_post_at)       as last_post_at
    from public.forums f
    left join public.threads t on t.forum_id = f.id
    left join public.posts   p on p.thread_id = t.id
   group by f.id;

create or replace view public.sport_stats as
  select t.sport,
         count(distinct t.id)::int as threads,
         count(p.id)::int          as posts,
         max(t.last_post_at)       as last_post_at
    from public.threads t
    left join public.posts p on p.thread_id = t.id
   where t.sport is not null
   group by t.sport;

revoke all on public.forum_stats, public.sport_stats from anon, authenticated;
grant select on public.forum_stats, public.sport_stats to anon, authenticated;
