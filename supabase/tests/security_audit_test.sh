#!/bin/bash
# Tests for RUN_ME_28_security_audit.sql on a throwaway local Postgres (never the live project).
# Usage: PGHOST=/tmp PGPORT=54329 supabase/tests/security_audit_test.sh
set -u
cd "$(dirname "$0")/.."
HOST=${PGHOST:-/tmp}; PORT=${PGPORT:-54329}; DB=smu_audit28_test
export PGOPTIONS="-c client_min_messages=warning"
PSQL="psql -h $HOST -p $PORT -U postgres -v ON_ERROR_STOP=1 -q -X"
pass=0; fail=0
chk(){ [ "$3" = "$2" ] && { pass=$((pass+1)); echo "  ok   $1"; } || { fail=$((fail+1)); echo "  FAIL $1 (wanted $2, got $3)"; }; }
q(){ $PSQL -d $DB -At -c "$1" 2>&1; }
as(){ $PSQL -d $DB -At -c "set role authenticated; set request.jwt.claim.sub='$1';" -c "$2" 2>&1; }
anon(){ $PSQL -d $DB -At -c "set role anon;" -c "$1" 2>&1; }
$PSQL -d postgres -c "drop database if exists $DB with (force)" -c "create database $DB" >/dev/null
$PSQL -d $DB -f tests/supabase_stubs.sql >/dev/null 2>&1
$PSQL -d $DB -c "create table if not exists public.live_games(game_id bigint primary key); create table if not exists public.game_plays(play_id text primary key); create table if not exists public.cfbd_sync_state(id int primary key); create table if not exists public.page_views(id bigserial primary key)" >/dev/null 2>&1  # RUN_ME_27 needs pg_cron/vault; stub its tables
for f in schema.sql seed.sql waitlist.sql RUN_ME_16_students.sql RUN_ME_7_boards_stats.sql PROPOSED_12_post_reports.sql RUN_ME_20_post_likes.sql RUN_ME_21_open_board_reads.sql RUN_ME_24_game_threads.sql RUN_ME_25_open_posting.sql; do
  $PSQL -d $DB -f $f >/dev/null 2>/tmp/a28.err || { echo "  (note: $f did not load cleanly on the stub db)"; head -2 /tmp/a28.err; }; done
for f in RUN_ME_28_security_audit.sql RUN_ME_28_security_audit.sql; do $PSQL -d $DB -f $f >/dev/null || { echo "FAIL loading $f"; exit 1; }; done
chk "loads and re-runs" ok ok
A=aaaaaaaa-0000-0000-0000-00000000000a
q "insert into auth.users(id,email) values ('$A','a@example.com') on conflict do nothing; insert into profiles(id,display_name) values ('$A','Fan A') on conflict (id) do nothing" >/dev/null
T=$(as $A "insert into threads(forum_id,title,author_id,created_at,last_post_at,game_id) values ('hilltop','Future thread','$A','2099-01-01','2099-01-01','fb-999') returning id" | head -1)
chk "thread created_at is stamped now"      "t" "$(q "select created_at < now() + interval '1 minute' from threads where id=$T")"
chk "thread last_post_at is stamped now"    "t" "$(q "select last_post_at < now() + interval '1 minute' from threads where id=$T")"
chk "users can't claim a game_id"           "" "$(q "select game_id from threads where id=$T")"
as $A "insert into posts(thread_id,author_id,body,created_at) values ($T,'$A','hello','2099-01-01')" >/dev/null
chk "post created_at is stamped now"        "t" "$(q "select bool_and(created_at < now() + interval '1 minute') from posts where thread_id=$T")"
chk "reply can't push last_post_at ahead"   "t" "$(q "select last_post_at < now() + interval '1 minute' from threads where id=$T")"
chk "server inserts keep their own dates"   "2001" "$(q "insert into threads(forum_id,title,author_handle,created_at) values ('hilltop','Seed thread','staff','2001-01-01') returning extract(year from created_at)" | head -1)"
chk "anon still reads every post"           "$(q "select count(*) from posts")" "$(anon "select count(*) from posts")"
chk "anon can't call is_member"             "1" "$(anon "select public.is_member('$A')" | grep -c 'permission denied')"
chk "anon can't truncate"                   "1" "$(anon "truncate public.posts" | grep -c 'permission denied')"
chk "forum_stats runs as invoker"           "t" "$(q "select 'security_invoker=true' = any(reloptions) from pg_class where relname='forum_stats'")"
chk "anon can still read forum_stats"       "0" "$(anon "select count(*) from forum_stats" | grep -c 'denied')"
G=$(q "select id from game_catalog limit 1")
GT=$(anon "select public.game_thread('$G')"); chk "game_thread() still opens the official thread (signed out)" "$G" "$(q "select game_id from threads where id=$GT")"
chk "create_thread() still works for members" "1" "$(as $A "select public.create_thread('hilltop',null,'Normal thread','Body text')" | grep -cE '^[0-9]+$')"
echo "$pass passed, $fail failed"; [ $fail -eq 0 ]
