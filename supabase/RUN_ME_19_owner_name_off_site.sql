-- SMU+ RUN_ME_19: keep the project owner's name off the site (approved Oct. 26, 2026).
-- Reviewed UPDATE only, no deletes. One profile's display name rendered on two board posts.
-- Scan of every public text column found only: profiles.display_name (1 row, below) and
-- newsletter_signups.email (1 private row, never rendered; left as is).
update public.profiles
   set display_name = 'SMU+ Tester'
 where id = '83dab8a0-d75a-4462-bdc8-75a729d1563c'
   and display_name ~* 'jackson|walker';
