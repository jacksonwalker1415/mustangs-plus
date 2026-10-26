#!/bin/bash
# Tests for PROPOSED_8_board_counts.sql and PROPOSED_9_more_board_threads.sql on a throwaway local Postgres (never the live project).
# Usage: PGPORT=54339 supabase/tests/board_counts_test.sh
set -u
cd "$(dirname "$0")/.."
PORT=${PGPORT:-54339}; DB=smu_counts_test
export PGOPTIONS="-c client_min_messages=warning"
PSQL="psql -h /tmp -p $PORT -U postgres -v ON_ERROR_STOP=1 -q -X"
pass=0; fail=0
chk(){ [ "$3" = "$2" ] && { pass=$((pass+1)); echo "  ok   $1"; } || { fail=$((fail+1)); echo "  FAIL $1 (wanted $2, got $3)"; }; }
q(){ $PSQL -d $DB -At -c "$1" 2>&1; }
anon(){ $PSQL -d $DB -At -c "set role anon;" -c "$1" 2>&1; }
$PSQL -d postgres -c "drop database if exists $DB with (force)" -c "create database $DB" >/dev/null
$PSQL -d $DB -f tests/supabase_stubs.sql >/dev/null 2>&1
for f in schema.sql seed.sql RUN_ME_7_boards_stats.sql PROPOSED_8_board_counts.sql PROPOSED_8_board_counts.sql; do $PSQL -d $DB -f $f >/dev/null || { echo "FAIL loading $f"; exit 1; }; done
chk "loads and re-runs" ok ok
chk "one row per thread"            "$(q "select count(*) from threads")" "$(anon "select count(*) from thread_stats")"
chk "posts match real rows"         "$(q "select count(*) from posts")"   "$(anon "select sum(posts) from thread_stats")"
chk "premium thread totals visible" "$(q "select count(*) from posts where thread_id=1")" "$(anon "select posts from thread_stats where thread_id=1")"
chk "premium bodies still hidden"   "0" "$(anon "select count(*) from posts where thread_id=1")"
chk "columns are totals only"       "thread_id,posts" "$(q "select string_agg(column_name,',' order by ordinal_position) from information_schema.columns where table_name='thread_stats'")"
chk "anon can't write the view"     "1" "$(anon "insert into thread_stats values (1,1)" | grep -cE 'permission denied|cannot insert')"
chk "seeded reply_count now real"   "0" "$(q "select count(*) from threads t where author_handle is not null and reply_count <> greatest(0,(select count(*) from posts p where p.thread_id=t.id)-1)")"
chk "no sample view counts left"    "0" "$(q "select count(*) from threads where author_handle is not null and view_count<>0")"
U=eeeeeeee-0000-0000-0000-000000000006
q "insert into auth.users(id,email) values ('$U','c@example.com'); insert into threads(id,forum_id,title,author_id) values (9101,'boulevard','User thread','$U'); insert into posts(thread_id,author_id,body) values (9101,'$U','a'); insert into posts(thread_id,author_id,body) values (9101,'$U','b'); insert into posts(thread_id,author_id,body) values (9101,'$U','c')" >/dev/null
chk "new user thread: trigger keeps reply_count real" "2" "$(q "select reply_count from threads where id=9101")"
chk "new user thread in thread_stats" "3" "$(anon "select posts from thread_stats where thread_id=9101")"
before_t=$(q "select count(*) from threads"); before_p=$(q "select count(*) from posts")
for i in 1 2; do $PSQL -d $DB -f PROPOSED_9_more_board_threads.sql >/dev/null || { echo "FAIL loading PROPOSED_9"; exit 1; }; done
chk "PROPOSED_9 adds 24 threads (re-run safe)" "$((before_t+24))" "$(q "select count(*) from threads")"
chk "PROPOSED_9 adds 72 posts (re-run safe)"   "$((before_p+72))" "$(q "select count(*) from posts")"
chk "PROPOSED_9 reply counts real" "0" "$(q "select count(*) from threads t where id between 23 and 46 and reply_count <> (select count(*) from posts p where p.thread_id=t.id)-1")"
chk "PROPOSED_9 views stay 0" "0" "$(q "select count(*) from threads where id between 23 and 46 and view_count<>0")"
chk "every sport now has 2+ threads" "0" "$(q "select count(*) from (select sport from threads where sport is not null and forum_id<>'recruiting' group by 1 having count(*)<2) x")"
chk "new user posts still insert after PROPOSED_9" "ok" "$(q "insert into posts(thread_id,author_id,body) values (9101,'$U','d')" && echo ok)"
echo; echo "$pass passed, $fail failed"; [ $fail -eq 0 ]
