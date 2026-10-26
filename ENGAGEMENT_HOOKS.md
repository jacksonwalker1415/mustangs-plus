# Engagement hooks (proposed, not applied)

The engagement feature lives entirely in new files on `bot/engagement-foundation`. These are the small edits to existing files it would need to be reachable from the rest of the site. **None of them are applied.** The admin owns these files, so apply them (or not) on main.

## 1. Apply the SQL (admin only, in this order)

1. `supabase/boards_stats.sql` (from `bot/engagement-boards-stats`, if not already applied)
2. `supabase/engagement.sql`. This is safe to re-run. It seeds the 7 real 2026 home games and the demo rewards catalog.
3. Make someone gate staff so the gate screen can show the live code:
   `insert into public.gate_staff (user_id) select id from auth.users where email = '<staff email>';`

Heads-up on `engagement.sql`:
- It adds student columns to `profiles` and switches `profiles` from table-wide SELECT to column SELECT on `(id, display_name, created_at)` for anon/authenticated, so `is_student`, `class_year`, etc. stay private. The site only selects `display_name` (thread and post author joins), so existing pages are unaffected. I checked this against the boards in live mode on a local PostgREST. If anything ever does `profiles.select('*')`, it will need to name its columns.
- Until it's applied, the engagement pages detect the missing `rewards` table and run as a labeled browser-only demo, even when the site is live. That probe shows one 404 in the console.
- Tests: `PGPORT=<port> supabase/tests/engagement_test.sh` against a throwaway Postgres (57 checks).

## 2. Nav link (assets/app.js, NAV)

Adds "Students" to the header and mobile menu. All engagement pages use `data-page="engage"`, so the link highlights on them. Please re-check header wrapping at 1024–1280px after adding a 7th link.

## 3. Account page panel (assets/app.js, account())

A static card between Membership and Saved players linking to `student/` and `leaderboard/`. It doesn't load engage.js.

## 4. Sitemap (sitemap.xml)

Adds `student/`, `checkin/`, `leaderboard/` and `rewards/`. The gate screen (`checkin/gate/`) is left out on purpose and carries `<meta name="robots" content="noindex">`.

```diff
diff --git a/assets/app.js b/assets/app.js
index 3f89d17..5a73305 100644
--- a/assets/app.js
+++ b/assets/app.js
@@ -82,7 +82,7 @@
   syncMember();
 
   /* ---------- Shell ---------- */
-  var NAV=[['Watch',libUrl(),'library'],['Recruiting',ROOT+'recruiting/','recruiting'],['Sports',ROOT+'#sports','sport'],['Boards',ROOT+'boards/','boards'],['Athletes',ROOT+'athletes/','athlete'],['Membership',ROOT+'#membership','membership']];
+  var NAV=[['Watch',libUrl(),'library'],['Recruiting',ROOT+'recruiting/','recruiting'],['Sports',ROOT+'#sports','sport'],['Boards',ROOT+'boards/','boards'],['Athletes',ROOT+'athletes/','athlete'],['Students',ROOT+'student/','engage'],['Membership',ROOT+'#membership','membership']];
   function navLinks(){return NAV.map(function(n){var on=PAGE===n[2];return '<a href="'+n[1]+'"'+(on?' class="on" aria-current="page"':'')+'>'+n[0]+'</a>'}).join('')}
   /* Header/footer logo. ONE swappable path (relative to the site root). Set to '' to fall back to the type-only SMU+ lockup. */
   var BRAND_LOGO='assets/brand/smu-plus-logo.png';
@@ -828,6 +828,7 @@
           '<div class="acct-card"><h2 class="acct-h">Membership</h2><p class="acct-tier"><b>'+TIER_NAME[tier]+'</b>'+(tier!=='free'?' \u00b7 $'+TIER_PRICE[tier]+'/mo (demo)':'')+'</p>'+
             '<div class="acct-plans">'+['mustang','pony','club'].map(function(t){return '<button type="button" class="btn btn-sm '+(t===tier?'btn-navy':'btn-outline')+'" data-plan="'+t+'"'+(t===tier?' aria-current="true" disabled':'')+'>'+TIER_NAME[t]+'</button>'}).join('')+'</div>'+
             (tier!=='free'?'<button type="button" class="linkish" id="cancelPlan">Cancel demo membership</button>':'')+'<p class="acct-meta">Checkout is a demo. No card is ever charged on this concept site.</p></div>'+
+          '<div class="acct-card"><h2 class="acct-h">Student points</h2><p class="acct-meta">Current SMU student? Verify with your @smu.edu email to earn points for checking in at home games, then spend them on concessions, gear and better seats. Demo, no cash value, not a real ticket.</p><a class="btn btn-outline btn-sm" href="'+ROOT+'student/">Student points</a> <a class="btn btn-outline btn-sm" href="'+ROOT+'leaderboard/">Leaderboard</a></div>'+
           '<div class="acct-card"><h2 class="acct-h">Saved players</h2>'+(saved.length?'<ul class="acct-list">'+saved.map(function(a){return '<li><a href="'+athleteUrl(a.id)+'"><b>'+esc(a.name)+'</b><small>#'+a.num+' \u00b7 '+a.pos+'</small></a><button type="button" class="linkish" data-save-athlete="'+a.id+'" aria-pressed="true"><span>Saved</span></button></li>'}).join('')+'</ul>':'<p class="acct-empty">No saved players yet. Tap <b>Save player</b> on any <a href="'+ROOT+'athletes/">player profile</a>.</p>')+'</div>'+
           '<div class="acct-card"><h2 class="acct-h">Continue watching</h2>'+(h.length?'<ul class="acct-list">'+h.map(function(x){var c=LIBBY[x.id];return '<li><a href="'+libUrl()+itemHref(c)+'"><b>'+esc(c.title)+'</b><small>'+Math.round(x.p*100)+'% \u00b7 '+(VERB[c.t]||'Open')+'</small></a></li>'}).join('')+'</ul>':'<p class="acct-empty">Nothing in progress. Start something in the <a href="'+libUrl()+'">library</a>.</p>')+
             '<p class="acct-meta">'+(SMU.live?'Synced to your account across devices.':'Saved in this browser.')+'</p></div>'+
diff --git a/sitemap.xml b/sitemap.xml
index e42cfb8..f0afc5c 100644
--- a/sitemap.xml
+++ b/sitemap.xml
@@ -18,4 +18,8 @@
   <url><loc>https://jacksonwalker1415.github.io/mustangs-plus/sports/volleyball/</loc><lastmod>2026-10-26</lastmod></url>
   <url><loc>https://jacksonwalker1415.github.io/mustangs-plus/sports/womens-basketball/</loc><lastmod>2026-10-26</lastmod></url>
   <url><loc>https://jacksonwalker1415.github.io/mustangs-plus/sports/womens-soccer/</loc><lastmod>2026-10-26</lastmod></url>
+  <url><loc>https://jacksonwalker1415.github.io/mustangs-plus/student/</loc><lastmod>2026-10-26</lastmod></url>
+  <url><loc>https://jacksonwalker1415.github.io/mustangs-plus/checkin/</loc><lastmod>2026-10-26</lastmod></url>
+  <url><loc>https://jacksonwalker1415.github.io/mustangs-plus/leaderboard/</loc><lastmod>2026-10-26</lastmod></url>
+  <url><loc>https://jacksonwalker1415.github.io/mustangs-plus/rewards/</loc><lastmod>2026-10-26</lastmod></url>
 </urlset>
```

## 5. Build script (mustangs-plus-tools/build_pages.py)

No change needed if it globs `**/*.html`. The new pages copy the current `?v=` for shared files (`site.css`, `app.js`, etc.). The new files use `?v=eng1` (`engage.css`, `engage.js`, `engage-pages.js`, `vendor/qrcode.js`). If the build regex only rewrites numeric tokens, `eng1` stays put; switch it to the main token when you next bump the cache-bust.

## 6. Optional, later

- Home page game-day strip: a "Students: check in" link to `checkin/` on home games.
- `README.md`: list the new folders and `supabase/engagement.sql` (I left README alone).
