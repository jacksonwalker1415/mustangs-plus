# DRAFT: NOT FOR PUBLICATION

**Men's soccer: SMU vs. Louisville. Post-game recap template.**
Fri., Oct. 30, 2026 · 6:30 p.m. CT · ACC Network · Washburne Soccer and Track Stadium, Dallas · Senior Day (schedule [C])

- **Status:** template only. This file is not loaded by any page and nothing in it appears on the site. Nothing has been added to `assets/content.js`.
- **Pregame facts checked:** Mon., Oct. 26, 2026, 4:30 a.m. CT, against the official sources below. No newer official men's soccer ranking or stats had been posted since the Oct. 24–25 stories. Re-check the ranking lines before publishing if a new poll comes out this week.

## Rules

1. Every `[BRACKETED]` item is a placeholder. Every result, score, stat, record, standing and ranking after kickoff is a placeholder. Fill each one from the official recap or box score and cite it, or delete the sentence.
2. Never invent or estimate a number. Don't work out standings, tiebreakers or seeding from the table yourself. Use them only as SMU Athletics or theacc.com states them.
3. **No quotes.** Don't add quotes from coaches or players.
4. Delete the result versions that didn't happen.

## Sources (pregame)

- [A] SMU Athletics, Oct. 25: "Mustangs Are ACC Champions, Clinch A Share Of Regular Season Title": https://smumustangs.com/news/2026/10/25/mens-soccer-no-1-smu-clinches-a-share-of-acc-regular-season-title
- [B] SMU Athletics, Oct. 24: "No. 1 SMU Wins 2-0 At Cal, Grabs 10th Clean Sheet Of The Season": https://smumustangs.com/news/2026/10/24/mens-soccer-no-1-smu-wins-2-0-at-cal-grabs-10th-clean-sheet-of-the-season
- [C] SMU Athletics 2026 men's soccer schedule: https://smumustangs.com/sports/mens-soccer/schedule/2026
- [D] Post-game, add: the SMU Athletics recap of this match ([RECAP URL]) and the official box score ([BOX SCORE URL]).

## Pregame context (sourced; true as of Oct. 26)

- SMU is listed as No. 1 by SMU Athletics. [A][B]
- SMU is 12-0-2 overall and 6-0-1 in the ACC. [B]
- It's 5-0-0 on the road, its first regular season with every road match won since 2019. [B]
- SMU has kept 10 clean sheets this season. The latest was the 2-0 win at Cal on Oct. 24. [B]
- SMU went into the final week top of the ACC standings with 19 points. [B]
- With the Cal win SMU clinched at least a share of the 2026 ACC regular-season title. [A]
  - It's the first ACC regular-season title for any SMU program. [A]
  - Kevin Hudson's team won the 2025 ACC Tournament, and per SMU Athletics it is the first to bring home both the regular-season and the tournament title. [A]
- SMU was one point ahead of No. 3 Clemson going into the weekend. Clemson then drew Virginia Tech, which left SMU three points clear with one week left. [A]
- SMU has a chance to win the title outright at home on the last day of the regular season. [A] The source doesn't say what result SMU needs, so don't state one.
- Louisville is ranked No. 10 (per SMU Athletics). This is the regular-season finale and Senior Day at Washburne ("Blackout Washburne!"). [A][B][C]
- Through Cal, Ryan Clanton-Pimentel had nine assists this season. Jaylinn Mitchell led the team in goal contributions with 10 (three goals, seven assists). [B]

## LIB card (fill in, then paste into `cards` only after the match)

```js
{id:'recap-msoc-louisville',t:'article',cat:'insider',label:"Men's Soccer · Recap",title:'[HEADLINE]',desc:'[ONE SENTENCE: FINAL SCORE; ACC TITLE OUTRIGHT OR SHARED, AS STATED BY SMU ATHLETICS]',dur:'2 min read',lock:false,tone:'black',big:'[FINAL RECORD]',isNew:true}
```

## Article

```js
MP.ARTICLES['recap-msoc-louisville']={by:'SMU+ Staff',date:'[DATE PUBLISHED]',sourced:true,
 sources:[['SMU Athletics recap: SMU vs. Louisville, Oct. 30','[RECAP URL]'],['Official box score','[BOX SCORE URL]'],['SMU Athletics: Mustangs are ACC champions, clinch a share of regular-season title (Oct. 25)','https://smumustangs.com/news/2026/10/25/mens-soccer-no-1-smu-clinches-a-share-of-acc-regular-season-title'],['SMU Athletics: No. 1 SMU wins 2-0 at Cal (Oct. 24)','https://smumustangs.com/news/2026/10/24/mens-soccer-no-1-smu-wins-2-0-at-cal-grabs-10th-clean-sheet-of-the-season'],['SMU Athletics 2026 men\'s soccer schedule','https://smumustangs.com/sports/mens-soccer/schedule/2026']],
 dek:'[DEK: FINAL SCORE; FINAL REGULAR-SEASON RECORD; ACC TITLE OUTRIGHT OR SHARED (AS STATED BY SMU ATHLETICS); WHAT COMES NEXT]',
 related:['recap-syracuse','smu-msoc-cal-highlights','smu-msoc-duke-highlights'],body:[
 "[LEDE: FINAL SCORE: SMU [X], No. 10 Louisville [Y]. Goal scorers and minutes, from the box score.]",
 "SMU went into Senior Day at Washburne at 12-0-2, unbeaten in 14 matches, with 10 clean sheets. It had already clinched at least a share of the ACC regular-season title on Oct. 25, the first in school history, and was three points clear at the top of the table.",
 /* WIN version: */
 "[WIN: The win finishes the regular season unbeaten at [RECORD] overall and [ACC RECORD] in the ACC.]",
 /* DRAW version: */
 "[DRAW: The draw keeps the regular season unbeaten at [RECORD] overall and [ACC RECORD] in the ACC.]",
 /* LOSS version: */
 "[LOSS: The loss was SMU's first of the season. The Mustangs finish the regular season at [RECORD] overall and [ACC RECORD] in the ACC.]",
 "[TITLE: OUTRIGHT OR SHARED ACC REGULAR-SEASON CHAMPION, ONLY AS STATED BY SMU ATHLETICS OR THEACC.COM.]",
 "[ONLY IF TRUE: CLEAN SHEET NUMBER [N]; GOALKEEPER AND SAVES FROM THE BOX SCORE.]",
 "[KEY STAT: SHOTS / SHOTS ON GOAL OR ONE NUMBER THE OFFICIAL RECAP HIGHLIGHTS. SOURCE: BOX SCORE.]",
 "[NEXT: ACC TOURNAMENT SEED, OPPONENT, DATE, TIME AND TV, FROM THE OFFICIAL SCHEDULE OR THEACC.COM ONCE POSTED.]"]};
```

## Publishing (after the match, admin)

1. Fill every placeholder from [D] and delete the versions that didn't happen.
2. Paste the card and the article into `assets/content.js`. In `MP.ACCESS['mens-soccer']`, replace `'preview-msoc-louisville'` with `'recap-msoc-louisville'`.
3. Bump `?v=` (admin, via build_pages.py).
