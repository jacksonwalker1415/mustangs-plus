-- SMU+ RUN_ME_16: free Student membership (SMU email + student ID).
-- Run after schema.sql and RUN_ME_15 in the Supabase SQL Editor of project mustangs-plus (lpoguzstqpwzcmjxeaik) only.
-- Additive and safe to re-run: create table/index IF NOT EXISTS, create or replace function, and drop-and-recreate of
-- the named constraint and the two demo membership policies it widens or tightens. No DROP TABLE, no DELETE, no user data changed.
--
-- How it works
--   * Membership lives in public.memberships.tier. This adds the tier value 'student'.
--   * A student signs up with the existing email-link auth on an @smu.edu address, then the site calls
--     claim_student_membership(student_id, class_year). The function checks, on the server, that the signed-in
--     user's email ends in @smu.edu AND is confirmed, stores the student ID privately and sets tier = 'student'.
--   * The student ID is stored only in public.student_verifications. Nobody can read that column through the API,
--     including the student; the browser can read only its own class_year and verified_at. One ID = one account (unique).
--     SMU+ cannot check the ID against SMU's records; it only keeps student memberships to one per student.
--   * The Student plan is free and is NOT a paid membership: is_member() keeps the members-only boards for paid tiers,
--     and members can't give themselves tier 'student' through the demo plan switcher.
--   * The student form also adds the @smu.edu email to the waitlist with tier_interest = 'student' (4b below).
-- After it runs, set MP.FEATURES.students = true in assets/data.js (until then the live site hides the student sign-up).

-- 1. Private table
create table if not exists public.student_verifications (
  user_id     uuid primary key references public.profiles(id) on delete cascade,
  student_id  text not null check (student_id ~ '^[0-9]{6,10}$'),
  class_year  int check (class_year between 2026 and 2034),
  verified_at timestamptz not null default now(),
  constraint student_verifications_student_id_key unique (student_id)
);
alter table public.student_verifications enable row level security;
drop policy if exists "students: read own row" on public.student_verifications;
create policy "students: read own row" on public.student_verifications
  for select to authenticated using (user_id = (select auth.uid()));
-- No insert/update/delete for API roles: rows are written only by claim_student_membership().
revoke all on public.student_verifications from anon, authenticated;
grant select (user_id, class_year, verified_at) on public.student_verifications to authenticated;   -- never student_id

-- 2. Tier value 'student' (only replaces the check if it doesn't allow 'student' yet)
do $$ begin
  if not exists (select 1 from pg_constraint where conrelid = 'public.memberships'::regclass and conname = 'memberships_tier_check'
                 and pg_get_constraintdef(oid) like '%student%') then
    alter table public.memberships drop constraint if exists memberships_tier_check;
    alter table public.memberships add constraint memberships_tier_check check (tier in ('free','mustang','pony','club','student'));
  end if;
end $$;

-- 3. Student is a free plan: members-only boards stay with the paid tiers
create or replace function public.is_member(uid uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.memberships m where m.user_id = uid and m.tier not in ('free','student'));
$$;

-- 4. The demo plan switcher can't grant 'student' (only claim_student_membership can)
drop policy if exists "demo: create own membership" on public.memberships;
create policy "demo: create own membership" on public.memberships for insert
  with check (auth.uid() = user_id and status = 'demo' and stripe_customer_id is null and tier <> 'student');
drop policy if exists "demo: change own tier" on public.memberships;
create policy "demo: change own tier" on public.memberships for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id and status = 'demo' and stripe_customer_id is null and tier <> 'student');

-- 4b. Waitlist: allow tier_interest = 'student' (the student form also joins the waitlist with the @smu.edu email).
--     Replaces only that check constraint, with the same values plus 'student'. No rows change. The student ID is never
--     put in the waitlist; it is stored only in student_verifications, after the email is confirmed.
do $$ begin
  if to_regclass('public.waitlist') is not null
     and exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'waitlist' and column_name = 'tier_interest')
     and not exists (select 1 from pg_constraint where conrelid = 'public.waitlist'::regclass and conname = 'waitlist_tier_interest_check'
                     and pg_get_constraintdef(oid) like '%student%') then
    alter table public.waitlist drop constraint if exists waitlist_tier_interest_check;
    alter table public.waitlist add constraint waitlist_tier_interest_check
      check (tier_interest is null or tier_interest in ('free','mustang','all_access','red_blue','not_sure','student'));
  end if;
end $$;

-- 5. Claim (or restore) the free Student plan
--    p_student_id: 6 to 10 digits. May be null when this account is already verified (restores the Student plan).
--    Returns jsonb {ok, tier, class_year} or {ok:false, reason, message}. Never returns the student ID.
create or replace function public.claim_student_membership(p_student_id text default null, p_class_year int default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  uid uuid := auth.uid(); em text; confirmed boolean; sid text := nullif(btrim(p_student_id), '');
  ex public.student_verifications%rowtype; cur text; new_tier text;
begin
  if uid is null then raise exception 'Sign in first' using errcode = '42501'; end if;
  select lower(u.email), (u.email_confirmed_at is not null) into em, confirmed from auth.users u where u.id = uid;
  if em is null or em !~ '^[^@[:space:]]+@smu\.edu$' then
    return jsonb_build_object('ok', false, 'reason', 'not_smu', 'message', 'Student membership needs an @smu.edu email.');
  end if;
  if not confirmed then
    return jsonb_build_object('ok', false, 'reason', 'unconfirmed', 'message', 'Open the link we sent to your @smu.edu email first.');
  end if;
  if p_class_year is not null and p_class_year not between 2026 and 2034 then
    return jsonb_build_object('ok', false, 'reason', 'class_year', 'message', 'Pick a class year between 2026 and 2034.');
  end if;
  if sid is not null and sid !~ '^[0-9]{6,10}$' then
    return jsonb_build_object('ok', false, 'reason', 'bad_id', 'message', 'Student ID is 6 to 10 digits.');
  end if;

  select * into ex from public.student_verifications where user_id = uid;
  if found then
    if sid is not null and sid <> ex.student_id then
      return jsonb_build_object('ok', false, 'reason', 'id_mismatch', 'message', 'This account is already linked to a different student ID.');
    end if;
    if p_class_year is not null then update public.student_verifications set class_year = p_class_year where user_id = uid; end if;
  else
    if sid is null then
      return jsonb_build_object('ok', false, 'reason', 'bad_id', 'message', 'Enter your student ID.');
    end if;
    if p_class_year is null then
      return jsonb_build_object('ok', false, 'reason', 'class_year', 'message', 'Pick your class year.');
    end if;
    begin
      insert into public.student_verifications (user_id, student_id, class_year) values (uid, sid, p_class_year);
    exception when unique_violation then
      return jsonb_build_object('ok', false, 'reason', 'id_taken', 'message', 'That student ID is already linked to another SMU+ account.');
    end;
  end if;

  -- Free accounts become Student; a demo paid plan is left as it is (they can return to Student when they cancel it)
  select tier into cur from public.memberships where user_id = uid;
  if cur is null then
    insert into public.memberships (user_id, tier, status) values (uid, 'student', 'active') on conflict (user_id) do nothing;
  elsif cur = 'free' then
    update public.memberships set tier = 'student', status = 'active', updated_at = now() where user_id = uid and stripe_customer_id is null;
  end if;
  select tier into new_tier from public.memberships where user_id = uid;
  return jsonb_build_object('ok', true, 'tier', coalesce(new_tier, 'student'),
    'class_year', (select class_year from public.student_verifications where user_id = uid));
end $$;

revoke all on function public.claim_student_membership(text, int) from public, anon;
grant execute on function public.claim_student_membership(text, int) to authenticated;
