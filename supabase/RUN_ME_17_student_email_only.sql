-- SMU+ RUN_ME_17: Student plan by @smu.edu email only (no student ID). Project mustangs-plus (lpoguzstqpwzcmjxeaik) only.
-- Idempotent and additive: makes student_verifications.student_id optional and lets claim_student_membership()
-- verify by the confirmed @smu.edu email alone. Nothing is dropped or deleted: the column, its 6-10 digit check and its
-- unique constraint stay (they allow NULL; a supplied ID is still validated and kept one-per-account for old clients).
-- At the time of writing the table held 0 rows.

-- 1. student_id becomes optional
alter table public.student_verifications alter column student_id drop not null;

-- 2. Claim (or restore) the free Student plan. p_student_id is ignored when null; the server still requires a signed-in,
--    confirmed @smu.edu email and a class year for a new claim. Returns jsonb {ok, tier, class_year} or {ok:false, reason, message}.
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
