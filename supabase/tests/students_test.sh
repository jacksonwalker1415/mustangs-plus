#!/bin/bash
# Tests for supabase/RUN_ME_16_students.sql on a throwaway local Postgres (never the live project).
# Usage: PGPORT=54339 supabase/tests/students_test.sh
set -u
cd "$(dirname "$0")/.."
PORT=${PGPORT:-54339}; DB=smu_students_test
export PGOPTIONS="-c client_min_messages=warning"
PSQL="psql -h /tmp -p $PORT -U postgres -v ON_ERROR_STOP=1 -q -X"
pass=0; fail=0
chk(){ [ "$3" = "$2" ] && { pass=$((pass+1)); echo "  ok   $1"; } || { fail=$((fail+1)); echo "  FAIL $1 (wanted $2, got $3)"; }; }
q(){ $PSQL -d $DB -At -c "$1" 2>&1; }
as(){ ${PSQL/ -q/} -d $DB -At -c "set role authenticated; set request.jwt.claim.sub='$1';" -c "$2" 2>&1 | grep -v '^SET$'; }
asq(){ $PSQL -d $DB -At -c "set role authenticated; set request.jwt.claim.sub='$1';" -c "$2" 2>&1; }
anon(){ $PSQL -d $DB -At -c "set role anon;" -c "$1" 2>&1; }
claim(){ asq $1 "select claim_student_membership($2)" | tail -1; }
reason(){ claim $1 "$2" | sed -E 's/.*"reason": "([a-z_]+)".*/\1/'; }
$PSQL -d postgres -c "drop database if exists $DB with (force)" -c "create database $DB" >/dev/null
$PSQL -d $DB -f tests/supabase_stubs.sql >/dev/null 2>&1
for f in schema.sql seed.sql waitlist.sql RUN_ME_2.sql RUN_ME_16_students.sql RUN_ME_16_students.sql; do $PSQL -d $DB -f $f >/dev/null || { echo "FAIL loading $f"; exit 1; }; done
chk "loads and re-runs" ok ok
S=aaaaaaaa-0000-0000-0000-00000000000a; T=bbbbbbbb-0000-0000-0000-00000000000b; G=cccccccc-0000-0000-0000-00000000000c; U=dddddddd-0000-0000-0000-00000000000d; P=eeeeeeee-0000-0000-0000-00000000000e
q "insert into auth.users(id,email,email_confirmed_at) values ('$S','Pony.Stu@SMU.edu',now()),('$T','two@smu.edu',now()),('$G','fan@gmail.com',now()),('$U','new@smu.edu',null),('$P','paid@smu.edu',now())" >/dev/null
q "update memberships set tier='mustang' where user_id='$P'" >/dev/null
chk "new users start free" "free" "$(q "select tier from memberships where user_id='$S'")"
chk "non-SMU email refused"        "not_smu"     "$(reason $G "'1234567',2028")"
chk "lookalike domain refused"     "not_smu"     "$(q "update auth.users set email='x@smu.edu.evil.com' where id='$G'" >/dev/null; reason $G "'1234567',2028")"
chk "unconfirmed SMU email refused" "unconfirmed" "$(reason $U "'1234567',2028")"
chk "ID with letters refused"      "bad_id"      "$(reason $S "'12A4567',2028")"
chk "5-digit ID refused"           "bad_id"      "$(reason $S "'12345',2028")"
chk "11-digit ID refused"          "bad_id"      "$(reason $S "'12345678901',2028")"
chk "class year out of range"      "class_year"  "$(reason $S "'1234567',2040")"
chk "missing ID refused"           "bad_id"      "$(reason $S "null,2028")"
chk "missing class year refused"   "class_year"  "$(reason $S "'1234567',null")"
chk "nothing stored after refusals" "0" "$(q "select count(*) from student_verifications")"
chk "valid claim (mixed-case SMU email) ok" '{"ok": true, "tier": "student", "class_year": 2028}' "$(claim $S "' 1234567 ',2028")"
chk "tier is now student, status active" "student|active" "$(q "select tier,status from memberships where user_id='$S'")"
chk "ID stored trimmed" "1234567" "$(q "select student_id from student_verifications where user_id='$S'")"
chk "same ID on another account refused" "id_taken" "$(reason $T "'1234567',2027")"
chk "other account stays free" "free" "$(q "select tier from memberships where user_id='$T'")"
chk "different ID on verified account refused" "id_mismatch" "$(reason $S "'7654321',2028")"
chk "re-claim with same ID is fine" "true" "$(claim $S "'1234567',2029" | grep -o '"ok": true' | cut -d' ' -f2)"
chk "class year updated" "2029" "$(q "select class_year from student_verifications where user_id='$S'")"
chk "student is not a paid member" "f" "$(q "select is_member('$S')")"
chk "paid tier still a member" "t" "$(q "select is_member('$P')")"
chk "student can't read premium posts" "0" "$(asq $S "select count(*) from posts p join threads t on t.id=p.thread_id where t.forum_id='paddock'")"
chk "student reads own class year" "2029" "$(asq $S "select class_year from student_verifications")"
chk "student can't read the ID column" "1" "$(asq $S "select student_id from student_verifications" | grep -c 'permission denied')"
chk "other user sees no rows" "0" "$(asq $T "select count(*) from student_verifications")"
chk "anon can't read the table" "1" "$(anon "select count(*) from student_verifications" | grep -c 'permission denied')"
chk "no direct insert" "1" "$(asq $T "insert into student_verifications(user_id,student_id,class_year) values ('$T','2222222',2027)" | grep -c 'permission denied')"
chk "no direct delete" "1" "$(asq $S "delete from student_verifications" | grep -c 'permission denied')"
chk "anon can't call the RPC" "1" "$(anon "select claim_student_membership('1111111',2028)" | grep -c 'permission denied')"
chk "can't self-grant student via plan switcher" "1" "$(asq $T "update memberships set tier='student', status='demo' where user_id='$T'" | grep -c 'row-level security')"
chk "demo paid plan still switchable" "UPDATE 1" "$(as $T "update memberships set tier='pony', status='demo', updated_at=now() where user_id='$T'" | tail -1)"
chk "student can switch to a demo paid plan" "UPDATE 1" "$(as $S "update memberships set tier='mustang', status='demo' where user_id='$S'" | tail -1)"
chk "and cancel back to free" "UPDATE 1" "$(as $S "update memberships set tier='free', status='demo' where user_id='$S'" | tail -1)"
chk "restore Student with no ID (already verified)" '{"ok": true, "tier": "student", "class_year": 2029}' "$(claim $S "null,null")"
chk "paid user claiming keeps paid tier" "mustang" "$(claim $P "'5555555',2027" >/dev/null; q "select tier from memberships where user_id='$P'")"
chk "unverified user can't restore" "bad_id" "$(reason $T "null,null")"
chk "re-run keeps rows" "2" "$($PSQL -d $DB -f RUN_ME_16_students.sql >/dev/null; q "select count(*) from student_verifications")"
chk "re-run keeps student tier" "student" "$(q "select tier from memberships where user_id='$S'")"
chk "deleting the account removes the ID" "1" "$(q "delete from auth.users where id='$P'" >/dev/null; q "select count(*) from student_verifications")"
W="insert into waitlist(email,name,affiliation,consent,consent_version,source,tier_interest) values"
chk "anon can join the waitlist as a student" "INSERT 0 1" "$(${PSQL/ -q/} -d $DB -At -c "set role anon;" -c "$W ('stu1@smu.edu','Stu','student',true,'2026-10-26','site','student')" 2>&1 | tail -1)"
chk "other tier_interest values still accepted" "INSERT 0 1" "$(${PSQL/ -q/} -d $DB -At -c "set role anon;" -c "$W ('fan1@example.com',null,'fan',true,'2026-10-26','site','red_blue')" 2>&1 | tail -1)"
chk "unknown tier_interest still refused" "1" "$(anon "$W ('x1@example.com',null,null,true,'2026-10-26','site','vip')" | grep -c 'waitlist_tier_interest_check')"
chk "anon still can't read the waitlist" "1" "$(anon "select count(*) from waitlist" | grep -c 'permission denied')"
chk "waitlist rows kept on re-run" "2" "$($PSQL -d $DB -f RUN_ME_16_students.sql >/dev/null; q "select count(*) from waitlist")"
chk "waitlist has no student ID column" "0" "$(q "select count(*) from information_schema.columns where table_name='waitlist' and column_name ilike '%student%'")"
echo; echo "$pass passed, $fail failed"; [ $fail -eq 0 ]
