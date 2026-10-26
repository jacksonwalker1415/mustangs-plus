#!/bin/bash
# Tests for RUN_ME_20_post_likes.sql on a throwaway local Postgres (never the live project).
# Usage: PGHOST=/tmp PGPORT=54329 supabase/tests/post_likes_test.sh
set -u
cd "$(dirname "$0")/.."
HOST=${PGHOST:-/tmp}; PORT=${PGPORT:-54329}; DB=smu_likes_test
export PGOPTIONS="-c client_min_messages=warning"
PSQL="psql -h $HOST -p $PORT -U postgres -v ON_ERROR_STOP=1 -q -X"
pass=0; fail=0
chk(){ [ "$3" = "$2" ] && { pass=$((pass+1)); echo "  ok   $1"; } || { fail=$((fail+1)); echo "  FAIL $1 (wanted $2, got $3)"; }; }
q(){ $PSQL -d $DB -At -c "$1" 2>&1; }
as(){ $PSQL -d $DB -At -c "set role authenticated; set request.jwt.claim.sub='$1';" -c "$2" 2>&1; }
anon(){ $PSQL -d $DB -At -c "set role anon;" -c "$1" 2>&1; }
denied(){ echo "$1" | grep -cE 'permission denied|violates row-level security'; }
$PSQL -d postgres -c "drop database if exists $DB with (force)" -c "create database $DB" >/dev/null
$PSQL -d $DB -f tests/supabase_stubs.sql >/dev/null 2>&1
for f in schema.sql seed.sql RUN_ME_20_post_likes.sql RUN_ME_20_post_likes.sql; do $PSQL -d $DB -f $f >/dev/null || { echo "FAIL loading $f"; exit 1; }; done
chk "loads and re-runs" ok ok
A=aaaaaaaa-0000-0000-0000-00000000000a; B=bbbbbbbb-0000-0000-0000-00000000000b
q "insert into auth.users(id,email) values ('$A','a@example.com'),('$B','b@example.com') on conflict do nothing; insert into profiles(id,display_name) values ('$A','Fan A'),('$B','Fan B') on conflict (id) do update set display_name=excluded.display_name" >/dev/null
P=$(q "select min(p.id) from posts p join threads t on t.id=p.thread_id join forums f on f.id=t.forum_id where not f.premium")
PP=$(q "select min(p.id) from posts p join threads t on t.id=p.thread_id join forums f on f.id=t.forum_id where f.premium")
chk "member can like a free-board post"       "" "$(as $A "insert into post_likes(post_id) values ($P)")"
chk "like is recorded as the caller"          "$A" "$(q "select user_id from post_likes where post_id=$P")"
chk "one like per member per post"            "1" "$(as $A "insert into post_likes(post_id) values ($P)" | grep -c post_likes_pkey)"
chk "can't like as someone else"              "1" "$(denied "$(as $A "insert into post_likes(post_id,user_id) values ($P,'$B')")")"
chk "second member can like it too"           "" "$(as $B "insert into post_likes(post_id) values ($P)")"
chk "signed-out visitors see the likes"       "2" "$(anon "select count(*) from post_likes where post_id=$P")"
chk "liked-by names come through profiles"    "Fan A,Fan B" "$(anon "select string_agg(pr.display_name,',' order by pr.display_name) from post_likes l join profiles pr on pr.id=l.user_id where l.post_id=$P")"
chk "signed-out visitors can't like"          "1" "$(denied "$(anon "insert into post_likes(post_id) values ($P)")")"
chk "non-member can't like a members-only post" "1" "$(denied "$(as $A "insert into post_likes(post_id) values ($PP)")")"
q "insert into post_likes(post_id,user_id) values ($PP,'$B')" >/dev/null
chk "members-only likes hidden from non-members" "0" "$(anon "select count(*) from post_likes where post_id=$PP")"
chk "can't remove someone else's like"        "2" "$(as $A "delete from post_likes where post_id=$P and user_id='$B'" >/dev/null; q "select count(*) from post_likes where post_id=$P")"
chk "can remove your own like"                "1" "$(as $A "delete from post_likes where post_id=$P and user_id='$A'" >/dev/null; q "select count(*) from post_likes where post_id=$P")"
chk "can't edit likes"                        "1" "$(denied "$(as $B "update post_likes set created_at=now()")")"
chk "deleting a post removes its likes"       "0" "$(q "delete from posts where id=$P; select count(*) from post_likes where post_id=$P" | tail -1)"
echo; echo "$pass passed, $fail failed"; [ $fail -eq 0 ]
