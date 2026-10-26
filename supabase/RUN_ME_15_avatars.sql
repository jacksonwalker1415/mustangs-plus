-- SMU+ RUN_ME_15: member profile photos (avatars).
-- Run after schema.sql in the Supabase SQL Editor of project mustangs-plus (lpoguzstqpwzcmjxeaik) only.
-- Additive and safe to re-run: ADD COLUMN IF NOT EXISTS, bucket upsert, drop-and-recreate of this file's own
-- policies and constraint only. No DROP TABLE, no DELETE, no user data touched.
--
-- What it does
--   1. profiles.avatar_url (text, nullable). Null = the site shows initials.
--   2. The URL must point at the member's own folder in the public 'avatars' bucket of this project
--      (no outside image links, so nobody can use the boards as a tracking pixel or hotlink host).
--   3. Signed-in members may update only display_name and avatar_url on their own profile row.
--   4. Storage bucket 'avatars': public read, 2 MB per file, JPEG/PNG/WebP only (enforced by Supabase Storage).
--      The site resizes to 256x256 before upload, so real files are about 10-40 KB.
--   5. storage.objects policies: anyone can read avatars; a signed-in member can insert, update and delete only
--      objects under avatars/<their user id>/... . RLS on storage.objects is on by default in every Supabase project.
-- After it runs, set MP.FEATURES.avatars = true in assets/data.js (until then the live site hides the upload UI).

-- 1. Column
alter table public.profiles add column if not exists avatar_url text;

-- 2. Only our own bucket, only the member's own folder, bounded length
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'profiles_avatar_url_own_folder' and conrelid = 'public.profiles'::regclass) then
    alter table public.profiles add constraint profiles_avatar_url_own_folder check (
      avatar_url is null or (
        char_length(avatar_url) <= 300
        and avatar_url like 'https://lpoguzstqpwzcmjxeaik.supabase.co/storage/v1/object/public/avatars/' || id::text || '/%'
        and avatar_url !~ '[\s"''<>]'
      ));
  end if;
end $$;

-- 3. Column-level update rights (schema.sql granted display_name only; RLS "edit own profile" still pins id = auth.uid())
grant update (display_name, avatar_url) on public.profiles to authenticated;

-- 4. Bucket (insert, or bring an existing 'avatars' bucket to these settings)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 2097152, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = true,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- 5. Storage policies (only the four named here are replaced)
drop policy if exists "avatars: anyone can read"    on storage.objects;
drop policy if exists "avatars: upload to own folder" on storage.objects;
drop policy if exists "avatars: replace in own folder" on storage.objects;
drop policy if exists "avatars: delete from own folder" on storage.objects;

create policy "avatars: anyone can read" on storage.objects
  for select using (bucket_id = 'avatars');
create policy "avatars: upload to own folder" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "avatars: replace in own folder" on storage.objects
  for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "avatars: delete from own folder" on storage.objects
  for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

-- Check (read-only): RLS should already be on for storage.objects
do $$ begin
  if not (select relrowsecurity from pg_class where oid = 'storage.objects'::regclass) then
    raise warning 'RLS is OFF on storage.objects. Turn it on in the dashboard before enabling avatars on the site.';
  end if;
end $$;
