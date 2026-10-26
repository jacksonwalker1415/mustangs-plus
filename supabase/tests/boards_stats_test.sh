#!/bin/bash
# Tests for supabase/boards_stats.sql on a throwaway local Postgres (never the live project).
# Usage: PGPORT=54339 supabase/tests/boards_stats_test.sh
set -u
cd "$(dirname "$0")/.."
PORT=${PGPORT:-54339}; DB=smu_boards_test
export PGOPTIONS="-c client_min_messages=warning"
PSQL="psql -h /tmp -p $PORT -U postgres -v ON_ERROR_STOP=1 -q -X"
pass=0; fail=0
chk(){ [ "$3" = "$2" ] && { pass=$((pass+1)); echo "  ok   $1"; } || { fail=$((fail+1)); echo "  FAIL $1 (wanted $2, got $3)"; }; }
q(){ $PSQL -d $DB -At -c "$1" 2>&1; }
anon(){ $PSQL -d $DB -At -c "set role anon;" -c "$1" 2>&1; }
$PSQL -d postgres -c "drop database if exists $DB with (force)" -c "create database $DB" >/dev/null
$PSQL -d $DB -f tests/supabase_stubs.sql >/dev/null 2>&1
for f in schema.sql seed.sql boards_stats.sql boards_stats.sql; do $PSQL -d $DB -f $f >/dev/null || { echo "FAIL loading $f"; exit 1; }; done
chk "loads and re-runs" ok ok
chk "one row per board"              "$(q "select count(*) from forums")" "$(anon "select count(*) from forum_stats")"
chk "thread totals match the seed"   "$(q "select count(*) from threads")" "$(anon "select sum(threads) from forum_stats")"
chk "post totals match the seed"     "$(q "select count(*) from posts")"   "$(anon "select sum(posts) from forum_stats")"
chk "per-board threads are real"     "$(q "select count(*) from threads where forum_id='hilltop'")" "$(anon "select threads from forum_stats where forum_id='hilltop'")"
chk "premium board totals visible to anon" "$(q "select count(*) from posts p join threads t on t.id=p.thread_id where t.forum_id='paddock'")" "$(anon "select posts from forum_stats where forum_id='paddock'")"
chk "premium post bodies still hidden" "0" "$(anon "select count(*) from posts p join threads t on t.id=p.thread_id where t.forum_id='paddock'")"
chk "sport totals match the seed"    "$(q "select count(*) from threads where sport is not null")" "$(anon "select sum(threads) from sport_stats")"
chk "football threads are real"      "$(q "select count(*) from threads where sport='football'")" "$(anon "select threads from sport_stats where sport='football'")"
U=eeeeeeee-0000-0000-0000-000000000005
q "insert into auth.users(id,email) values ('$U','new@example.com')" >/dev/null
before=$(anon "select threads||'/'||posts from forum_stats where forum_id='boulevard'")
q "insert into threads(id,forum_id,sport,title,author_id) values (9001,'boulevard','golf','A brand new thread','$U'); insert into posts(thread_id,author_id,body) values (9001,'$U','First'),(9001,'$U','Second')" >/dev/null
after=$(anon "select threads||'/'||posts from forum_stats where forum_id='boulevard'")
chk "new thread: +1 thread, +2 posts" "$(( ${before%/*}+1 ))/$(( ${before#*/}+2 ))" "$after"
chk "anon can't write the view"      "1" "$(anon "insert into forum_stats values ('x',1,1,now())" | grep -cE 'permission denied|cannot insert')"
echo; echo "$pass passed, $fail failed"; [ $fail -eq 0 ]
