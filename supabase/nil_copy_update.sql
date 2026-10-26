-- SMU+ NIL copy update (2026-10-26). Safe to run more than once.
-- Run in Supabase: SQL Editor > New query > paste > Run.
-- Brings the live boards in line with the site: no "NIL fund"/per-athlete payment language.
update public.threads set title = 'Where would the NIL money go? How the proposed model works' where id = 9;
update public.posts set body = 'Pinned. How the proposed model works: 40% of membership revenue would go to SMU Athletics’ official NIL and revenue-sharing programs, with athlete deals disclosed through the NIL Go clearinghouse. SMU+ would not pick or pay individual athletes or teams. (Sample post for this concept.)' where id = 901;
update public.posts set body = 'Clear rules like this are why I joined.' where id = 902;
update public.posts set body = 'Good that it runs through SMU’s official programs.' where id = 903;
update public.posts set body = 'NIL matters here. Fan support through SMU’s official programs could move the needle.' where id = 303;
