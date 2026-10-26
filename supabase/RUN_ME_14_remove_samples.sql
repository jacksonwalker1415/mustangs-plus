-- SMU+ RUN_ME_14: remove the fictional sample library items from content_items (approved by the project owner, Oct. 26, 4:29 AM CT).
-- content_items has no published/visible column, so this deletes ONLY the 17 fictional ids listed below, by exact id.
-- Kept: every official SMU Athletics item (smu-*), every sourced SMU+ Staff story, boulevard-nights-1 (official ACC Huddle video),
-- and the 6 fictional recruiting/portal items (visit-weekend, recruiting-notebook, board-2028, building-roster, portal-primer,
-- trail-live), which stay behind MP.FEATURES.recruiting=false and are never shown.
-- No user tables are touched (watch_progress has no foreign key to content_items; nothing else references it).
-- Safe to re-run: a second run deletes 0 rows. Do NOT re-run RUN_ME_10 afterwards (it would re-insert the 5 Sample rows).
-- Expected: 59 rows before, 42 after.
begin;
delete from public.content_items
where id in (
  -- labeled "Sample" on the site until now
  'boulevard-nights-2', 'walk-on', 'film-pressure', 'film-screen', 'film-session-redzone',
  -- older fictional rows already swapped out of the site by bot/content-real, still in the table
  'hilltop-unfiltered', 'rivalry-week', 'five-am-laps', 'micd-setter', 'moody-opening',
  'coachs-corner-acc', 'thursday-notes', 'building-contender', 'film-rotation',
  'coachs-corner-pod', 'pony-up-pod', 'paddock-report'
);
select count(*) as content_items_after from public.content_items;
commit;
