#!/bin/bash
# Tests for PROPOSED_12_post_reports.sql on a throwaway local Postgres (never the live project).
# Usage: PGHOST=/tmp/engage-sock PGPORT=54352 supabase/tests/post_reports_test.sh
set -u
cd "$(dirname "$0")/.."
HOST=${PGHOST:-/tmp/engage-sock}; PORT=${PGPORT:-54352}; DB=smu_reports_test
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
for f in schema.sql seed.sql PROPOSED_12_post_reports.sql PROPOSED_12_post_reports.sql; do $PSQL -d $DB -f $f >/dev/null || { echo "FAIL loading $f"; exit 1; }; done
chk "loads and re-runs" ok ok
A=aaaaaaaa-0000-0000-0000-00000000000a; B=bbbbbbbb-0000-0000-0000-00000000000b
q "insert into auth.users(id,email) values ('$A','a@example.com'),('$B','b@example.com') on conflict do nothing; insert into profiles(id) values ('$A'),('$B') on conflict do nothing" >/dev/null
P=$(q "select min(id) from posts")
chk "signed-in member can report"            "" "$(as $A "insert into post_reports(post_id,reason) values ($P,'spam')")"
chk "reporter is set to the caller"          "$A" "$(q "select reporter_id from post_reports where post_id=$P")"
chk "one report per user per post"           "1" "$(as $A "insert into post_reports(post_id,reason) values ($P,'other')" | grep -c post_reports_one_per_user)"
chk "another member can report the same post" "" "$(as $B "insert into post_reports(post_id,reason,note) values ($P,'harassment','Targets a player''s family')")"
chk "two reports on file"                    "2" "$(q "select count(*) from post_reports where post_id=$P")"
chk "can't file a report as someone else"    "1" "$(denied "$(as $A "insert into post_reports(post_id,reporter_id,reason) values ($P,'$B','spam')")")"
chk "reason must be on the list"             "1" "$(as $A "insert into post_reports(post_id,reason) values ($P+1,'i dont like it')" | grep -c post_reports_reason_check)"
i=1; for r in harassment recruit_minor doxxing other; do as $A "insert into post_reports(post_id,reason) values ($(q "select id from posts order by id offset $i limit 1"),'$r')" >/dev/null; i=$((i+1)); done
chk "all five reasons accepted"              "5" "$(q "select count(distinct reason) from post_reports")"
chk "note capped at 500 characters"          "1" "$(as $A "insert into post_reports(post_id,reason,note) values ((select max(id) from posts),'other',repeat('x',501))" | grep -c post_reports_note_check)"
chk "signed-out visitors can't report"       "1" "$(denied "$(anon "insert into post_reports(post_id,reason) values ($P,'spam')")")"
chk "signed-out visitors can't read reports" "1" "$(denied "$(anon "select count(*) from post_reports")")"
chk "members can't read reports, even their own" "1" "$(denied "$(as $A "select count(*) from post_reports")")"
chk "members can't update reports"           "1" "$(denied "$(as $A "update post_reports set reason='spam'")")"
chk "members can't delete reports"           "1" "$(denied "$(as $A "delete from post_reports")")"
chk "service role (mods) can read"           "$(q "select count(*) from post_reports")" "$($PSQL -d $DB -At -c "set role service_role;" -c "select count(*) from post_reports" 2>&1)"
chk "deleting a post removes its reports"    "0" "$(q "delete from posts where id=$P; select count(*) from post_reports where post_id=$P" | tail -1)"
echo; echo "$pass passed, $fail failed"; [ $fail -eq 0 ]
