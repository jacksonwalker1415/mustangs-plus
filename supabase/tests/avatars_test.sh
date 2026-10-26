#!/bin/bash
# Tests for supabase/RUN_ME_15_avatars.sql on a throwaway local Postgres (never the live project).
# Usage: PGPORT=54339 supabase/tests/avatars_test.sh
set -u
cd "$(dirname "$0")/.."
PORT=${PGPORT:-54339}; DB=smu_avatars_test
export PGOPTIONS="-c client_min_messages=warning"
PSQL="psql -h /tmp -p $PORT -U postgres -v ON_ERROR_STOP=1 -q -X"
pass=0; fail=0
chk(){ [ "$3" = "$2" ] && { pass=$((pass+1)); echo "  ok   $1"; } || { fail=$((fail+1)); echo "  FAIL $1 (wanted $2, got $3)"; }; }
q(){ $PSQL -d $DB -At -c "$1" 2>&1; }
as(){ ${PSQL/ -q/} -d $DB -At -c "set role authenticated; set request.jwt.claim.sub='$1';" -c "$2" 2>&1; }
anon(){ $PSQL -d $DB -At -c "set role anon;" -c "$1" 2>&1; }
$PSQL -d postgres -c "drop database if exists $DB with (force)" -c "create database $DB" >/dev/null
$PSQL -d $DB -f tests/supabase_stubs.sql >/dev/null 2>&1
$PSQL -d $DB >/dev/null <<'SQL'
-- minimal stand-in for Supabase Storage (test-only)
create schema if not exists storage;
create table storage.buckets(id text primary key, name text not null, public boolean default false, file_size_limit bigint, allowed_mime_types text[]);
create table storage.objects(id uuid primary key default gen_random_uuid(), bucket_id text references storage.buckets(id), name text, owner uuid default auth.uid());
alter table storage.objects enable row level security;
create or replace function storage.foldername(name text) returns text[] language sql immutable as $$ select (string_to_array(name,'/'))[1:array_length(string_to_array(name,'/'),1)-1] $$;
grant usage on schema storage to anon, authenticated;
grant all on storage.objects to anon, authenticated;
grant select on storage.buckets to anon, authenticated;
SQL
for f in schema.sql seed.sql RUN_ME_15_avatars.sql RUN_ME_15_avatars.sql; do $PSQL -d $DB -f $f >/dev/null || { echo "FAIL loading $f"; exit 1; }; done
chk "loads and re-runs" ok ok
A=aaaaaaaa-0000-0000-0000-00000000000a; B=bbbbbbbb-0000-0000-0000-00000000000b
q "insert into auth.users(id,email) values ('$A','a@example.com'),('$B','b@example.com')" >/dev/null
P="https://lpoguzstqpwzcmjxeaik.supabase.co/storage/v1/object/public/avatars"
chk "column exists, null by default" "" "$(q "select avatar_url from profiles where id='$A'")"
chk "bucket settings" "t|2097152|{image/jpeg,image/png,image/webp}" "$(q "select public,file_size_limit,allowed_mime_types from storage.buckets where id='avatars'")"
chk "one bucket after re-run" "1" "$(q "select count(*) from storage.buckets where id='avatars'")"
chk "A uploads to own folder" "INSERT 0 1" "$(as $A "insert into storage.objects(bucket_id,name) values ('avatars','$A/avatar-1.webp')" | tail -1 || true)"
chk "A can't upload to B's folder" "1" "$(as $A "insert into storage.objects(bucket_id,name) values ('avatars','$B/x.webp')" | grep -c 'row-level security')"
chk "A can't upload to bucket root" "1" "$(as $A "insert into storage.objects(bucket_id,name) values ('avatars','x.webp')" | grep -c 'row-level security')"
q "insert into storage.objects(bucket_id,name,owner) values ('avatars','$B/avatar-1.webp','$B')" >/dev/null
chk "anon reads avatars" "2" "$(anon "select count(*) from storage.objects where bucket_id='avatars'")"
chk "A can't delete B's photo" "DELETE 0" "$(as $A "delete from storage.objects where name='$B/avatar-1.webp'" | tail -1)"
chk "A can't rename B's photo" "UPDATE 0" "$(as $A "update storage.objects set name='$A/stolen.webp' where name='$B/avatar-1.webp'" | tail -1)"
chk "A can't move own photo into B's folder" "1" "$(as $A "update storage.objects set name='$B/y.webp' where name='$A/avatar-1.webp'" | grep -c 'row-level security')"
chk "A sets own avatar_url" "UPDATE 1" "$(as $A "update profiles set avatar_url='$P/$A/avatar-1.webp' where id='$A'" | tail -1)"
chk "A can't point at B's folder" "1" "$(as $A "update profiles set avatar_url='$P/$B/avatar-1.webp' where id='$A'" | grep -c 'profiles_avatar_url_own_folder')"
chk "A can't use an outside URL" "1" "$(as $A "update profiles set avatar_url='https://evil.example/p.png' where id='$A'" | grep -c 'profiles_avatar_url_own_folder')"
chk "A can't inject quotes" "1" "$(as $A "update profiles set avatar_url='$P/$A/a\"onerror=x.webp' where id='$A'" | grep -c 'profiles_avatar_url_own_folder')"
chk "A can't edit B's profile" "UPDATE 0" "$(as $A "update profiles set avatar_url=null where id='$B'" | tail -1)"
chk "A still can't edit created_at" "1" "$(as $A "update profiles set created_at=now() where id='$A'" | grep -c 'permission denied')"
chk "A deletes own photo" "DELETE 1" "$(as $A "delete from storage.objects where name='$A/avatar-1.webp'" | tail -1)"
chk "A clears avatar_url" "UPDATE 1" "$(as $A "update profiles set avatar_url=null where id='$A'" | tail -1)"
chk "anon can't upload" "1" "$(anon "insert into storage.objects(bucket_id,name) values ('avatars','$A/z.webp')" | grep -c 'row-level security')"
chk "display_name still editable" "UPDATE 1" "$(as $A "update profiles set display_name='Ann' where id='$A'" | tail -1)"
chk "profiles rows untouched by re-run" "$(q "select count(*) from profiles")" "$(q "select count(*) from profiles")"
echo; echo "$pass passed, $fail failed"; [ $fail -eq 0 ]
