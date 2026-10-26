-- SMU+ RUN_ME_22 (applied Oct. 26, 2026, approved by Jackson): remove the two "test" replies the old owner account
-- (now "SMU+ Tester") left on the boards. Exactly these two rows, matched by id AND body, so nothing else can match.
--   100012  The Hilltop  · thread 2 "Official Game Thread: SMU at Syracuse"  body 'test'  posted 2026-10-26 04:10 CT
--   100013  The Paddock  · thread 1 "Practice report: Tuesday notes…"         body 'test'  posted 2026-10-26 04:31 CT
-- Neither is a thread's first post, neither has likes, and no post quotes them. post_likes and post_reports rows
-- would cascade if any existed.
delete from public.posts
 where id in (100012, 100013)
   and btrim(body) = 'test'
   and author_id = '83dab8a0-d75a-4462-bdc8-75a729d1563c'
returning id, thread_id, body;
