-- SMU+ RUN_ME_3: tier display-name rename (2026-10-26). Safe to run more than once. Updates only; nothing is removed.
-- Tier KEYS (free / mustang / pony / club) are unchanged, so memberships and code keep working.
-- Display names: Mustang ($9.99), All-Access ($24.99, was Pony Express), Red & Blue ($99, was Boulevard Club).
update public.personas set tier_label = 'All-Access' where tier_label = 'Pony Express';
update public.personas set tier_label = 'Red & Blue' where tier_label = 'Boulevard Club';
