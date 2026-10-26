-- SMU+ RUN_ME_30: waitlist price survey (Jackson, Oct 26). Purely additive: three new nullable columns, no data changed.
-- Question: "If SMU+ launched, would you pay $14.99 a month, $129 a year, or stick with the free feed?" (prices: SURVEY_PRICE in assets/app.js)
--   would_pay      true = monthly or annual, false = free feed only, null = skipped
--   billing_choice 'monthly' | 'annual' when would_pay is true, otherwise null
--   survey_prices  the prices the visitor saw, e.g. '14.99/129', so answers stay gradable if the prices change
-- CFO grading: paid share = avg(would_pay::int) over answered rows; annual share = count(*) filter (where billing_choice='annual') / count(*) filter (where would_pay).
-- Safe to run more than once.
alter table public.waitlist add column if not exists would_pay      boolean;
alter table public.waitlist add column if not exists billing_choice text check (billing_choice is null or billing_choice in ('monthly','annual'));
alter table public.waitlist add column if not exists survey_prices  text check (survey_prices is null or char_length(survey_prices) <= 20);
do $$ begin
  if not exists (select 1 from pg_constraint where conrelid = 'public.waitlist'::regclass and conname = 'waitlist_billing_needs_pay') then
    alter table public.waitlist add constraint waitlist_billing_needs_pay
      check ((billing_choice is null and (would_pay is not true)) or (billing_choice is not null and would_pay is true));
  end if;
end $$;
-- Visitors stay insert-only; the existing insert policy (with check (consent)) covers the new columns.
grant insert (would_pay, billing_choice, survey_prices) on public.waitlist to anon, authenticated;
