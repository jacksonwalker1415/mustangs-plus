# tools/

Build and fetch scripts for SMU+ live here. One data file is deliberately **not** produced by any script:

## data/around-the-web.json (edited by hand)

The home page "Around the Web" strip reads this file. It is edited by hand only: no script, routine or bot fetches or rewrites it, and nothing on the site fetches outside stories.

- Fields per item: `title` (copied exactly from the publisher), `source` (plain text, no logos), `url` (the original story; opens in a new tab), `published` (ISO date or date-time; a date alone shows as that date), `summary` (one neutral line we write ourselves from the headline or the story's free text, never from behind a paywall), `paywalled` (true adds a "Subscriber story" tag).
- 5 items at most, newest first. An empty `items` list hides the module.
- `contact` is the removal-request email. It is a placeholder (empty) until Jackson picks the project address; while empty, the removal line is hidden and the module still shows. Removals are promised within 2 business days.
- On3 and 247Sports: their terms ban automation, so no bot may fetch them. Only links Jackson picks by hand.
- Counsel guardrails: no thumbnails or images, no SMU logos, no "partners" or "powered by" wording, keep it away from Join buttons and ads, and leave out tragedy and crime coverage.
