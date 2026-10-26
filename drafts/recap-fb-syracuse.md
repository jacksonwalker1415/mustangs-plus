# DRAFT: NOT FOR PUBLICATION

**Football: SMU at Syracuse. Post-game recap template.**
Sat., Oct. 31, 2026 · 11 a.m. CT (noon ET) · ESPN2 · Radio: KTCK 96.7 FM/1310 AM & SiriusXM · JMA Wireless Dome, Syracuse, N.Y. [A][B]

- **Status:** template only. This file is not loaded by any page and nothing in it appears on the site. Nothing has been added to `assets/content.js`.
- **Pregame facts checked:** Mon., Oct. 26, 2026, 4:30 a.m. CT, against the official sources below, including the Oct. 25 AP and coaches polls.

## Rules

1. Every `[BRACKETED]` item is a placeholder. Every result, score, stat, record and ranking after kickoff is a placeholder. Fill each one from the official recap, box score or game notes and cite it, or delete the sentence.
2. Never invent, estimate or add up a number yourself. Career totals after the game come only from SMU's postgame notes.
3. **No quotes.** Don't add quotes from coaches or players.
4. Delete the result version that didn't happen.

## Sources (pregame)

- [A] SMU Athletics 2026 football schedule: https://smumustangs.com/sports/football/schedule/2026
- [B] SMU Athletics, Oct. 24: "Dominating Second Half Leads SMU To 59-20 Win Over Cal" (AP recap and SMU postgame notes): https://smumustangs.com/news/2026/10/24/football-dominating-second-half-leads-smu-to-59-20-win-over-cal
- [C] SMU Athletics, Oct. 25: "SMU Rises To 19th In AP Poll": https://smumustangs.com/news/2026/10/25/football-smu-rises-to-19th-in-ap-poll
- [D] SMU Athletics 2026 football cumulative stats: https://smumustangs.com/sports/football/stats/2026
- [E] SMU Athletics 2025 football schedule: https://smumustangs.com/sports/football/schedule/2025
- [F] SMU Athletics, Oct. 21: "Lashlee Added To Paul 'Bear' Bryant Coach Of The Year Watch List": https://smumustangs.com/news/2026/10/21/football-lashlee-added-to-paul-bear-bryant-coach-of-the-year-watch-list
- [G] Post-game, add: the SMU Athletics recap and postgame notes ([RECAP URL]) and the official box score ([BOX SCORE URL]).

## Pregame context (sourced; true as of Oct. 26)

- **Rankings:** SMU is No. 19 in the AP Top 25 and No. 16 in the US LBM Coaches Poll (Oct. 25). It has been in the AP poll every week of 2026, its longest streak since 1985. [C]
- **Record:** SMU is 6-1 overall and 4-1 in the ACC. [B][D]
  - Its four straight wins since the 31-41 loss at Louisville on Sept. 19 are Missouri State, Boston College, Virginia and Cal. [D]
  - It's 1-1 on the road: a 27-24 win at Florida State on Sept. 7, and the Louisville loss. [A][D]
- **Last game:** SMU beat Cal 59-20 on Oct. 24.
  - SMU trailed 20-17 at halftime, then outscored Cal 42-0 in the second half and held the Bears to 50 yards. [B][C]
  - SMU had 306 of its 492 total yards after halftime. [B]
- **Schedule:** Syracuse is SMU's only road game in a seven-week stretch. [B]
- **Kevin Jennings:**
  - He holds SMU's career record with 74 touchdown passes, set against Cal. [B]
  - His 2026 line is 156 of 215 for 2,062 yards, 19 touchdowns and five interceptions. [D]
  - He's 25-8 as SMU's starter. [B]
- **Kendrick Raphael:**
  - He ran 22 times for 104 yards and scored three touchdowns (two rushing, one receiving) against Cal. [B]
  - It was his second straight 100-yard game and his third of the season. [B]
- **ACC and home record:** since joining the ACC in 2024, SMU is 11-0 at home and 18-3 overall in ACC games (AP, via [B]).
- **Coach:** Rhett Lashlee was named to the 2026 Paul "Bear" Bryant National Coach of the Year watch list on Oct. 21. [F]
- **Last meeting:** Oct. 4, 2025, at Gerald J. Ford Stadium. SMU won 31-18. [E]
- **After Syracuse:** [A]
  - Virginia Tech at Ford Stadium, Fri., Nov. 6, 6 p.m. CT, ESPN ("Club Takeaway - Wear Blue!")
  - Wake Forest at Ford Stadium, Sat., Nov. 14, time TBD (Homecoming, Senior Day)
  - At Notre Dame, Nov. 21, 6:30 p.m. CT, NBC and Peacock
  - At Stanford, Nov. 28, time TBD

## LIB card (fill in, then paste into `cards` only after the game)

```js
{id:'recap-syracuse',t:'article',cat:'insider',label:'Game Recap',title:'[HEADLINE]',desc:'[ONE SENTENCE: FINAL SCORE AND THE TURNING POINT]',dur:'3 min read',lock:false,tone:'blue',big:'[SMU SCORE]-[CUSE SCORE]',isNew:true}
```

## Article

```js
MP.ARTICLES['recap-syracuse']={by:'SMU+ Staff',date:'[DATE PUBLISHED]',sourced:true,
 sources:[['SMU Athletics recap and postgame notes: SMU at Syracuse, Oct. 31','[RECAP URL]'],['Official box score','[BOX SCORE URL]'],['SMU Athletics: SMU rises to 19th in AP poll (Oct. 25)','https://smumustangs.com/news/2026/10/25/football-smu-rises-to-19th-in-ap-poll'],['SMU Athletics 2026 football schedule','https://smumustangs.com/sports/football/schedule/2026']],
 dek:'[DEK: FINAL SCORE; RECORD AFTER THE GAME; WHAT COMES NEXT]',
 related:['recap-cal','feature-jennings-record','feature-raphael'],body:[
 "[LEDE: FINAL SCORE: No. 19 SMU [X], Syracuse [Y]. The one play or stretch that decided it, from the official recap.]",
 "SMU went north at 6-1, ranked No. 19 by the AP and No. 16 in the coaches poll, on a four-game win streak. It was the Mustangs' only road game in a seven-week stretch.",
 /* WIN version: */
 "[WIN: The win made it [N] straight. SMU is now [RECORD] overall, [ACC RECORD] in the ACC and [ROAD RECORD] on the road.]",
 /* LOSS version: */
 "[LOSS: The loss ended a four-game win streak. SMU is now [RECORD] overall, [ACC RECORD] in the ACC and [ROAD RECORD] on the road.]",
 "[JENNINGS: COMP-ATT, YARDS, TD, INT FROM THE BOX SCORE. CAREER TD PASS TOTAL ONLY AS STATED IN SMU'S POSTGAME NOTES. He came in with the SMU record of 74.]",
 "[RAPHAEL: CARRIES-YARDS-TDS FROM THE BOX SCORE. ONLY IF THE NOTES SAY SO: A THIRD STRAIGHT 100-YARD GAME.]",
 "[ONE DEFENSIVE OR SPECIAL-TEAMS NUMBER THE OFFICIAL RECAP HIGHLIGHTS. SOURCE: BOX SCORE.]",
 "[HALF-BY-HALF: HALFTIME SCORE AND HOW THE SECOND HALF WENT, FROM THE SCORING SUMMARY.]",
 "Next, SMU plays two at Gerald J. Ford Stadium: Virginia Tech on Friday, Nov. 6 (6 p.m. CT, ESPN), then Wake Forest on Nov. 14 for Homecoming and Senior Day. It closes the regular season at Notre Dame (Nov. 21) and at Stanford (Nov. 28)."]};
```

## Video

If SMU Athletics posts "SMU Football: Highlights at Syracuse" on @SMUMustangs, verify the video ID with oEmbed (author_name "SMU Mustangs") before adding it. Use no clips from any other channel.

## Publishing (after the game, admin)

1. Fill every placeholder from [G] and delete the version that didn't happen. Refresh the rankings line only if the article runs after the next poll.
2. Paste the card and the article into `assets/content.js`. In `MP.ACCESS['football']`, replace `'preview-syracuse'` with `'recap-syracuse'`.
3. Bump `?v=` (admin, via build_pages.py).
