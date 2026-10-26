# SMU+

Concept fan membership site for an SMU Cox class project. Not affiliated with or endorsed by SMU Athletics or Learfield.

Live: https://jacksonwalker1415.github.io/mustangs-plus/

- `index.html`: home page (game day strip, Continue Watching, Boulevard Brief signup)
- `library/`: content library with filters
- `recruiting/`: recruiting hub and transfer portal tracker (fictional names)
- `boards/`: The Mustang Board (message boards)
- `athletes/`: real SMU football player profiles and a comparison table
- `sports/<sport>/`: one page per sport program
- `assets/`: shared styles, data and scripts (no build step)
- `assets/photos/`: SMU Athletics photos, credited on the page
- `assets/brand/`: SMU+ logo (`smu-plus-logo.png`, the original file, favicons)

## Swapping the logo

The header and footer logo path is set once, in `assets/app.js`:

```js
var BRAND_LOGO='assets/brand/smu-plus-logo.png';
```

Replace that file, or point the variable at a new file. Set it to `''` to use the type-only SMU+ lockup.

## What is real

Stories, board users, recruits, portal names, prices and NIL figures are fictional sample data. The exceptions are the player profiles (public stats with sources on each page), the 2026 football schedule and scores (from smumustangs.com) and the photos (credited "Photo: SMU Athletics").
Colors follow SMU's published brand palette (SMU Red #CC0035, SMU Blue #354CA1).
