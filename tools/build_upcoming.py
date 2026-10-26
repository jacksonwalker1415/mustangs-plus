#!/usr/bin/env python3
"""Build assets/upcoming.js (MP.UPCOMING) for the home calendar ribbon: every SMU sport's upcoming games and events,
parsed from the official SMU Athletics schedule pages on smumustangs.com.

Each entry keeps only what the schedule card lists: date (and end date for multi-day events), time (CT), opponent or
event name, home/away/neutral, venue/city, TV, radio and the card's official Watch / Listen / Game Center links.
A missing field stays empty and the ribbon shows TBA. Nothing is guessed.

Usage: python3 tools/build_upcoming.py
"""
import html, json, os, re, sys, urllib.request
from datetime import datetime
from bs4 import BeautifulSoup

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "upcoming.js")
BASE = "https://smumustangs.com"
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
# (site sport slug, official schedule path, season start year, team label for two-team sports)
SPORTS = [
    ("football", "football/schedule/2026", 2026, None),
    ("mens-basketball", "mens-basketball/schedule/2026-27", 2026, None),
    ("womens-basketball", "womens-basketball/schedule/2026-27", 2026, None),
    ("volleyball", "womens-volleyball/schedule/2026", 2026, None),
    ("womens-soccer", "womens-soccer/schedule/2026", 2026, None),
    ("mens-soccer", "mens-soccer/schedule/2026", 2026, None),
    ("swimming-diving", "mens-swimming-and-diving/schedule/2026-27", 2026, "Men's"),
    ("swimming-diving", "womens-swimming-and-diving/schedule/2026-27", 2026, "Women's"),
    ("golf", "mens-golf/schedule/2026-27", 2026, "Men's"),
    ("golf", "womens-golf/schedule/2026-27", 2026, "Women's"),
    ("tennis", "mens-tennis/schedule/2026-27", 2026, "Men's"),
    ("tennis", "womens-tennis/schedule/2026-27", 2026, "Women's"),
    ("track-field", "womens-cross-country/schedule/2026", 2026, "Cross country"),
    ("track-field", "womens-track-and-field/schedule/2026-27", 2026, "Track & field"),
    ("rowing", "rowing/schedule/2026-27", 2026, None),
    ("equestrian", "equestrian/schedule/2026-27", 2026, None),
]
GAME_PAGES = {"football": "fb", "mens-basketball": "mbb", "womens-basketball": "wbb"}
MON = {m: i + 1 for i, m in enumerate("Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split())}
DATE = re.compile(r"([A-Z][a-z]{2}) (\d{1,2}) \((\w{3})\)(?: - ([A-Z][a-z]{2}) (\d{1,2}) \((\w{3})\))?")


def get(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=30) as r:
        return r.read().decode("utf-8", "replace")


def txt(e):
    return " ".join(e.stripped_strings) if e else ""


def absu(h):
    h = html.unescape(h or "")
    return BASE + h if h.startswith("/") else h


def ymd(mon, day, start, football):
    m = MON[mon]
    y = start if (football or m >= 7) else start + 1
    return f"{y}-{m:02d}-{int(day):02d}"


def nice_time(t):
    m = re.match(r"(\d{1,2})(?::(\d\d))?\s*(a\.?m\.?|p\.?m\.?)", t or "", re.I)
    if not m:
        return None
    return f"{m.group(1)}{':' + m.group(2) if m.group(2) else ''} {'a.m.' if m.group(3).lower().startswith('a') else 'p.m.'} CT"


def parse(slug, path, start, team):
    s = BeautifulSoup(get(f"{BASE}/sports/{path}"), "lxml")
    out = []
    for c in s.select(".s-game-card"):
        st = txt(c.select_one(".s-game-card__header__game-score-time"))
        m = DATE.search(st)
        if not m:
            continue
        pre, post = st[:m.start()].strip(), st[m.end():].strip()
        if re.match(r"^[WLT],", pre):          # already played
            continue
        d = ymd(m.group(1), m.group(2), start, slug == "football")
        d2 = ymd(m.group(4), m.group(5), start, slug == "football") if m.group(4) else None
        stamp = txt(c.select_one(".s-stamp__text"))
        info = c.select_one(".s-game-card__header__team-event-info")
        name_el = info.select_one('[data-test-id="s-game-card-standard__header-team-opponent-link"]') if info else None
        if not name_el and info:
            name_el = info.find(["a", "span", "p", "div"], string=True)
        name = txt(name_el) if name_el else ""
        if not name and info:
            leaves = [e.get_text(" ", strip=True) for e in info.find_all(True) if e.find(True) is None and e.get_text(strip=True)]
            name = leaves[0] if leaves else ""
        name = re.sub(r"^\[[^\]]*\]\s*", "", name)
        ex = bool(re.search(r"\((?:Exh|exh)\.?\)", name))
        name = re.sub(r"\s*\((?:Exh|exh)\.?\)", "", name).strip()
        if not name:
            continue
        fac = txt(c.select_one('[data-test-id="s-game-card-facility-and-location__standard-facility-title"]'))
        loc = txt(c.select_one('[data-test-id="s-game-card-facility-and-location__standard-location-details"]'))
        tv = re.sub(r"^TV:\s*", "", txt(c.select_one(".s-game-card__header__tv"))) or None
        radio = re.sub(r"^Radio:\s*", "", txt(c.select_one(".s-game-card__header__radio"))) or None
        tour = txt(c.select_one(".s-game-card__header__tournament-and-game-promotion")) or None
        links = {}
        for a in c.select("a"):
            t, h = a.get_text(" ", strip=True), a.get("href") or ""
            if t == "Watch" and "watch" not in links:
                links["watch"] = absu(h)
            elif t == "Listen" and "listen" not in links:
                links["listen"] = absu(h)
            elif "/game-center/" in h and "gc" not in links:
                links["gc"] = absu(h)
            m = re.search(r"statbroadcast\.com/broadcast/\?id=(\d+)", html.unescape(h))
            if m and "sb" not in links:
                links["sb"] = int(m.group(1))   # SMU's official StatBroadcast box score (link out only)
        where = ", ".join(x for x in (fac, loc) if x)
        home = "Dallas" in loc or "Dallas" in fac
        ha = "home" if home else ("away" if stamp == "at" else "neutral")
        e = {"sport": slug, "d": d, "name": name, "ha": ha, "where": where}
        if stamp in ("vs", "at"):
            e["vs"] = stamp
        if d2 and d2 != d:
            e["d2"] = d2
        tm = nice_time(post)
        if tm:
            e["time"] = tm
        for k, v in (("team", team), ("tv", tv), ("radio", radio), ("tour", tour), ("ex", ex or None)):
            if v:
                e[k] = v
        e.update(links)
        pre_id = GAME_PAGES.get(slug)
        if pre_id and "gc" in links:
            e["game"] = f"{pre_id}-{links['gc'].rstrip('/').rsplit('/', 1)[-1]}"
        out.append(e)
    return out


def main():
    today = datetime.now().strftime("%Y-%m-%d")
    allv, src, seen = [], [], set()
    for slug, path, start, team in SPORTS:
        try:
            ev = parse(slug, path, start, team)
        except Exception as ex:  # one page failing must not wipe the others
            print(f"! {path}: {ex}", file=sys.stderr)
            continue
        src.append(f"{BASE}/sports/{path}")
        ev = [e for e in ev if (e.get("d2") or e["d"]) >= today]
        for e in ev:
            k = (e["sport"], e["d"], e["name"], e.get("team"))
            if k not in seen:
                seen.add(k)
                allv.append(e)
        print(f"{slug} {team or ''}: {len(ev)} upcoming")
    if len(allv) < 10:
        print("! too few events parsed; keeping the old file", file=sys.stderr)
        return 1
    allv.sort(key=lambda e: (e["d"], e.get("time") is None, e["sport"]))
    checked = datetime.now().strftime("%b. %-d, %Y").replace("May.", "May")
    js = ("/* Home calendar ribbon data, generated by tools/build_upcoming.py from the official SMU Athletics schedule pages.\n"
          "   Do not edit by hand. */\n"
          "window.MP=window.MP||{};MP.UPCOMING=" + json.dumps({"checked": checked, "src": src, "events": allv}, ensure_ascii=False, separators=(",", ":")) + ";\n")
    open(OUT, "w").write(js)
    print(f"Wrote {OUT}: {len(allv)} events, {len(js)} bytes")
    return 0


if __name__ == "__main__":
    sys.exit(main())
