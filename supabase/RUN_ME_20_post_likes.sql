-- SMU+ RUN_ME_20: likes on board posts ("Liked by ..." under each post). Additive and idempotent: one new table,
-- its policies and grants. No DROP, no DELETE, no change to any existing table or policy. Safe to re-run.
--
-- Who can do what:
--   * Anyone can see who liked a post, but only for posts they can already read: the select policy checks the post
--     through public.posts, so the existing "read posts" policy (members-only boards) still applies.
--   * Signed-in members can like a post as themselves only, once per post, and only a post they can read.
--   * Members can remove their own like. Nobody can edit or remove someone else's.
-- The site reads and writes this table when LIKES is true in assets/sb.js. If the table is missing, likes stay in the browser.

create table if not exists public.post_likes (
  post_id    bigint      not null references public.posts(id) on delete cascade,
  user_id    uuid        not null default auth.uid() references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);
create index if not exists post_likes_user_idx on public.post_likes (user_id);

alter table public.post_likes enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='post_likes' and policyname='see likes on readable posts') then
    create policy "see likes on readable posts" on public.post_likes for select to anon, authenticated
      using (exists (select 1 from public.posts p where p.id = post_likes.post_id));
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='post_likes' and policyname='like as yourself') then
    create policy "like as yourself" on public.post_likes for insert to authenticated
      with check (user_id = auth.uid() and exists (select 1 from public.posts p where p.id = post_likes.post_id));
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='post_likes' and policyname='remove your own like') then
    create policy "remove your own like" on public.post_likes for delete to authenticated
      using (user_id = auth.uid());
  end if;
end $$;

-- Supabase grants everything on new tables by default. Take it back, then allow only what the site uses.
revoke all on public.post_likes from anon, authenticated;
grant select on public.post_likes to anon, authenticated;
grant insert (post_id) on public.post_likes to authenticated;
grant delete on public.post_likes to authenticated;
