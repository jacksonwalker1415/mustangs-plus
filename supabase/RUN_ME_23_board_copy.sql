-- RUN_ME_23: reword seeded staff/demo board copy that still said "members-only" / "premium".
-- Scope: mustangs-plus only. Touches 2 forum descriptions, thread 19's title and seed posts 1901/1902
-- (author_handle 'staff' / 'cox', fictional demo accounts). Each update matches the exact old text,
-- so a second run changes nothing. No rows are deleted.
begin;
update public.forums set description = 'Insider intel and practice reports from SMU+ staff.'
 where id = 'paddock' and description = 'Members-only premium board. Insider intel and practice reports.';
update public.forums set description = 'Frame-by-frame breakdowns with the SMU+ film staff.'
 where id = 'filmroom' and description = 'Frame-by-frame breakdowns with the SMU+ film staff. Members only.';
update public.threads set title = 'Board rules and how the boards work (read before posting)'
 where id = 19 and author_handle = 'staff' and title = 'Board rules and how premium boards work (read before posting)';
update public.posts set body = 'Welcome. Be civil, no posting about players'' families, don''t copy whole staff reports to other sites. Anyone can read every board. Sign in to post. Every username and post on this demo board is fictional.'
 where id = 1901 and author_handle = 'staff' and body = 'Welcome. Be civil, no posting about players'' families, no screenshots of premium posts. The Paddock and Film Room Lounge are members-only; everything else is free. Every username and post on this demo board is fictional.';
update public.posts set body = 'Appreciate the rule on staff reports. Keeps the good info coming.'
 where id = 1902 and author_handle = 'cox' and body = 'Appreciate the no-screenshots rule. Keeps the good info coming.';
commit;
-- Revert: swap the new and old strings above.
