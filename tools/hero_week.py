#!/usr/bin/env python3
"""Set the home hero of the week (desktop/tablet h1 + the featured card beside it).

Oct 29 (Jackson): the home hero is now a slideshow of the week's most watched videos (app.js heroShow) with no headline.
line1/line2 are no longer shown anywhere; MP.HERO.item is only the fallback slide if data/videos-feed.json has no counts.

Rewrites only the block between /* HERO-WEEK:BEGIN */ and /* HERO-WEEK:END */ in assets/content.js.
app.js renders the h1 from MP.HERO.line1/line2 and the card from MP.HERO.item, so they always match.

  python3 tools/hero_week.py --week 2026-11-02 --line1 "Short line." --line2 "Second line." \
      --item smu-fb-syracuse-highlights --source https://smumustangs.com/news/...
  python3 tools/hero_week.py --show

The item must already exist as an id:'...' in assets/content.js (add a V(...) library entry first if needed).
"""
import argparse, json, re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
CONTENT = ROOT / 'assets' / 'content.js'
BLOCK = re.compile(r"(/\* HERO-WEEK:BEGIN \*/\n)(.*?)(\n\s*/\* HERO-WEEK:END \*/)", re.S)

def js(s):
    return json.dumps(s, ensure_ascii=False).replace("'", "\\'")[1:-1].join("''")

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--show', action='store_true')
    for k in ('week', 'line1', 'line2', 'item', 'source'):
        ap.add_argument('--' + k)
    a = ap.parse_args()
    src = CONTENT.read_text()
    m = BLOCK.search(src)
    if not m:
        sys.exit('HERO-WEEK markers not found in assets/content.js')
    if a.show:
        print(m.group(2).strip()); return
    missing = [k for k in ('week', 'line1', 'line2', 'item', 'source') if not getattr(a, k)]
    if missing:
        sys.exit('missing: ' + ', '.join('--' + k for k in missing))
    if not re.fullmatch(r'\d{4}-\d{2}-\d{2}', a.week):
        sys.exit('--week must be YYYY-MM-DD')
    for k in ('line1', 'line2'):
        v = getattr(a, k).strip()
        if v.upper() == v and any(c.isalpha() for c in v):
            sys.exit(f'--{k} is all caps; use normal case')
        if len(v) > 26:
            sys.exit(f'--{k} is {len(v)} chars; keep each line 26 or fewer so it reads as a headline')
    if not re.search(r"id:'%s'|V\('%s'" % (re.escape(a.item), re.escape(a.item)), src):
        sys.exit(f"item {a.item!r} is not in assets/content.js; add it to the library first")
    if not a.source.startswith('https://'):
        sys.exit('--source must be an https URL')
    body = (" MP.HERO={week:%s,line1:%s,line2:%s,item:%s,\n   source:%s};"
            % (js(a.week), js(a.line1.strip()), js(a.line2.strip()), js(a.item), js(a.source)))
    CONTENT.write_text(src[:m.start(2)] + body + src[m.end(2):])
    print(body.strip())

if __name__ == '__main__':
    main()
