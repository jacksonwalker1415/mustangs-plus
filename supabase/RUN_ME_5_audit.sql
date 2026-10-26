-- SMU+ RUN_ME_5: audit copy fix (2026-10-26). Two sample board posts still named the old "Club" tier.
-- Safe to run more than once. Updates only; nothing is removed.
update public.posts set body = replace(body, 'the Club tier', 'the Red & Blue tier') where id in (102, 402) and body like '%the Club tier%';
update public.posts set body = replace(body, 'The Club tier', 'The Red & Blue tier') where id in (102, 402) and body like '%The Club tier%';
