-- SMU+ RUN_ME_18 (already applied 2026-10-26 on mustangs-plus): pinned staff post 901 no longer quotes a percentage.
-- Updates one row only, and only if it still has the old wording. Nothing deleted.
update public.posts set body = 'Pinned. How the proposed model works: a share of membership revenue would support SMU Athletics’ official NIL and revenue-sharing programs, with exact terms still to be decided and athlete deals disclosed through the NIL Go clearinghouse. SMU+ would not pick or pay individual athletes or teams. (Sample post for this concept.)'
where id = 901 and thread_id = 9 and body like 'Pinned. How the proposed model works: 40%';
