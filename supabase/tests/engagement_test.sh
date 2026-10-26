#!/bin/bash
# Tests for supabase/engagement.sql on a throwaway local Postgres (never the live project).
# Usage: PGPORT=54339 supabase/tests/engagement_test.sh     (expects a superuser "postgres" on /tmp socket)
set -u
cd "$(dirname "$0")/.."
PORT=${PGPORT:-54339}; DB=smu_engage_test
export PGOPTIONS="-c client_min_messages=warning"
PSQL="psql -h /tmp -p $PORT -U postgres -v ON_ERROR_STOP=1 -q -X"
pass=0; fail=0
ok(){ pass=$((pass+1)); echo "  ok   $1"; }
bad(){ fail=$((fail+1)); echo "  FAIL $1"; echo "       got: $2"; }
su(){ $PSQL -d $DB -At -c "$1" 2>&1; }
as(){ # as <uuid|anon> <sql>
  local pre
  if [ "$1" = anon ]; then pre="set role anon;"; else pre="select set_config('request.jwt.claims','{\"sub\":\"$1\",\"role\":\"authenticated\"}',false); set role authenticated;"; fi
  $PSQL -d $DB -At -c "$pre" -c "$2" 2>&1 | sed '/^$/d' | grep -v '^{"sub"' ; }
expect_eq(){ [ "$3" = "$2" ] && ok "$1" || bad "$1 (wanted $2)" "$3"; }
expect_has(){ echo "$3" | grep -qE -- "$2" && ok "$1" || bad "$1 (wanted /$2/)" "$3"; }

echo "Fresh database: stubs + schema.sql + seed.sql + engagement.sql (engagement run twice to prove it re-runs)"
$PSQL -d postgres -c "drop database if exists $DB with (force)" -c "create database $DB" >/dev/null
$PSQL -d $DB -f tests/supabase_stubs.sql >/dev/null 2>&1
for f in schema.sql seed.sql engagement.sql engagement.sql; do $PSQL -d $DB -f $f >/dev/null || { echo "FAIL loading $f"; exit 1; }; done
ok "migration loads and re-runs cleanly"

A=aaaaaaaa-0000-0000-0000-000000000001; B=bbbbbbbb-0000-0000-0000-000000000002
C=cccccccc-0000-0000-0000-000000000003; D=dddddddd-0000-0000-0000-000000000004
su "insert into auth.users(id,email,email_confirmed_at,raw_user_meta_data) values
 ('$A','ava@smu.edu',now(),'{\"display_name\":\"Ava R.\"}'),('$B','ben@SMU.edu',now(),'{\"display_name\":\"Ben T.\"}'),
 ('$C','cal@gmail.com',now(),'{}'),('$D','dee@smu.edu',null,'{}')" >/dev/null
# a test home game that kicks off in 60 minutes, so check-in is open and counts as early
su "insert into engage_games(id,season,opponent,venue,kickoff) values ('t-now',2026,'Test Opponent','Gerald J. Ford Stadium',now()+interval '60 minutes'),
 ('t-late',2026,'Later Opponent','Gerald J. Ford Stadium',now()+interval '5 hours')" >/dev/null

echo "Clients can't write points, check-ins or redemptions directly"
expect_has "insert into point_events denied"  "permission denied" "$(as $A "insert into point_events(user_id,kind,points,ref,season) values ('$A','adjust',99999,'x',2026)")"
expect_has "update point_events denied"       "permission denied" "$(as $A "update point_events set points=99999")"
expect_has "delete point_events denied"       "permission denied" "$(as $A "delete from point_events")"
expect_has "insert into checkins denied"      "permission denied" "$(as $A "insert into checkins(user_id,game_id,minutes_before_kickoff,points) values ('$A','t-now',60,100)")"
expect_has "insert into redemptions denied"   "permission denied" "$(as $A "insert into redemptions(user_id,reward_id,cost,code) values ('$A','combo',1,'X')")"
expect_has "self-promote to student denied"   "permission denied" "$(as $A "update profiles set is_student=true, smu_email_verified=true where id='$A'")"
expect_has "rewards are read-only"            "permission denied" "$(as $A "update rewards set cost=1")"
expect_has "award() helper not callable"      "permission denied" "$(as $A "select award('$A','adjust',5000,'x',null,2026,null)")"
expect_has "gate secret not readable"         "permission denied" "$(as $A "select secret from engage_games")"
expect_has "gate code helper not callable"    "permission denied" "$(as $A "select engage_code('t-now',1)")"
expect_has "anon can't check in"              "permission denied" "$(as anon "select check_in('t-now','000000')")"
expect_has "student fields are private"       "permission denied" "$(as anon "select is_student from profiles")"
expect_eq  "display names still public"       "4" "$(as anon "select count(display_name) from profiles")"

echo "Student verification"
expect_has "non-smu email rejected"   '"reason": "not_smu"'     "$(as $C "select verify_student(2028)")"
expect_has "unconfirmed email waits"  '"reason": "unconfirmed"' "$(as $D "select verify_student(2028)")"
expect_has "A verifies, +100 welcome" '"bonus": 100'            "$(as $A "select verify_student(2028)")"
expect_has "re-verify gives no bonus" '"bonus": 0'              "$(as $A "select verify_student(2028)")"
expect_has "unverified can't check in" '"reason": "student"'    "$(as $C "select check_in('t-now','000000')")"

echo "Check-in"
CODE=$(su "select engage_code('t-now', engage_window(now()))")
PREV=$(su "select engage_code('t-now', engage_window(now())-1)")
OLD=$(su "select engage_code('t-now', engage_window(now())-3)")
expect_has "wrong code rejected"       '"reason": "code"'   "$(as $A "select check_in('t-now','$( [ "$CODE" = 123456 ] && echo 654321 || echo 123456 )')")"
expect_has "expired code rejected"     '"reason": "code"'   "$(as $A "select check_in('t-now','$OLD')")"
R=$(as $A "select check_in('t-now','$CODE')")
expect_has "right code checks in"      '"ok": true'         "$R"
expect_has "base + early = 150"        '"points": 150'      "$R"
expect_has "double check-in fails"     '"reason": "already"' "$(as $A "select check_in('t-now','$CODE')")"
expect_eq  "exactly one check-in row"  "1"   "$(su "select count(*) from checkins where user_id='$A' and game_id='t-now'")"
expect_eq  "exactly one base award"    "1"   "$(su "select count(*) from point_events where user_id='$A' and kind='checkin' and ref='t-now'")"
expect_has "window closed 5h out"      '"reason": "closed"' "$(as $A "select check_in('t-late','$(su "select engage_code('t-late', engage_window(now()))")')")"
expect_has "TBD kickoff stays closed"  '"reason": "closed"' "$(as $A "select check_in('fb-2026-11-14','000000')")"
expect_eq  "A sees only own ledger"    "0"   "$(as $A "select count(*) from point_events where user_id<>'$A'")"
expect_eq  "A balance view = 250"      "250" "$(as $A "select balance from point_balances")"

echo "Streaks and milestones"
su "insert into checkins(user_id,game_id,minutes_before_kickoff,points) values ('$B','fb-2026-10-17',20,100),('$B','fb-2026-10-24',20,100)" >/dev/null
as $B "select verify_student(2027)" >/dev/null
R=$(as $B "select check_in('t-now','$PREV')")
expect_has "previous 30s code still accepted" '"ok": true'    "$R"
expect_has "3-game streak +50"         '"label": "3-game streak", "points": 50' "$R"
expect_has "3rd check-in milestone"    '"label": "3 home games", "points": 150' "$R"
expect_has "total 100+50+50+150 = 350" '"points": 350'        "$R"

echo "Wrong-code lockout"
for i in 1 2 3 4 5 6 7 8; do as $B "select check_in('t-late','000001')" >/dev/null; done
su "update engage_games set kickoff=now()+interval '30 minutes' where id='t-late'" >/dev/null
for i in 1 2 3 4 5 6 7 8; do as $B "select check_in('t-late','000001')" >/dev/null; done
expect_has "locked after 8 bad codes"  '"reason": "locked"'  "$(as $B "select check_in('t-late','$(su "select engage_code('t-late', engage_window(now()))")')")"

echo "Rewards and overspending"
expect_has "can't overspend (250 < 400)"  '"reason": "balance"' "$(as $A "select redeem_reward('combo')")"
R=$(as $A "select redeem_reward('drink-popcorn')")
expect_has "redeem within balance"       '"ok": true'          "$R"
expect_has "issues a DEMO code"          '"code": "DEMO-[0-9A-F]{4}-[0-9A-F]{4}"' "$R"
expect_has "balance now 0, can't redeem" '"reason": "balance"' "$(as $A "select redeem_reward('drink-popcorn')")"
expect_eq  "ledger never goes negative"  "0"   "$(su "select sum(points) from point_events where user_id='$A'")"
expect_eq  "redemption row is A's own"   "1"   "$(as $A "select count(*) from redemptions")"
su "insert into point_events(user_id,kind,points,ref,season) values ('$B','adjust',2000,'test',2026)" >/dev/null
as $B "select redeem_reward('student-tee')" >/dev/null
expect_has "per-student limit enforced"  '"reason": "limit"'   "$(as $B "select redeem_reward('student-tee')")"
su "update rewards set stock=0 where id='beanie'" >/dev/null
expect_has "out of stock enforced"       '"reason": "stock"'   "$(as $B "select redeem_reward('beanie')")"
expect_has "unknown reward rejected"     '"reason": "reward"'  "$(as $B "select redeem_reward('nope')")"

echo "Leaderboards"
LB=$(as anon "select rank||'|'||display_name||'|'||class_year||'|'||points from leaderboard('season')")
expect_has "season board lists students" "^1\|Ben T\.\|2027\|" "$LB"
su "insert into point_events(user_id,kind,points,ref,season) values ('$C','adjust',9000,'test',2026)" >/dev/null
expect_eq  "non-students left off"       "0" "$(as anon "select count(*) from leaderboard('season') where points>=9000")"
expect_eq  "board has no user ids"       "rank display_name class_year points checkins is_me" "$(su "select string_agg(parameter_name,' ' order by ordinal_position) from information_schema.parameters where specific_name like 'leaderboard%' and parameter_mode='OUT'")"
expect_has "game board"                  "Ava R\.\|150"         "$(as anon "select display_name||'|'||points from leaderboard('game','t-now')")"
expect_eq  "class filter"                "Ava R." "$(as anon "select display_name from leaderboard('season',null,2028)")"
expect_eq  "is_me marks only me"         "Ava R." "$(as $A "select display_name from leaderboard('season') where is_me")"
expect_has "class standings"             "2027\|1\|"            "$(as anon "select class_year||'|'||students||'|'||points from class_standings()")"
as $B "select set_leaderboard_visibility(false)" >/dev/null
expect_eq  "opt-out hides from board"    "0" "$(as anon "select count(*) from leaderboard('season') where display_name='Ben T.'")"

echo "Gate display"
expect_has "students can't fetch gate code" "Gate staff only" "$(as $A "select gate_code('t-now')")"
su "insert into gate_staff values ('$C')" >/dev/null
expect_has "gate staff gets live code"   "\"code\": \"$(su "select engage_code('t-now', engage_window(now()))")\"" "$(as $C "select gate_code('t-now')")"

echo "Ledger is append-only, even for the database owner"
expect_has "owner can't update ledger"   "append-only" "$(su "update point_events set points=5 where user_id='$A' and kind='welcome'")"
expect_has "owner can't delete ledger"   "append-only" "$(su "delete from point_events where user_id='$A'")"
su "delete from auth.users where id='$A'" >/dev/null
expect_eq  "account deletion still cascades" "0" "$(su "select count(*) from point_events where user_id='$A'")"

echo; echo "$pass passed, $fail failed"; [ $fail -eq 0 ]
