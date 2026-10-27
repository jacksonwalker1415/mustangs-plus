# From Socials: refreshing the feed

The page `socials/` reads `data/socials.json`, built by `tools/build_socials.py` from public X reads. Scripts can't call the
x MCP tools, so a refresh has three parts: **plan**, then **X reads** (made by the agent or routine), then **build**.

Inputs
- Account list: `/workspace/smu-media/from-socials-accounts.json` (curator list, ranked). Override with `SOCIALS_ACCOUNTS`.
- Raw reads: `/workspace/smu-media/socials-raw/`. Override with `SOCIALS_RAW`.

## Steps

0. Start clean: move the previous `posts-*.txt` and `lookup-*.txt` out of the raw dir (for example into `old/<date>/`).
   Keep `users.json` for now (plan reads user ids from it); step 2 overwrites it with a fresh read. Leftover files from accounts
   no longer on the list are ignored.
1. Plan
   ```
   python3 tools/build_socials.py plan > /tmp/socials-plan.jsonl
   ```
   One JSON line per read: `{"tool": ..., "args": {...}, "save": "posts-SMUFB.txt"}`. About 23 reads. If `users.json` is
   missing, the timeline lines carry `<id of @X ...>` placeholders: make the first read (`get_users_by_usernames`), save it
   as `users.json`, and run plan again.
2. X reads. For each line, call `CallDynamicTool` with namespace `x`, `toolName` = `tool`, `arguments` = `args`,
   `write_to_file: true`, then copy the result file to `<raw dir>/<save>`. Ids go inline (the x namespace does not accept
   `$file:` arguments). Limits: 30 reads a minute (pause 60 s after every 25 reads) and 1000 a day. The tool reports what's left.
3. Fill
   ```
   python3 tools/build_socials.py fill > /tmp/socials-fill.jsonl
   ```
   X sometimes drops `possibly_sensitive`, `entities` or `author_id`. This prints `get_posts_by_ids` reads (100 ids each) for
   those posts. Make them the same way, saving as `lookup-1.txt`, `lookup-2.txt`, ... It prints nothing when no re-read is needed.
4. Build
   ```
   python3 tools/build_socials.py build            # options: --cap 150 --per 12
   node tools/build_search.js                      # only if the page's search entry changed
   ```
   Writes `data/socials.json` and `data/x-avatars.json` and prints counts (posts, accounts, skipped replies/quotes/duplicates/sensitive).
5. Check `socials/` locally (feed loads, no console errors), then commit `data/socials.json` and `data/x-avatars.json`.

A full refresh is about 24-26 reads. Twice a day is about 50 of the 1000-a-day budget.

## Rules the builder applies
- Accounts: the curator's top 25 by rank. Anything flagged as excluded or held (possible minors, fan or NIL accounts, general
  news desks) is left out. So are the accounts in `DROP` (Counsel, Oct 27: @BillyEmbody, @Kevin8Jennings, @goodwin2026).
- Original posts only: replies, reposts and quote posts are skipped. Same-text duplicates are dropped.
- Posts flagged sensitive, or whose flag is still unknown after step 3, are skipped.
- Mixed-topic accounts (curator flag mentions a keyword filter: @Lassimak, @SportsDayDFW, @_tylerwelch) keep only posts
  that mention SMU (`SMU_WORDS`). Their read is a 14-day search for SMU words.
- At most 12 posts per account and 150 in total, newest first.
- Stored per post: id, handle, name, group, time, a text excerpt of up to 280 characters, and a paywall flag. No images,
  avatars, bios or like/repost counts. On the page each post is X's own embed. The excerpt shows until the embed loads, and
  everywhere if widgets.js can't load.
- Coach accounts (@rhettlashlee, @AdiaBarnes, @SamFish9) were checked against their X bios on Oct 27 as current SMU head
  coaches. Recheck when the curator list changes.
- Profile pictures (Counsel, Oct 27): only Writers-group accounts (writers and outlets) get an `av` URL, taken from this
  refresh's users read (`profile_image_url`, pbs.twimg.com only). Private or missing accounts and X's default picture get none,
  so the page shows initials. Official, team and coach accounts never get one. The page hotlinks the URL; nothing is downloaded.
  Accounts in `NO_AVATAR` never get one (Counsel, Oct 27: @SMUMustangsOn3, whose red mustang reads as SMU's logo).
  `data/x-avatars.json` carries the same URLs for the home page's "Conference and beat coverage" row; that row is initials
  only for now (On3 is in NO_AVATAR; theACC and accnetwork are ACC logos), so it shows no pictures and no note. If a writer's picture becomes an
  SMU, team or ACC logo, move that account out of the Writers group or ask Counsel before shipping.
