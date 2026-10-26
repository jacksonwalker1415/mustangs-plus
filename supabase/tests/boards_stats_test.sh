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
for f in schema.sql seed.sql RUN_ME_7_boards_stats.sql RUN_ME_7_boards_stats.sql; do $PSQL -d $DB -f $f >/dev/null || { echo "FAIL loading $f"; exit 1; }; done
chk "loads and re-runs" ok ok
chk "one row per board"              "$(q "select count(*) from forums")" "$(anon "select count(distinct forum_id) from forum_stats")"
chk "thread totals match the seed"   "$(q "select count(*) from threads")" "$(anon "select sum(threads) from forum_stats")"
chk "post totals match the seed"     "$(q "select count(*) from posts")"   "$(anon "select sum(posts) from forum_stats")"
chk "per-board threads are real"     "$(q "select count(*) from threads where forum_id='hilltop'")" "$(anon "select sum(threads) from forum_stats where forum_id='hilltop'")"
chk "premium board totals visible to anon" "$(q "select count(*) from posts p join threads t on t.id=p.thread_id where t.forum_id='paddock'")" "$(anon "select sum(posts) from forum_stats where forum_id='paddock'")"
chk "premium post bodies still hidden" "0" "$(anon "select count(*) from posts p join threads t on t.id=p.thread_id where t.forum_id='paddock'")"
chk "sport totals match the seed"    "$(q "select count(*) from threads where sport is not null")" "$(anon "select sum(threads) from sport_stats")"
chk "football threads are real"      "$(q "select count(*) from threads where sport='football'")" "$(anon "select sum(threads) from sport_stats where sport='football'")"
U=eeeeeeee-0000-0000-0000-000000000005
q "insert into auth.users(id,email) values ('$U','new@example.com')" >/dev/null
before=$(anon "select sum(threads)||'/'||sum(posts) from forum_stats where forum_id='boulevard' and not rec")
q "insert into threads(id,forum_id,sport,title,author_id) values (9001,'boulevard','golf','A brand new thread','$U'); insert into posts(thread_id,author_id,body) values (9001,'$U','First'),(9001,'$U','Second')" >/dev/null
after=$(anon "select sum(threads)||'/'||sum(posts) from forum_stats where forum_id='boulevard' and not rec")
chk "new thread: +1 thread, +2 posts" "$(( ${before%/*}+1 ))/$(( ${before#*/}+2 ))" "$after"
chk "anon can't write the view"      "1" "$(anon "insert into forum_stats values ('x',false,1,1,now())" | grep -cE 'permission denied|cannot insert')"
chk "recruiting board rows are all rec" "$(q "select count(*) from threads where forum_id='recruiting'")" "$(anon "select coalesce(sum(threads),0) from forum_stats where forum_id='recruiting' and rec")"
chk "no rec=false rows with threads in recruiting board" "0" "$(anon "select coalesce(sum(threads),0) from forum_stats where forum_id='recruiting' and not rec")"
rb=$(anon "select coalesce(sum(threads),0) from forum_stats where forum_id='hilltop' and rec")
q "insert into threads(id,forum_id,sport,title,author_id) values (9002,'hilltop','football','Portal watch: who is next','$U')" >/dev/null
chk "recruiting-titled thread in a free board counts as rec" "$((rb+1))" "$(anon "select coalesce(sum(threads),0) from forum_stats where forum_id='hilltop' and rec")"
chk "sport totals without rec match filtered threads" "$(q "select count(*) from threads where sport is not null and forum_id<>'recruiting' and title !~* '(recruit|portal|visit weekend|visit list|offer tracker|commitment|2028 (board|class))'")" "$(anon "select sum(threads) from sport_stats where not rec")"
chk "anon sees totals only (columns)" "forum_id,rec,threads,posts,last_post_at" "$(q "select string_agg(column_name,',' order by ordinal_position) from information_schema.columns where table_name='forum_stats'")"
echo; echo "$pass passed, $fail failed"; [ $fail -eq 0 ]
