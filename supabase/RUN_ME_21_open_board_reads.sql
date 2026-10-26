-- SMU+ RUN_ME_21 (applied Oct. 26, 2026, under the no-paywall decision): let everyone read posts on The Paddock, Film Room Lounge and Recruiting Trail.
-- Why: the site no longer gates anything (MP.FEATURES.gating=false, paid plans are "coming soon"), but the existing
-- "read posts" policy still hides posts on premium boards from anyone without a paid membership, and nobody can get one.
-- Live visitors therefore see those threads listed with no posts inside. This adds one permissive SELECT policy
-- (policies are OR'd), so it opens reads without dropping or changing anything. Writes are unaffected.
-- Approved as part of the no-paywall decision (makes "premium" boards public). To undo later:
--   drop policy "read posts on every board" on public.posts;
do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='posts' and policyname='read posts on every board') then
    create policy "read posts on every board" on public.posts for select to anon, authenticated using (true);
  end if;
end $$;
