-- PROPOSAL (not applied): photos on board posts (Boards media). For Grok Bot to review and apply in Supabase project mustangs-plus.
-- Safe to re-run. Adds a storage bucket, its storage.objects policies, one nullable column on public.posts with a check,
-- and one function. No existing row is changed or deleted (every existing post has media = null, which passes the check).
-- After applying: set MEDIA=true in assets/sb.js (or MP.FEATURES.media=true in data.js). Until then the site never asks
-- for the bucket or the column, and the photo button is hidden on the live site.
--
-- Shape of posts.media: null, or a JSON array of 1 to 4 objects {"u": public URL, "w": width px, "h": height px, "t": mime type}.
-- Every URL must be a public URL in the board-media bucket, inside the post author's own folder (<auth uid>/<file>), so a post
-- can't point at an outside image (tracking pixels, hotlinks) or at someone else's upload.

begin;

-- 1. Bucket: public read, 5 MB per file, images only. The browser already resizes and re-encodes (strips EXIF/location) before upload.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('board-media', 'board-media', true, 5242880, array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- 2. storage.objects policies: anyone can read board-media; signed-in members write only inside their own <uid>/ folder.
drop policy if exists "board media: public read"       on storage.objects;
drop policy if exists "board media: upload own folder" on storage.objects;
drop policy if exists "board media: update own folder" on storage.objects;
drop policy if exists "board media: delete own folder" on storage.objects;
create policy "board media: public read" on storage.objects for select to anon, authenticated
  using (bucket_id = 'board-media');
create policy "board media: upload own folder" on storage.objects for insert to authenticated
  with check (bucket_id = 'board-media' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "board media: update own folder" on storage.objects for update to authenticated
  using (bucket_id = 'board-media' and auth.uid()::text = (storage.foldername(name))[1])
  with check (bucket_id = 'board-media' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "board media: delete own folder" on storage.objects for delete to authenticated
  using (bucket_id = 'board-media' and auth.uid()::text = (storage.foldername(name))[1]);

-- 3. posts.media (nullable, no default, so existing posts are untouched)
alter table public.posts add column if not exists media jsonb;

create or replace function public.post_media_ok(p_media jsonb, p_author uuid)
returns boolean language sql immutable set search_path = public
as $$
  select p_media is null or (
    p_author is not null
    and jsonb_typeof(p_media) = 'array'
    and jsonb_array_length(p_media) between 1 and 4
    and not exists (
      select 1 from jsonb_array_elements(p_media) e
      where jsonb_typeof(e) <> 'object'
         or coalesce(e->>'u', '') !~ ('^https://lpoguzstqpwzcmjxeaik\.supabase\.co/storage/v1/object/public/board-media/'
                                      || p_author::text || '/[A-Za-z0-9._-]{1,100}$')
         or jsonb_typeof(e->'w') is distinct from 'number' or jsonb_typeof(e->'h') is distinct from 'number'
         or (e->>'w')::numeric not between 1 and 10000 or (e->>'h')::numeric not between 1 and 10000
         or coalesce(e->>'t', 'image/jpeg') not in ('image/jpeg','image/png','image/webp','image/gif')))
$$;

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'posts_media_ok' and conrelid = 'public.posts'::regclass) then
    alter table public.posts add constraint posts_media_ok check (public.post_media_ok(media, author_id));
  end if;
end $$;

-- 4. Photos on the first post of a new thread. create_thread() takes no media, so right after it returns the client calls this
--    for the new thread's first post: only the author, only while that post has no media, only within 15 minutes of posting.
--    Replies send media directly in the posts insert (the existing "write own post" policy and the check above apply).
create or replace function public.set_post_media(p_post bigint, p_media jsonb)
returns boolean language plpgsql security definer set search_path = public
as $$
declare n int;
begin
  if auth.uid() is null then raise exception 'not signed in' using errcode = '42501'; end if;
  update public.posts set media = p_media
   where id = p_post and author_id = auth.uid() and media is null and created_at > now() - interval '15 minutes';
  get diagnostics n = row_count;
  return n = 1;
end $$;
revoke all on function public.set_post_media(bigint, jsonb) from public, anon;
grant execute on function public.set_post_media(bigint, jsonb) to authenticated;

commit;

-- Rollback (only if asked; check first that no post has media, or those photos stop showing):
--   alter table public.posts drop constraint if exists posts_media_ok;
--   drop function if exists public.set_post_media(bigint, jsonb);
--   drop function if exists public.post_media_ok(jsonb, uuid);
--   drop the four "board media: ..." policies on storage.objects;
--   alter table public.posts drop column if exists media;           -- removes photo links only, after the check above
--   the bucket can be removed in the dashboard once it is empty.
-- Not covered here (needs Jackson/Counsel): moderation of uploaded photos, and cleanup of files whose post was never created
-- or was deleted (a periodic job that removes board-media objects not referenced by any posts.media).
