# SMU+

Concept fan membership site for an SMU Cox class project. Not affiliated with or endorsed by SMU Athletics or Learfield.

Live: https://fanplatformdemo.com/ (the old https://jacksonwalker1415.github.io/mustangs-plus/ URL redirects here)

- `index.html`: home page (game day strip, Continue Watching, SMU+ Weekly signup)
- `library/`: content library with filters
- `recruiting/`: recruiting hub and transfer portal tracker (fictional names)
- `boards/`: The Mustang Board (message boards)
- `athletes/`: real SMU football player profiles and a comparison table
- `account/`: sign in, membership (demo checkout), saved players, Continue Watching, Brief
- `404.html`, `robots.txt`, `sitemap.xml`, `manifest.webmanifest`: hosting extras
- `sports/<sport>/`: one page per sport program
- `assets/`: shared styles, data and scripts (no build step)
  - `config.js`: Supabase URL and anon key (empty = demo mode)
  - `sb.js`: the data layer (Supabase when configured, this browser's storage otherwise)
  - `real.js`: real schedules, results, rosters and coaches for the 11 non-football sports, from smumustangs.com
- `supabase/`: `schema.sql` (tables + Row Level Security) and `seed.sql` (boards and sample content)
- `assets/photos/`: SMU Athletics photos, credited on the page
- `assets/brand/`: SMU+ logo (`smu-plus-logo.png`, the original file, favicons)

## Accounts and the database

See [SETUP.md](SETUP.md) to connect a Supabase project. Until then the site runs in demo mode: accounts, posts and memberships are saved only in the visitor's browser. Checkout is a labeled demo in both modes; no payment is ever taken.

## Swapping the logo

The header and footer logo path is set once, in `assets/app.js`:

```js
var BRAND_LOGO='assets/brand/smu-plus-logo.png';
```

Replace that file, or point the variable at a new file. Browsers that support WebP load the `.webp` file with the same name first (`smu-plus-logo.webp`), so replace both. Set it to `''` to use the type-only SMU+ lockup.

## What is real

Stories, board users, recruits, portal names, prices and NIL figures are fictional sample data. The exceptions are the player profiles (public stats with sources on each page), the 2026 football schedule and scores, and the schedules, results, rosters and head coaches for the other 11 sports (all from smumustangs.com, checked Oct. 25, 2026, with source links on each page) and the photos (credited "Photo: SMU Athletics").
Colors follow SMU's published brand palette (SMU Red #CC0035, SMU Blue #354CA1).
