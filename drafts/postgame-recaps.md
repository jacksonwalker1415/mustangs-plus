# Post-game recap drafts: NOT LIVE

**Status:** drafts, ready to fill. This file is not loaded by any page; nothing here appears on the site.
**Owner:** Content lane. Prepared Oct. 26, 2026.

## Rules for filling these in

1. Every `[BRACKETED]` item is a placeholder. Do not publish until every placeholder is replaced with a fact from the cited source, or the sentence is deleted.
2. Never invent scores, stats or results. If a number isn't in the official recap, box score or schedule, leave it out.
3. No quotes from real coaches or players unless they are copied exactly from the official SMU Athletics recap and credited. Default is no quotes.
4. Sources: the SMU Athletics recap for that game, the official box score (Game Center) and the 2026 schedule page. Add each one to `sources`.
5. Pre-written sentences below are true as of Oct. 26, 2026 (sourced in the live previews). Re-check them against the final box score before publishing.
6. Write two versions only where the result changes the meaning (a win paragraph and a loss paragraph). Delete the one that didn't happen.

## How to publish (after the game)

1. Paste the LIB card into the `cards` array next to the matching preview in `assets/content.js`, and paste the `MP.ARTICLES` entry below the preview's article.
2. In `MP.ACCESS`, replace the preview's id with the recap's id (football: `'preview-syracuse'` becomes `'recap-syracuse'`; men's soccer: `'preview-msoc-louisville'` becomes `'recap-msoc-louisville'`).
3. Each preview already carries `expires` (its kickoff time). Once the admin applies `admin-edits/expiring-previews.patch` to `app.js`, the preview drops out of lists at kickoff on its own. Until then, remove it from `MP.ACCESS` by hand when the recap goes up.
4. Bump the `?v=` cache-bust (admin, via build_pages.py).

---

## 1) Football: SMU at Syracuse (Sat., Oct. 31, 11 a.m. CT, ESPN2)

**Facts already true (sourced in `preview-syracuse`):**
- SMU went into the game 6-1 overall and 4-1 in the ACC, on a four-game win streak since the 41-31 loss at Louisville on Sept. 19.
- It was SMU's only road game in a seven-week stretch: six of seven games at Gerald J. Ford Stadium.
- SMU was 1-1 on the road before this game: 27-24 at Florida State and the loss at Louisville.
- Kevin Jennings took 74 career touchdown passes, the SMU record, into the game.
- Kendrick Raphael had back-to-back 100-yard games (119 vs. Virginia, 104 vs. Cal) and 641 rushing yards with eight rushing TDs.
- The last meeting was Oct. 4, 2025, in Dallas, a 31-18 SMU win.
- Next: Virginia Tech at Ford Stadium, Fri., Nov. 6, 6 p.m. CT, ESPN (Wear Blue); then Wake Forest on Nov. 14 (Homecoming and Senior Day).

**LIB card (paste into `cards`):**

```js
{id:'recap-syracuse',t:'article',cat:'insider',label:'Game Recap',title:'[HEADLINE: one line, built on the result]',desc:'[ONE-SENTENCE SUMMARY: final score, the turning point]',dur:'3 min read',lock:false,tone:'blue',big:'[SMU SCORE]-[CUSE SCORE]',isNew:true}
```

**Article (paste below the preview's article):**

```js
MP.ARTICLES['recap-syracuse']={by:'SMU+ Staff',date:'[DATE PUBLISHED]',sourced:true,
 sources:[['SMU Athletics recap: SMU at Syracuse, Oct. 31','[RECAP URL]'],['Official box score','[GAME CENTER / BOX SCORE URL]'],['SMU Athletics 2026 football schedule','https://smumustangs.com/sports/football/schedule/2026']],
 dek:'[DEK: final score, record after the game, what comes next]',
 related:['recap-cal','feature-jennings-record','feature-raphael'],body:[
 "[LEDE: the final score and the one play or stretch that decided it. FINAL SCORE: SMU [X], Syracuse [Y].]",
 "SMU went north on a four-game win streak, and this was its only road game in a seven-week run of home dates at Ford Stadium.",
 /* WIN version (delete if SMU lost): */
 "The win made it five straight. SMU is now [RECORD: 7-1] overall and [ACC RECORD: 5-1] in the ACC, and [ROAD RECORD: 2-1] away from Ford this season.",
 /* LOSS version (delete if SMU won): */
 "The loss ended a four-game win streak. SMU is now [RECORD: 6-2] overall and [ACC RECORD: 4-2] in the ACC, and [ROAD RECORD: 1-2] away from Ford this season.",
 "[KEY STAT: Jennings passing line, comp-att, yards, TD, INT. Source: box score.] He came in with an SMU-record 74 career touchdown passes; [CAREER TD TOTAL AFTER THE GAME: 74 + TD passes in this game, check against the recap].",
 "[KEY STAT: Raphael rushing line, carries-yards-TDs. Source: box score.] [ONLY IF TRUE: a third straight 100-yard game.]",
 "[KEY STAT: one defensive or special-teams number that mattered, e.g. turnovers, sacks or third-down stops. Source: box score.]",
 "[HALF-BY-HALF: halftime score and how the second half went, from the scoring summary.]",
 "Next: SMU comes home to stay. Virginia Tech visits Ford Stadium on Friday, Nov. 6 (6 p.m. CT, ESPN; Wear Blue), and Wake Forest follows on Nov. 14 for Homecoming and Senior Day."]};
```

**Video:** if SMU Athletics posts "SMU Football: Highlights at Syracuse" on @SMUMustangs, verify the ID with oEmbed (author_name "SMU Mustangs") and add it as a `V(...)` card next to the other official videos. Do not use clips from any other channel.

---

## 2) Men's soccer: SMU vs. Louisville (Fri., Oct. 30, 6:30 p.m. CT, ACC Network, Washburne Soccer & Track Stadium)

**Facts already true (sourced in `preview-msoc-louisville`):**
- SMU went in 12-0-2 overall and 6-0-1 in the ACC, unbeaten through 14 matches, and listed at No. 1 by SMU Athletics since early October.
- SMU had allowed five goals, kept 10 clean sheets (the latest a 2-0 win at Cal on Oct. 24) and scored 41 goals.
- It was the last match of SMU's regular season, at home, on senior day, against No. 10 Louisville.
- On Oct. 25 SMU clinched at least a share of the 2026 ACC regular-season title: the first ACC regular-season title in school history, and the first SMU team to win both the regular-season title and the ACC Tournament (2025). SMU went into the final week three points clear at the top of the ACC table, with a chance to win the title outright at home. Source: https://smumustangs.com/news/2026/10/25/mens-soccer-no-1-smu-clinches-a-share-of-acc-regular-season-title

**LIB card:**

```js
{id:'recap-msoc-louisville',t:'article',cat:'insider',label:"Men's Soccer · Recap",title:'[HEADLINE]',desc:'[ONE-SENTENCE SUMMARY: final score, regular-season record, and whether the ACC title is outright or shared, as stated by SMU Athletics]',dur:'2 min read',lock:false,tone:'black',big:'[FINAL RECORD, e.g. 13-0-2]',isNew:true}
```

**Article:**

```js
MP.ARTICLES['recap-msoc-louisville']={by:'SMU+ Staff',date:'[DATE PUBLISHED]',sourced:true,
 sources:[['SMU Athletics recap: SMU vs. Louisville, Oct. 30','[RECAP URL]'],['SMU Athletics: Mustangs are ACC champions, clinch a share of regular-season title (Oct. 25)','https://smumustangs.com/news/2026/10/25/mens-soccer-no-1-smu-clinches-a-share-of-acc-regular-season-title'],['Official box score','[BOX SCORE URL]'],['SMU Athletics 2026 men\'s soccer schedule','https://smumustangs.com/sports/mens-soccer/schedule/2026']],
 dek:'[DEK: final score, final regular-season record, ACC title (outright or shared, as stated by SMU Athletics), what comes next]',
 related:['recap-syracuse','smu-msoc-cal-highlights','vb-road-sweep'],body:[
 "[LEDE: FINAL SCORE: SMU [X], Louisville [Y]. Who scored and when, from the box score.]",
 "SMU came into the senior-day finale against No. 10 Louisville unbeaten in 14 matches, 12-0-2, with 10 clean sheets and five goals allowed all season. It had already clinched at least a share of the ACC regular-season title on Oct. 25, the first in school history, and was three points clear at the top of the table.",
 /* WIN version: */
 "The win finishes the regular season unbeaten: [RECORD: 13-0-2] overall and [ACC RECORD: 7-0-1] in the ACC.",
 /* DRAW version: */
 "The draw keeps the regular season unbeaten: [RECORD: 12-0-3] overall and [ACC RECORD: 6-0-2] in the ACC.",
 /* LOSS version: */
 "The loss was SMU's first of the season. The Mustangs finish the regular season [RECORD: 12-1-2] overall and [ACC RECORD: 6-1-1] in the ACC.",
 "[ONLY IF TRUE: clean sheet number 11, goalkeeper's name and saves from the box score.]",
 "[KEY STAT: shots/shots on goal or another number the recap highlights. Source: box score.]",
 "[TITLE: outright or shared ACC regular-season champion, and ACC Tournament seeding, ONLY as stated by SMU Athletics or theacc.com. Do not work it out from the table ourselves. Note it is the program's first ACC regular-season title (source above).]",
 "[NEXT: postseason opponent, date, time and TV, from the official schedule once it's posted.]"]};
```

---

## Not covered here

- `vb-road-sweep` also goes stale this weekend ("Up next: at NC State on Fri., Oct. 30 … at Wake Forest on Sun., Nov. 1"). Suggest `expires:'2026-11-01T12:00:00-06:00'` on its card (Wake Forest first serve; after DST ends). I did not add it because it isn't a preview; your call.
