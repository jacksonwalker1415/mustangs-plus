-- SMU+ RUN_ME_26 (Oct. 26, 2026): remove the Film Room Lounge board completely.
-- Approved by Jackson ("Should I remove the Film Room Lounge board, now that Film Room is gone?" -> "yes").
-- DELETES DEMO DATA: 1 thread (id 20), 5 posts (ids 2001-2005, all seeded persona posts, no real user posts),
-- 0 likes, 0 reports, then the forums row 'filmroom'. No posts on other boards quote these posts.
--
-- RESTORE (exact rows captured before the delete; run as one block):
--   begin;
--   insert into public.forums select * from jsonb_populate_record(null::public.forums, '{"id": "filmroom", "grp": "Premium", "name": "Film Room Lounge", "sort": 2, "premium": true, "description": "Frame-by-frame breakdowns with the SMU+ film staff."}');
--   insert into public.threads select * from jsonb_populate_record(null::public.threads, '{"id": 20, "hot": true, "sport": "football", "title": "Breakdown: the third-down sim pressure, snap by snap", "pinned": false, "game_id": null, "forum_id": "filmroom", "author_id": null, "created_at": "2026-10-26T01:57:56.439501+00:00", "view_count": 5100, "reply_count": 167, "last_post_at": "2026-10-26T05:17:56.439501+00:00", "author_handle": "dre"}');
--   insert into public.posts select * from jsonb_populate_recordset(null::public.posts, '[{"id": 2001, "body": "Cut up the A-gap sim pressure snap by snap. Watch the boundary linebacker: he always shows blitz and only sometimes comes. QB sees six, gets four.", "author_id": null, "thread_id": 20, "created_at": "2026-10-26T01:57:56.439501+00:00", "author_handle": "dre", "quote_post_id": null}, {"id": 2002, "body": "The free safety not moving until the snap is so disciplined. You can see the QB staring at him.", "author_id": null, "thread_id": 20, "created_at": "2026-10-26T02:37:56.439501+00:00", "author_handle": "ray", "quote_post_id": 2001}, {"id": 2003, "body": "Is this sustainable? Feels like good offenses will motion the back out and stress it.", "author_id": null, "thread_id": 20, "created_at": "2026-10-26T03:17:56.439501+00:00", "author_handle": "peruna", "quote_post_id": null}, {"id": 2004, "body": "Exactly the counter. Staff has an answer, but I''ll save it for Thursday.", "author_id": null, "thread_id": 20, "created_at": "2026-10-26T03:57:56.439501+00:00", "author_handle": "dre", "quote_post_id": 2003}, {"id": 2005, "body": "This is the best thing on the site. Worth the membership by itself.", "author_id": null, "thread_id": 20, "created_at": "2026-10-26T04:37:56.439501+00:00", "author_handle": "grace", "quote_post_id": null}]') order by id;
--   update public.threads set reply_count = 167, last_post_at = '2026-10-26T05:17:56.439501+00:00' where id = 20;  -- the posts trigger bumps these on insert
--   -- (no post_likes or post_reports existed on this board, so there is nothing else to restore)
--   commit;

begin;
delete from public.post_likes   where post_id in (select p.id from public.posts p join public.threads t on t.id = p.thread_id where t.forum_id = 'filmroom');
delete from public.post_reports where post_id in (select p.id from public.posts p join public.threads t on t.id = p.thread_id where t.forum_id = 'filmroom');
delete from public.posts   where thread_id in (select id from public.threads where forum_id = 'filmroom');
delete from public.threads where forum_id = 'filmroom';
delete from public.forums  where id = 'filmroom';
commit;
