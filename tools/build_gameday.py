#!/usr/bin/env python3
"""Build assets/games.js (MP.GAMES) for the game-day hub from SMU Athletics' official schedule pages.

For football, men's and women's basketball it keeps the most recent result plus every upcoming game. Each game's
date, time (CT), venue, TV, radio, notes and official links (Game Center, box score, recap, watch, listen, preview)
come straight from the schedule card. A result comes from the card ("W, 59-20"), or, when the card has not been
updated yet, from the game's official Game Center line score. Nothing is guessed: a missing field stays empty and the
page shows TBA.

Usage: python3 tools/build_gameday.py
"""
import html, json, os, re, sys, urllib.request
from datetime import datetime, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "games.js")
BASE = "https://smumustangs.com"
SPORTS = [("football", "fb", "/sports/football/schedule/2026", 2026),
          ("mens-basketball", "mbb", "/sports/mens-basketball/schedule/2026-27", 2026),
          ("womens-basketball", "wbb", "/sports/womens-basketball/schedule/2026-27", 2026)]
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
MON = {m: i + 1 for i, m in enumerate("Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split())}
LINKS = {"Box Score": "box", "Recap": "recap", "Watch": "watch", "Listen": "listen", "Preview": "preview",
         "Game Program": "program", "Live stats": "stats"}


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8", "replace")


def clean(x):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", x))).strip()


def absu(h):
    h = html.unescape(h)
    return BASE + h if h.startswith("/") else h


def ct_iso(d, t):
    m = re.match(r"(\d{1,2})(?::(\d\d))?\s*(a\.?m\.?|p\.?m\.?)", t or "", re.I)
    if not m:
        return None
    h = int(m.group(1)) % 12 + (12 if m.group(3).lower().startswith("p") else 0)
    dst = "2026-03-08" <= d < "2026-11-01" or "2027-03-14" <= d < "2027-11-07"
    return f"{d}T{h:02d}:{m.group(2) or '00'}:00{'-05:00' if dst else '-06:00'}"


def nice_time(t):
    """'11am CT' / '6:30pm CT' / '7 p.m. CT' -> '11 a.m. CT' style; TBD/TBA -> None"""
    m = re.match(r"(\d{1,2})(?::(\d\d))?\s*(a\.?m\.?|p\.?m\.?)", t or "", re.I)
    if not m:
        return None
    return f"{m.group(1)}{':' + m.group(2) if m.group(2) else ''} {'a.m.' if m.group(3).lower().startswith('a') else 'p.m.'} CT"


def linescore(gc_url):
    """Final score from an official Game Center page: (smu, opp) or None."""
    t = clean(re.sub(r"<script.*?</script>", "", get(gc_url), flags=re.S))
    if " Final " not in t:
        return None
    m = re.search(r"Team (?:\d+ |OT ?)+Total (.*?) Next Game", t)
    if not m:
        return None
    rows = re.findall(r"([A-Za-z&.'() -]+?) ((?:\d+ )+)", m.group(1) + " ")
    smu = [r for r in rows if r[0].strip() == "SMU"]
    opp = [r for r in rows if r[0].strip() != "SMU"]
    if len(smu) != 1 or len(opp) != 1:
        return None
    return int(smu[0][1].split()[-1]), int(opp[0][1].split()[-1])


def cards(slug, pre, path, year):
    s = get(BASE + path)
    out, seen = [], set()
    for p in re.split(r'<div[^>]*class="s-game-card s-game-card--standard', s)[1:]:
        p = re.sub(r"<script.*?</script>", "", p.split("s-game-card s-game-card--standard")[0][:30000], flags=re.S)
        a = [(h, clean(t)) for h, t in re.findall(r'<a[^>]*href="([^"]+)"[^>]*>(.*?)</a>', p, re.S)]
        gc = next((h for h, t in a if "/game-center/" in h), None)
        if not gc or gc in seen:
            continue
        seen.add(gc)
        txt = clean(p.split(">", 1)[1])
        m = re.match(r"(vs|at)\s+(.*)$", txt)
        if not m:
            continue
        side, rest = m.groups()
        dm = re.search(r"\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{1,2}) \((\w{3})\) (.*?CT|TBD|TBA)", rest)
        if not dm:
            continue
        mo, day = MON[dm.group(1)], int(dm.group(2))
        yr = year + 1 if slug != "football" and mo < 7 else year
        d = f"{yr}-{mo:02d}-{day:02d}"
        team_link = next((t for h, t in a if t and "/facilities/" not in h and "/game-center/" not in h), "")
        if not team_link:
            continue
        opp = re.sub(r"^\[[^\]]*\]\s*", "", team_link)            # rankings like [RV/RV]
        ex = bool(re.search(r"\(Exh\.?\)", opp))
        opp = re.sub(r"\s*\(Exh\.?\)", "", opp).strip()
        head = rest[:dm.start()]
        tv = re.search(r"TV:\s*(.*?)\s*(?:\||Radio:|$)", head)
        radio = re.search(r"Radio:\s*(.*?)\s*(?:W, |L, |T, |$)", head)
        res = re.search(r"\b([WLT]), (\d+)-(\d+)", head)
        venue = next((t for h, t in a if "/facilities/" in h), "")
        place = head.split(team_link, 1)[-1] if team_link in head else head
        place = re.split(r"\s+(?:TV:|Radio:|[WLT], \d)", place)[0].strip()
        if venue and place.startswith(venue):
            city = place[len(venue):].strip()
        else:
            city = place
        # notes shown on the card after the radio line (e.g. 'Homecoming - Senior Day - Wear Blue!')
        tail = rest[dm.end():]
        links = {}
        for h, t in a:
            k = LINKS.get(t)
            if k and k not in links and not h.startswith("/sidearm-icons"):
                links[k] = absu(h)
        links["gamecenter"] = absu(gc)
        home = bool(venue) or "Dallas" in city
        # the card prints any note (event name, promo) right after the radio line
        rad, note = (radio.group(1).strip(" |") if radio else ""), ""
        rm = re.match(r"(.*?SiriusXM(?: \d+)?)\s*(.*)$", rad)
        if rm:
            rad, note = rm.group(1), rm.group(2)
        g = {"id": f"{pre}-{gc.rsplit('/', 1)[-1]}", "sport": slug, "d": d, "dow": dm.group(3),
             "ha": "home" if home else ("away" if side == "at" else "neutral"), "opp": opp, "ex": ex,
             "venue": venue, "city": city, "time": nice_time(dm.group(4)), "ko": ct_iso(d, dm.group(4)),
             "tv": (tv.group(1).strip(" |") if tv else "") or None, "radio": rad or None,
             "res": f"{res.group(1)} {res.group(2)}-{res.group(3)}" if res else None, "links": links}
        note = re.sub(r"\s*\bAll News\b", "", note).strip()
        if note:
            g["note"] = note.replace(" - ", " · ").rstrip("!")
        out.append(g)
    return out


def main():
    now = datetime.now(timezone.utc)
    today = now.astimezone().strftime("%Y-%m-%d")
    games, src = [], {}
    for slug, pre, path, year in SPORTS:
        G = cards(slug, pre, path, year)
        if not G:
            print(f"! {slug}: no game cards parsed; aborting so the old file stays", file=sys.stderr)
            return 1
        src[slug] = BASE + path
        past = [g for g in G if g["d"] < today]
        if past:
            last = past[-1]
            if not last["res"]:
                sc = linescore(last["links"]["gamecenter"])
                if sc:
                    us, them = sc
                    last["res"] = f"{'W' if us > them else 'L' if us < them else 'T'} {us}-{them}"
                    last["resSrc"] = "gamecenter"
        keep = ([past[-1]] if past else []) + [g for g in G if g["d"] >= today]
        print(f"{slug}: {len(G)} on the schedule, {len(keep)} game pages (last result {past[-1]['d'] if past else 'none'})")
        games += keep
    checked = datetime.now().strftime("%b. %-d, %Y").replace("May.", "May")
    js = ("/* Game-day hub data, generated by tools/build_gameday.py from the official SMU Athletics schedule pages\n"
          "   (and the official Game Center page for a final the schedule card has not shown yet). Do not edit by hand. */\n"
          "window.MP=window.MP||{};MP.GAMES=" + json.dumps({"checked": checked, "src": src, "games": games}, ensure_ascii=False, indent=0) + ";\n")
    open(OUT, "w").write(js)
    print(f"Wrote {OUT}: {len(games)} games")
    return 0


if __name__ == "__main__":
    sys.exit(main())
