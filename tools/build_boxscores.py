#!/usr/bin/env python3
"""Build assets/boxscores.js (MP.BOX) for the game-day pages: real stats only, from official pages.

Completed games (games in assets/games.js with a result):
  * the official SMU Athletics box score (smumustangs.com .../boxscore/<id>) when the schedule links one:
    line score, team stats, game leaders, football scoring summary, attendance;
  * otherwise the official SMU Athletics Game Center page: line score, team stats, game leaders.
  Every parsed final is checked against the schedule's result; on any mismatch the game is left out.
Upcoming games:
  * season-to-date comparison: SMU from its official season stats page; the opponent from its own official
    athletics site (Sidearm stats page, found through the opponent link on SMU's schedule card), else from
    ESPN's public team stats. A row only shows when both teams have it. Hidden until both teams have played.
  * last meeting: the most recent result against the same opponent on SMU's official schedule pages
    (past seasons are cached in tools/data/smu-history.json; they do not change).
Nothing is estimated. A block with no source data is left out.

Usage: python3 tools/build_boxscores.py   (run after tools/build_gameday.py)
"""
import html, json, os, re, sys, time, urllib.request
from datetime import datetime, timedelta, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GAMES = os.path.join(ROOT, "assets", "games.js")
OUT = os.path.join(ROOT, "assets", "boxscores.js")
HIST = os.path.join(ROOT, "tools", "data", "smu-history.json")
BASE = "https://smumustangs.com"
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
ESPN = {"football": "football/college-football", "mens-basketball": "basketball/mens-college-basketball",
        "womens-basketball": "basketball/womens-college-basketball"}
SMU_ESPN = "2567"
MON = {m: i + 1 for i, m in enumerate("Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split())}
CUR = {"football": 2026, "mens-basketball": 2026, "womens-basketball": 2026}   # season start year
HIST_FROM = 2014


def season_path(sport, y):
    return str(y) if sport == "football" else f"{y}-{str(y + 1)[2:]}"


_cache = {}


def get(url, tries=2):
    if url in _cache:
        return _cache[url]
    last = None
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=30) as r:
                s = r.read().decode("utf-8", "replace")
                _cache[url] = s
                return s
        except Exception as e:  # noqa: BLE001
            last = e
            time.sleep(1.5)
    raise last


def getj(url):
    return json.loads(get(url))


def clean(x):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", x))).strip()


def strip(s):
    return re.sub(r"<script.*?</script>|<style.*?</style>|<svg.*?</svg>", "", s, flags=re.S)


def tables(s):
    """Every <table> on a page as a list of rows (lists of cell text)."""
    out = []
    for t in re.findall(r"<table.*?</table>", strip(s), re.S):
        out.append([[clean(c) for c in re.findall(r"<t[hd][^>]*>(.*?)</t[hd]>", r, re.S)]
                    for r in re.findall(r"<tr.*?</tr>", t, re.S)])
    return out


def num(x):
    try:
        return float(str(x).replace(",", "").replace("%", ""))
    except (TypeError, ValueError):
        return None


def first_last(n):
    """'Jennings, Kevin' / 'Hendricks,Chase' -> 'Kevin Jennings'. Fixes all-lowercase/odd casing only by keeping source text."""
    n = n.strip()
    if "," in n:
        last, first = [p.strip() for p in n.split(",", 1)]
        n = f"{first} {last}".strip()
    return re.sub(r"\s+", " ", n)


def fix_case(n):
    # official boxes sometimes lowercase the 2nd part of hyphenated names ('Perry-smith'); title-case after hyphens
    return re.sub(r"-([a-z])", lambda m: "-" + m.group(1).upper(), n)


def pct1(x):
    v = num(x)
    if v is None:
        return None
    if v <= 1 and "." in str(x) and "%" not in str(x):
        v *= 100
    return f"{v:.1f}%"


# ---------------------------------------------------------------- completed games
def line_from(rows, g):
    """Line score table -> dict, with the opponent's display name from the schedule."""
    head = rows[0]
    labels = []
    for h in head[1:-1]:
        m = re.match(r"(\d+)(?:st|nd|rd|th)?\b", h)
        labels.append("OT" if re.match(r"OT", h, re.I) else (m.group(1) if m else h))
    teams = []
    for r in rows[1:]:
        if len(r) != len(head):
            return None
        smu = r[0].strip() == "SMU"
        sc = [num(x) for x in r[1:]]
        if any(v is None for v in sc):
            return None
        teams.append({"t": "SMU" if smu else g["opp"], "smu": smu, "s": [int(v) for v in sc[:-1]], "tot": int(sc[-1])})
    if len(teams) != 2 or sum(t["smu"] for t in teams) != 1:
        return None
    labels = [("OT" if i >= (4 if g["sport"] != "mens-basketball" else 2) and l.isdigit() else l) for i, l in enumerate(labels)]
    return {"h": labels, "rows": teams}


def result_ok(line, g):
    m = re.match(r"([WLT]) (\d+)-(\d+)", g["res"] or "")
    if not m or not line:
        return False
    us = next(t["tot"] for t in line["rows"] if t["smu"])
    them = next(t["tot"] for t in line["rows"] if not t["smu"])
    return (us, them) == (int(m.group(2)), int(m.group(3)))


def find(T, pred):
    return [t for t in T if t and pred(t)]


def hdr(t):
    return " | ".join(t[0]) if t else ""


def sections(rows):
    """'- | A | B' stat tables with one-cell section rows -> {(section, label): (a, b)} and a flat {label: (a, b)}."""
    out, sec = {}, ""
    for r in rows[1:]:
        if len(r) == 1:
            sec = r[0]
        elif len(r) >= 3:
            out[(sec, r[0])] = (r[1], r[2])
    return out


def fb_box(s, g):
    T = tables(s)
    ls = find(T, lambda t: t[0] and t[0][0] == "Team" and "Total" in t[0][-1])
    line = line_from(ls[0], g) if ls else None
    if not result_ok(line, g):
        return None
    order = [t["smu"] for t in line["rows"]]          # True where the row is SMU (visitor first)
    ts = find(T, lambda t: len(t[0]) == 3 and t[0][0] == "-" and any(len(r) == 1 and r[0] == "First Downs" for r in t))
    out = {"line": line}
    if ts:
        S = sections(ts[0])

        def pair(k):
            v = S.get(k)
            if not v:
                return None
            return (v[1], v[0]) if order[1] else (v[0], v[1])   # -> (smu, opp)

        def ints(k):
            p = pair(k)
            return p and (num(p[0]), num(p[1]))
        rows = []

        def add(label, smu, opp, sv=None, ov=None, low=False):
            if smu is None or opp is None:
                return
            sv = num(smu) if sv is None else sv
            ov = num(opp) if ov is None else ov
            rows.append({"l": label, "s": str(smu), "o": str(opp), "sv": sv, "ov": ov, **({"low": 1} if low else {})})
        p = pair(("Total Offense", "Yards"))
        p and add("Total yards", *p)
        p = pair(("Passing", "Total (Net)"))
        p and add("Passing yards", *p)
        p = pair(("Rushing", "Total (Net)"))
        p and add("Rushing yards", *p)
        p = pair(("First Downs", "Total"))
        p and add("First downs", *p)
        cai, fum = pair(("Passing", "Comp.-Att.-Int.")), pair(("Total Offense", "Fumbles - Lost"))
        if cai and fum:
            try:
                to = [int(re.split(r"\s*-\s*", cai[i])[2]) + int(re.split(r"\s*-\s*", fum[i])[1]) for i in (0, 1)]
                add("Turnovers", str(to[0]), str(to[1]), low=True)
            except (IndexError, ValueError):
                pass
        p = pair(("Miscellaneous", "3rd. Down Conv."))
        if p:
            f = [re.match(r"(\d+) of (\d+)", x) for x in p]
            if all(f):
                v = [int(m.group(1)) / int(m.group(2)) if int(m.group(2)) else 0 for m in f]
                add("Third downs", p[0].replace(" of ", "-"), p[1].replace(" of ", "-"), v[0], v[1])
        p = pair(("Miscellaneous", "Poss. Time"))
        if p and all(re.match(r"\d+:\d\d$", x) for x in p):
            sec = [int(x.split(":")[0]) * 60 + int(x.split(":")[1]) for x in p]
            add("Time of possession", p[0], p[1], sec[0], sec[1])
        p = pair(("Total Offense", "Penalties - Yds."))
        p and add("Penalties", p[0], p[1], num(p[0].split("-")[0]), num(p[1].split("-")[0]), low=True)
        if rows:
            out["stats"] = rows
        # passing totals in the player tables must match the team stats, or the pair order is wrong
        net = pair(("Passing", "Total (Net)"))
    # leaders
    def two(sig):
        return [t for t in T if t and " | ".join(t[0]).startswith(sig)][:2]
    pas, rus, rec = two("Player | Cmp | Att | Yds."), two("Player | Att | Gain | Loss | Net"), two("Player | Rec. | Yds.")
    leaders = []
    if len(pas) == 2 and len(rus) == 2 and len(rec) == 2:
        def players(t):
            return [r for r in t[1:] if r and r[0] not in ("Totals", "Team", "TM")]
        def tot(t, col):
            r = [r for r in t[1:] if r and r[0] == "Totals"]
            return num(r[0][col]) if r else None
        smu_i = 1 if order[1] else 0
        if ts and net and tot(pas[smu_i], 3) != num(net[0]):
            smu_i = None
        if smu_i is not None:
            def best(t, col, fmt):
                P = [r for r in players(t) if num(r[col]) is not None]
                if not P:
                    return None
                r = max(P, key=lambda r: num(r[col]))
                return {"n": fix_case(first_last(r[0])), **fmt(r)}
            cats = [("Passing", pas, 3, lambda r: {"v": f"{r[3]} yds", "d": f"{r[1]}-{r[2]}" + (f", {r[4]} TD" if r[4] not in ("0", "") else "") + (f", {r[5]} INT" if r[5] not in ("0", "") else "")}),
                    ("Rushing", rus, 4, lambda r: {"v": f"{r[4]} yds", "d": f"{r[1]} car" + (f", {r[5]} TD" if r[5] not in ("0", "") else "")}),
                    ("Receiving", rec, 2, lambda r: {"v": f"{r[2]} yds", "d": f"{r[1]} rec" + (f", {r[3]} TD" if r[3] not in ("0", "") else "")})]
            for name, pair_t, col, fmt in cats:
                s_, o_ = best(pair_t[smu_i], col, fmt), best(pair_t[1 - smu_i], col, fmt)
                if s_ or o_:
                    leaders.append({"c": name, "s": s_, "o": o_})
    if leaders:
        out["leaders"] = leaders
    # scoring summary
    sc = find(T, lambda t: t[0][:1] == ["-"] and len(t[0]) == 7 and any(len(r) == 7 and re.match(r"\d\d:\d\d$", r[3] or "") for r in t))
    if sc:
        cols = sc[0][0][5:7]
        smu_col = 1 if cols[1] == "SMU" else 0 if cols[0] == "SMU" else None
        plays = []
        for r in sc[0][1:]:
            if len(r) != 7 or not re.match(r"\d\d:\d\d$", r[3]):
                continue
            txt = r[4]
            m = re.match(r"^[A-Z&]+ - (.*)$", txt)
            txt = m.group(1) if m else txt
            drive = re.search(r",?\s*(\d+ plays?, -?\d+ yards?, TOP \d\d:\d\d)\s*$", txt)
            if drive:
                txt = txt[:drive.start()].strip().rstrip(",")
            txt = re.sub(r"([A-Z][A-Za-z'.\- ]*?(?: (?:Jr\.|Sr\.|II|III|IV))?),([A-Z][A-Za-z'.\-]+)", lambda m: fix_case(m.group(2) + " " + m.group(1)), txt)
            if smu_col is None:
                break
            plays.append({"q": r[1], "clk": r[3], "smu": r[2] == "SMU", "t": r[2], "txt": txt, **({"dr": drive.group(1).replace("TOP", "time")} if drive else {}),
                          "ss": int(r[5 + smu_col]), "os": int(r[6 - smu_col])})
        if plays and plays[-1]["ss"] == next(t["tot"] for t in line["rows"] if t["smu"]):
            out["scoring"] = plays
    t = clean(strip(s))
    m = re.search(r"Attendance: ([\d,]+)", t)
    if m and num(m.group(1)):
        out["att"] = f"{int(num(m.group(1))):,}"
    return out


def bb_box(s, g):
    T = tables(s)
    ls = find(T, lambda t: t[0] and t[0][0] == "Team" and "Total" in t[0][-1])
    line = line_from(ls[0], g) if ls else None
    if not result_ok(line, g):
        return None
    out = {"line": line}
    pt = [t for t in T if t and t[0][:4] == ["#", "Player", "gs", "min"]][:2]
    summ = [t for t in T if t and t[0][:1] == ["Team Summary"]][:2]
    if len(pt) != 2:
        return out
    H = pt[0][0]
    col = {h: i for i, h in enumerate(H)}
    tot = []
    for t in pt:
        r = [r for r in t[1:] if r and r[0] == "Totals"]
        tot.append(r[0] if r else None)
    if not all(tot):
        return out
    # which player table is SMU: its points total equals SMU's final
    smu_tot = next(x["tot"] for x in line["rows"] if x["smu"])
    opp_tot = next(x["tot"] for x in line["rows"] if not x["smu"])
    pts = [num(r[col["pts"]]) for r in tot]
    if pts == [smu_tot, opp_tot]:
        si = 0
    elif pts == [opp_tot, smu_tot]:
        si = 1
    else:
        return out
    S, O = tot[si], tot[1 - si]

    def pct_of(i, k):
        if len(summ) == 2:
            rows = summ[i]
            for j, r in enumerate(rows):
                if r and r[0] == "Total" and j + 1 < len(rows):
                    return pct1(rows[j + 1][k])
        return None

    def ma(r, k):
        m = re.match(r"(\d+)\s*-\s*(\d+)", r[col[k]])
        return (int(m.group(1)), int(m.group(2))) if m else None
    rows = []
    for label, k, pk in (("Field goals", "fg", 0), ("3-pointers", "3pt", 1), ("Free throws", "ft", 2)):
        a, b = ma(S, k), ma(O, k)
        if not (a and b):
            continue
        pa, pb = pct_of(si, pk), pct_of(1 - si, pk)
        rows.append({"l": label, "s": f"{a[0]}-{a[1]}" + (f" ({pa})" if pa else ""), "o": f"{b[0]}-{b[1]}" + (f" ({pb})" if pb else ""),
                     "sv": a[0] / a[1] if a[1] else 0, "ov": b[0] / b[1] if b[1] else 0})
    for label, k, low in (("Rebounds", "reb", 0), ("Assists", "a", 0), ("Turnovers", "to", 1), ("Steals", "stl", 0), ("Blocks", "blk", 0)):
        a, b = num(S[col[k]]), num(O[col[k]])
        if a is not None and b is not None:
            rows.append({"l": label, "s": str(int(a)), "o": str(int(b)), "sv": a, "ov": b, **({"low": 1} if low else {})})
    out["stats"] = rows

    def best(t, k, unit, extra):
        P = [r for r in t[1:] if r and r[0] not in ("TM", "Totals") and r[1] != "Team" and num(r[col[k]]) is not None]
        if not P:
            return None
        hi = max(num(r[col[k]]) for r in P)
        top = [r for r in P if num(r[col[k]]) == hi]
        r = top[0]
        d = {"n": " & ".join(fix_case(first_last(x[1])) for x in top), "no": r[0] if len(top) == 1 else "", "v": f"{int(hi)} {unit}"}
        if len(top) == 1 and extra(r):
            d["d"] = extra(r)
        return d
    L = []
    for c, k, unit, extra in (("Points", "pts", "pts", lambda r: f"{r[col['fg']].replace(' ', '')} FG" + (f", {r[col['3pt']].replace(' ', '')} 3PT" if not r[col['3pt']].startswith("0") else "")),
                              ("Rebounds", "reb", "reb", lambda r: None), ("Assists", "a", "ast", lambda r: None)):
        L.append({"c": c, "s": best(pt[si], k, unit, extra), "o": best(pt[1 - si], k, unit, extra)})
    out["leaders"] = L
    t = clean(strip(s))
    m = re.search(r"Attendance: ([\d,]+)", t)
    if m and num(m.group(1)):
        out["att"] = f"{int(num(m.group(1))):,}"
    return out


def gamecenter(s, g):
    T = tables(s)
    ls = find(T, lambda t: t[0] and t[0][0] == "Team" and "Total" in t[0][-1])
    line = line_from(ls[0], g) if ls else None
    if not result_ok(line, g):
        return None
    order = [t["smu"] for t in line["rows"]]
    out = {"line": line}
    st = [t for t in T if t and len(t) > 3 and all(len(r) == 3 for r in t) and t[0][0] == ""]
    if st:
        D = {r[0]: ((r[2], r[1]) if order[1] else (r[1], r[2])) for r in st[0][1:]}
        rows = []
        if g["sport"] != "football":
            # check the column order with the points arithmetic: 2*FG + 3PM + FT == final
            def made(k, i):
                m = re.match(r"(\d+)-(\d+)", D.get(k, ("", ""))[i])
                return int(m.group(1)) if m else None
            ok = all(made(k, i) is not None for k in ("Field Goals: Made-Attempted", "Three Point: Made-Attempted", "Free Throws: Made-Attempted") for i in (0, 1))
            fin = [next(t["tot"] for t in line["rows"] if t["smu"]), next(t["tot"] for t in line["rows"] if not t["smu"])]
            if ok and all(2 * made("Field Goals: Made-Attempted", i) + made("Three Point: Made-Attempted", i) + made("Free Throws: Made-Attempted", i) == fin[i] for i in (0, 1)):
                for label, k, pk in (("Field goals", "Field Goals: Made-Attempted", "Field Goal Percentage"), ("3-pointers", "Three Point: Made-Attempted", "Three Point Percentage"),
                                     ("Free throws", "Free Throws: Made-Attempted", "Free Throw Percentage")):
                    a, b = D[k]
                    pa, pb = D.get(pk, (None, None))
                    fa, fb_ = [re.match(r"(\d+)-(\d+)", x) for x in (a, b)]
                    rows.append({"l": label, "s": a + (f" ({pct1(pa)})" if pa else ""), "o": b + (f" ({pct1(pb)})" if pb else ""),
                                 "sv": int(fa.group(1)) / max(1, int(fa.group(2))), "ov": int(fb_.group(1)) / max(1, int(fb_.group(2)))})
                for label, k, low in (("Rebounds", "Rebounds", 0), ("Assists", "Assists", 0), ("Turnovers", "Turnovers", 1), ("Steals", "Steals", 0), ("Blocks", "Blocks", 0)):
                    if k in D and num(D[k][0]) is not None and num(D[k][1]) is not None:
                        rows.append({"l": label, "s": D[k][0], "o": D[k][1], "sv": num(D[k][0]), "ov": num(D[k][1]), **({"low": 1} if low else {})})
        if rows:
            out["stats"] = rows
    # Game leaders: 'Points Jersey Number: 4 PJ Haggerty TAMU 28 PTS Jersey Number: 8 Cameron Lomax SMU 22 PTS ...'
    t = clean(strip(s))
    i = t.find("Game Leaders")
    if i >= 0:
        seg = t[i + 12:t.find("Game Leaders", i + 12) if t.find("Game Leaders", i + 12) > 0 else i + 2000]
        L = []
        for cat in re.finditer(r"(Points|Rebounds|Assists|Passing|Rushing|Receiving) ((?:Jersey Number: \S+ .*? \d+ (?:PTS|REB|AST|YDS) ?)+)", seg):
            ent = re.findall(r"Jersey Number: (\S+) (.*?) ([A-Z&]+) (\d+) (PTS|REB|AST|YDS)", cat.group(2))
            s_ = [e for e in ent if e[2] == "SMU"]
            o_ = [e for e in ent if e[2] != "SMU"]
            fmt = lambda e: e and {"n": e[0][1], "no": e[0][0], "v": f"{e[0][3]} {e[0][4].lower().replace('ast', 'ast')}"}
            L.append({"c": cat.group(1), "s": fmt(s_), "o": fmt(o_)})
        if L:
            out["leaders"] = L
    return out


def completed(g):
    L = g.get("links") or {}
    src = []
    if L.get("box"):
        try:
            s = get(L["box"])
            d = fb_box(s, g) if g["sport"] == "football" else bb_box(s, g)
            if d:
                src.append({"n": "SMU Athletics box score", "u": L["box"]})
                if "leaders" not in d and L.get("gamecenter"):
                    gc = gamecenter(get(L["gamecenter"]), g)
                    if gc and gc.get("leaders"):
                        d["leaders"] = gc["leaders"]
                        src.append({"n": "SMU Athletics Game Center", "u": L["gamecenter"]})
                d.update({"kind": "final", "src": src, "box": L["box"]})
                return d
        except Exception as e:  # noqa: BLE001
            print(f"  ! {g['id']} box score: {e}", file=sys.stderr)
    if L.get("gamecenter"):
        try:
            d = gamecenter(get(L["gamecenter"]), g)
            if d:
                d.update({"kind": "final", "src": [{"n": "SMU Athletics Game Center", "u": L["gamecenter"]}], "box": L["gamecenter"]})
                return d
        except Exception as e:  # noqa: BLE001
            print(f"  ! {g['id']} game center: {e}", file=sys.stderr)
    return None


# ---------------------------------------------------------------- upcoming games
def sched_cards(sport, y):
    """SMU schedule page for a season -> [{d, opp, site, res, ha, box}] (light parser that also reads older seasons)."""
    s = get(f"{BASE}/sports/{sport}/schedule/{season_path(sport, y)}")
    out = []
    for p in re.split(r'<div[^>]*class="s-game-card s-game-card--standard', s)[1:]:
        p = re.sub(r"<script.*?</script>", "", p.split("s-game-card s-game-card--standard")[0][:30000], flags=re.S)
        a = [(html.unescape(h), clean(t)) for h, t in re.findall(r'<a[^>]*href="([^"]+)"[^>]*>(.*?)</a>', p, re.S)]
        txt = clean(p.split(">", 1)[1])
        m = re.match(r"(vs|at)\s+(.*)$", txt)
        dm = re.search(r"\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{1,2}) \((\w{3})\)", txt)
        if not m or not dm:
            continue
        team = next(((h, t) for h, t in a if t and "/facilities/" not in h and not h.startswith("/") and "smumustangs" not in h), None)
        if not team:
            team = next(((h, t) for h, t in a if t and "/facilities/" not in h and "/game-center/" not in h and "/boxscore/" not in h and not re.match(r"(Box Score|Recap|Watch|Listen|Preview|Game Center|Tickets?|Live stats|Game Program|Buy Tickets)$", t)), None)
        if not team:
            continue
        mo = MON[dm.group(1)]
        yr = y + 1 if mo < 7 else y
        res = re.search(r"\b([WLT]), (\d+)-(\d+)", txt)
        opp = re.sub(r"^(?:\[[^\]]*\]|\([^)]*\)|#\d+)\s*", "", team[1]).strip()
        box = next((h for h, t in a if "/boxscore/" in h), None)
        ven = next((t for h, t in a if "/facilities/" in h), "")
        out.append({"d": f"{yr}-{mo:02d}-{int(dm.group(2)):02d}", "opp": opp, "site": team[0] if team[0].startswith("http") else "",
                    "res": f"{res.group(1)} {res.group(2)}-{res.group(3)}" if res else None, "ha": "home" if ven else ("away" if m.group(1) == "at" else "neutral"),
                    "box": (BASE + box) if box and box.startswith("/") else box})
    return out


def host(u):
    m = re.match(r"https?://(?:www\.)?([^/]+)", u or "")
    return m.group(1).lower() if m else ""


def norm(n):
    n = re.sub(r"\((?:exh\.?|exhibition)\)", "", n, flags=re.I)
    n = re.sub(r"\b(university|the)\b", "", n.lower())
    n = n.replace("st.", "state").replace("&", " and ")
    return re.sub(r"[^a-z]+", " ", n).strip()


ALIAS = {"cal": "california", "unt": "north texas", "ole miss": "mississippi", "utsa": "texas san antonio", "uconn": "connecticut", "pitt": "pittsburgh"}


def same_team(a, b):
    na, nb = ALIAS.get(norm(a["opp"]), norm(a["opp"])), ALIAS.get(norm(b["opp"]), norm(b["opp"]))
    return (host(a.get("site")) and host(a.get("site")) == host(b.get("site"))) or na == nb


def history(sport):
    H = {}
    if os.path.exists(HIST):
        H = json.load(open(HIST))
    hs = H.setdefault(sport, {})
    changed = False
    for y in range(HIST_FROM, CUR[sport]):
        k = str(y)
        if k in hs:
            continue
        try:
            hs[k] = sched_cards(sport, y)
            changed = True
            print(f"  history {sport} {season_path(sport, y)}: {len(hs[k])} games")
        except Exception as e:  # noqa: BLE001
            print(f"  ! history {sport} {y}: {e}", file=sys.stderr)
    if changed:
        os.makedirs(os.path.dirname(HIST), exist_ok=True)
        json.dump(H, open(HIST, "w"), indent=0, sort_keys=True)
    out = [x for k in sorted(hs) for x in hs[k]]
    return out


def sidearm_season(site, sport, y, me):
    """Official Sidearm season stats page -> {gp, rec, conf, stats:{key: value}} or None."""
    s = get(f"{site.rstrip('/')}/sports/{sport}/stats/{season_path(sport, y)}")
    T = tables(s)
    tt = [t for t in T if t and len(t[0]) == 3 and t[0][0] == "-" and t[0][2] == "Opponents"]
    if not tt:
        return None
    S = sections(tt[0])
    out = {"name": tt[0][0][1], "stats": {}}
    if sport == "football":
        log = [t for t in T if t and t[0][:3] == ["Date", "Opponent", "Result"] and "Record" in t[0]]
        if log:
            ri = log[0][0].index("Record")
            recs = [r[ri] for r in log[0][1:] if len(r) > ri and re.match(r"\d+-\d+", r[ri] or "")]
            if recs:
                parts = [p.strip() for p in recs[-1].split(",")]
                out["rec"] = parts[0]
                if len(parts) > 1:
                    out["conf"] = parts[1]
                out["gp"] = len(recs)
        get_ = lambda k, i=0: (S.get(k) or (None, None))[i]
        st = out["stats"]
        st["ppg"] = num(get_(("Scoring", "Points Per Game")))
        st["papg"] = num(get_(("Scoring", "Points Per Game"), 1))
        st["ypg"] = num(get_(("Total Offense", "Avg. Per Game")))
        st["passpg"] = num(get_(("Passing", "Avg. Per Game")))
        st["rushpg"] = num(get_(("Rushing", "Avg. Per Game")))
        st["oypg"] = num(get_(("Total Offense", "Avg. Per Game"), 1))
        m = re.search(r"\(([\d.]+)%\)", get_(("Miscellaneous", "3 rd Down Conversions")) or "")
        st["third"] = float(m.group(1)) if m else None
    else:
        log = [t for t in T if t and t[0][:4] == ["Opponent", "Date", "Score", "W/L"]]
        if log:
            wl = [r[3] for r in log[0][1:] if len(r) > 3 and re.match(r"[WL]", r[3] or "")]
            if wl:
                out["rec"] = f"{sum(x.startswith('W') for x in wl)}-{sum(x.startswith('L') for x in wl)}"
                out["gp"] = len(wl)
        get_ = lambda k, i=0: (S.get(k) or (None, None))[i]
        st = out["stats"]
        st["ppg"] = num(get_(("Scoring", "Points Per Game")))
        st["papg"] = num(get_(("Scoring", "Points Per Game"), 1))
        st["fg"] = num(pct1(get_(("Shooting", "FG: Percentage")) or "") or "")
        st["fg3"] = num(pct1(get_(("Shooting", "3PT: Percentage")) or "") or "")
        st["rpg"] = num(get_(("Rebounding", "Per Game")))
        st["apg"] = num(get_(("Assists", "Per Game")))
        st["topg"] = num(get_(("Turnovers", "Per Game")))
    if not out.get("gp"):
        return None
    out["u"] = f"{site.rstrip('/')}/sports/{sport}/stats/{season_path(sport, y)}"
    return out


def espn_season(sport, team_id, y):
    yy = y if sport == "football" else y + 1
    d = getj(f"https://site.api.espn.com/apis/site/v2/sports/{ESPN[sport]}/teams/{team_id}/statistics?season={yy}")
    if (d.get("season") or {}).get("year") != yy:
        return None
    C = {c["name"]: {s["name"]: s.get("displayValue") for s in c["stats"]} for c in d["results"]["stats"]["categories"]}
    O = {c["name"]: {s["name"]: s.get("displayValue") for s in c["stats"]} for c in (d["results"].get("opponent") or [])}
    rec = (d.get("team") or {}).get("recordSummary")
    out = {"name": (d.get("team") or {}).get("location") or "", "rec": rec, "stats": {},
           "u": f"https://www.espn.com/{'college-football' if sport == 'football' else ESPN[sport].split('/')[1]}/team/stats/_/id/{team_id}"}
    st = out["stats"]
    if sport == "football":
        gp = num(C.get("general", {}).get("gamesPlayed"))
        st["ppg"] = num(C.get("scoring", {}).get("totalPointsPerGame"))
        st["papg"] = num(O.get("scoring", {}).get("totalPointsPerGame"))
        st["ypg"] = num(C.get("passing", {}).get("yardsPerGame"))
        st["passpg"] = num(C.get("passing", {}).get("netPassingYardsPerGame"))
        st["rushpg"] = num(C.get("rushing", {}).get("rushingYardsPerGame"))
        st["oypg"] = num(O.get("passing", {}).get("yardsPerGame"))
        st["third"] = num(C.get("miscellaneous", {}).get("thirdDownConvPct"))
    else:
        gp = num(C.get("general", {}).get("gamesPlayed"))
        o = C.get("offensive", {})
        st["ppg"], st["fg"], st["fg3"] = num(o.get("avgPoints")), num(o.get("fieldGoalPct")), num(o.get("threePointFieldGoalPct"))
        st["rpg"], st["apg"], st["topg"] = num(C.get("general", {}).get("avgRebounds")), num(o.get("avgAssists")), num(o.get("avgTurnovers"))
        st["papg"] = num((O.get("offensive") or {}).get("avgPoints"))
    if not gp or not rec:
        return None
    out["gp"] = int(gp)
    return out


ROWS = {"football": [("Points per game", "ppg", 0, "{:.1f}"), ("Points allowed per game", "papg", 1, "{:.1f}"), ("Total yards per game", "ypg", 0, "{:.1f}"),
                     ("Passing yards per game", "passpg", 0, "{:.1f}"), ("Rushing yards per game", "rushpg", 0, "{:.1f}"),
                     ("Yards allowed per game", "oypg", 1, "{:.1f}"), ("Third-down conversions", "third", 0, "{:.1f}%")],
        "bb": [("Points per game", "ppg", 0, "{:.1f}"), ("Points allowed per game", "papg", 1, "{:.1f}"), ("Field goal %", "fg", 0, "{:.1f}%"),
               ("3-point %", "fg3", 0, "{:.1f}%"), ("Rebounds per game", "rpg", 0, "{:.1f}"), ("Assists per game", "apg", 0, "{:.1f}"),
               ("Turnovers per game", "topg", 1, "{:.1f}")]}


def espn_map(sport):
    yy = CUR[sport] if sport == "football" else CUR[sport] + 1
    try:
        d = getj(f"https://site.api.espn.com/apis/site/v2/sports/{ESPN[sport]}/teams/{SMU_ESPN}/schedule?season={yy}")
    except Exception as e:  # noqa: BLE001
        print(f"  ! ESPN schedule {sport}: {e}", file=sys.stderr)
        return {}
    M = {}
    for e in d.get("events", []):
        dt = datetime.fromisoformat(e["date"].replace("Z", "+00:00"))
        ct = (dt - timedelta(hours=5 if dt.month in range(4, 11) or (dt.month == 3 and dt.day > 8) or (dt.month == 11 and dt.day < 2) else 6)).strftime("%Y-%m-%d")
        for t in e["competitions"][0]["competitors"]:
            if t["team"]["id"] != SMU_ESPN:
                M[ct] = {"event": e["id"], "team": t["team"]["id"], "name": t["team"].get("displayName", "")}
    return M


LEAD_CATS = {"football": [("passingYards", "Passing"), ("rushingYards", "Rushing"), ("receivingYards", "Receiving")],
             "bb": [("pointsPerGame", "Points"), ("reboundsPerGame", "Rebounds"), ("assistsPerGame", "Assists")]}
_SUMMARY = {}
LOW = {"YDS": "yds", "CAR": "carries", "REC": "catches", "PTS": "pts", "REB": "reb", "AST": "ast"}


def espn_preview(sport, g, emap, opp_name):
    """ESPN game summary for an upcoming game -> season leaders, last five results and records for SMU and the opponent.
    Only current-season data: the summary must be for this season, and results before this season are dropped."""
    dd = datetime.strptime(g["d"], "%Y-%m-%d")
    em = next((emap[k] for k in (g["d"], (dd - timedelta(days=1)).strftime("%Y-%m-%d"), (dd + timedelta(days=1)).strftime("%Y-%m-%d")) if k in emap), None)
    if not em:
        return {}
    if em["event"] not in _SUMMARY:
        try:
            _SUMMARY[em["event"]] = getj(f"https://site.api.espn.com/apis/site/v2/sports/{ESPN[sport]}/summary?event={em['event']}")
        except Exception as e:  # noqa: BLE001
            print(f"  ! ESPN summary {g['opp']}: {e}", file=sys.stderr)
            _SUMMARY[em["event"]] = {}
    d = _SUMMARY[em["event"]]
    yy = CUR[sport] if sport == "football" else CUR[sport] + 1
    if ((d.get("header") or {}).get("season") or {}).get("year") != yy:
        return {}
    u = f"https://www.espn.com/{'college-football' if sport == 'football' else ESPN[sport].split('/')[1]}/game/_/gameId/{em['event']}"
    side = lambda tid: "s" if str(tid) == SMU_ESPN else "o" if str(tid) == str(em["team"]) else None
    start = f"{CUR[sport]}-07-01"
    out = {}
    # season leaders
    L = {}
    for t in d.get("leaders") or []:
        k = side((t.get("team") or {}).get("id"))
        if not k:
            continue
        cats = {c.get("name"): c for c in t.get("leaders") or []}
        for name, label in LEAD_CATS["football" if sport == "football" else "bb"]:
            c = cats.get(name)
            ld = (c or {}).get("leaders") or []
            if not ld or not (ld[0].get("athlete") or {}).get("displayName"):
                continue
            x = ld[0]
            ms = x.get("mainStat") or {}
            L.setdefault(label, {})[k] = {"n": x["athlete"]["displayName"], "v": f"{ms.get('value', '')} {LOW.get(ms.get('label', ''), ms.get('label', ''))}".strip(),
                                          **({"d": re.sub(r"\b(CAR|REC|YDS|PTS|REB|AST)\b", lambda m: LOW[m.group(1)], x["summary"])} if x.get("summary") else {}),
                                          **({"pos": x["athlete"]["position"]["abbreviation"]} if (x["athlete"].get("position") or {}).get("abbreviation") else {})}
    rows = [{"c": label, **L[label]} for _, label in LEAD_CATS["football" if sport == "football" else "bb"] if label in L]
    if rows:
        out["leaders"] = rows
    # last five results this season, oldest first
    F = {}
    for t in d.get("lastFiveGames") or []:
        k = side((t.get("team") or {}).get("id"))
        if not k:
            continue
        ev = [e for e in t.get("events") or [] if start <= (e.get("gameDate") or "")[:10] < g["d"] and e.get("gameResult") in ("W", "L", "T") and e.get("score")]
        if ev:
            F[k] = [{"d": e["gameDate"][:10], "at": e.get("atVs") or "", "opp": (e.get("opponent") or {}).get("displayName") or "",
                     "r": e["gameResult"], "sc": e["score"]} for e in ev[-5:]]
    if F:
        out["form"] = F
    # records
    R = {}
    for c in ((d.get("header") or {}).get("competitions") or [{}])[0].get("competitors") or []:
        k = side((c.get("team") or {}).get("id"))
        recs = {r.get("type"): r.get("summary") for r in c.get("record") or []}
        if k and recs.get("total"):
            R[k] = recs["total"] + (f" ({recs['vsconf']} ACC)" if recs.get("vsconf") else "")
    if "s" in R and "o" in R:
        out["rec"] = R
    if out:
        out["src"] = {"n": "ESPN game preview", "u": u}
    return out


def upcoming(g, smu_season, cur_cards, hist, emap, opp_cache):
    out = {"kind": "pre"}
    sport = g["sport"]
    card = next((c for c in cur_cards if c["d"] == g["d"]), None)
    # season comparison
    if smu_season and not g.get("ex"):
        key = (sport, g["opp"])
        if key not in opp_cache:
            opp = None
            site = card and card.get("site")
            if site and "smumustangs" not in site:
                try:
                    opp = sidearm_season("https://" + host(site), sport, CUR[sport], g["opp"])
                except Exception:  # noqa: BLE001
                    opp = None
                if opp:
                    opp["srcn"] = f"{g['opp']} official athletics site"
            if not opp:
                dd = datetime.strptime(g["d"], "%Y-%m-%d")
                em = next((emap[k] for k in (g["d"], (dd - timedelta(days=1)).strftime("%Y-%m-%d"), (dd + timedelta(days=1)).strftime("%Y-%m-%d")) if k in emap), None)
                if em:
                    try:
                        opp = espn_season(sport, em["team"], CUR[sport])
                    except Exception as e:  # noqa: BLE001
                        print(f"  ! ESPN stats {g['opp']}: {e}", file=sys.stderr)
                    if opp:
                        opp["srcn"] = "ESPN team stats"
            opp_cache[key] = opp
        opp = opp_cache[key]
        if opp:
            rows = []
            if smu_season.get("rec") and opp.get("rec"):
                both = smu_season.get("conf") and opp.get("conf")
                rows.append({"l": "Record", "s": smu_season["rec"] + (f" ({smu_season['conf']} ACC)" if both else ""), "o": opp["rec"] + (f" ({opp['conf']} ACC)" if both else "")})
            for label, k, low, f in ROWS["football" if sport == "football" else "bb"]:
                a, b = smu_season["stats"].get(k), opp["stats"].get(k)
                if a is None or b is None:
                    continue
                rows.append({"l": label, "s": f.format(a), "o": f.format(b), "sv": a, "ov": b, **({"low": 1} if low else {})})
            if len(rows) >= 3:
                out["season"] = {"rows": rows, "src": [{"n": "SMU Athletics season stats", "u": smu_season["u"]}, {"n": opp["srcn"], "u": opp["u"]}]}
    # last meeting (previous seasons + earlier this season)
    me = dict(card or {}, opp=g["opp"])
    past = [h for h in hist + [c for c in cur_cards if c["d"] < g["d"]] if h.get("res") and same_team(h, me)]
    if past:
        h = max(past, key=lambda h: h["d"])
        out["last"] = {"d": h["d"], "res": h["res"], "ha": h["ha"], "opp": h["opp"], **({"u": h["box"]} if h.get("box") else {}),
                       "src": f"{BASE}/sports/{sport}/schedule/{season_path(sport, int(h['d'][:4]) - (0 if sport == 'football' or int(h['d'][5:7]) >= 7 else 1))}"}
    # season leaders, last five results and records (ESPN game preview); basketball only once SMU's season has started
    if not g.get("ex") and (sport == "football" or smu_season):
        pv = espn_preview(sport, g, emap, g["opp"])
        if pv:
            out["pv"] = pv
    return out if len(out) > 1 else None


def main():
    s = open(GAMES).read()
    G = json.loads(s[s.index("MP.GAMES=") + 9:s.rstrip().rindex(";")])["games"]
    box, notes = {}, []
    for sport in ("football", "mens-basketball", "womens-basketball"):
        SG = [g for g in G if g["sport"] == sport]
        if not SG:
            continue
        for g in SG:
            if g.get("res"):
                d = completed(g)
                if d:
                    box[g["id"]] = d
                    print(f"{g['id']} {g['opp']}: final, {', '.join(k for k in ('line', 'stats', 'leaders', 'scoring') if k in d)} from {d['src'][0]['n']}")
                else:
                    notes.append(f"{g['id']} {g['opp']}: no readable official box score")
        up = [g for g in SG if not g.get("res")]
        if not up:
            continue
        try:
            smu = sidearm_season(BASE, sport, CUR[sport], "SMU")
        except Exception as e:  # noqa: BLE001
            print(f"  ! SMU season stats {sport}: {e}", file=sys.stderr)
            smu = None
        try:
            cur = sched_cards(sport, CUR[sport])
        except Exception as e:  # noqa: BLE001
            print(f"  ! schedule {sport}: {e}", file=sys.stderr)
            cur = []
        hist = history(sport)
        emap = espn_map(sport)
        oc = {}
        for g in up:
            d = upcoming(g, smu, cur, hist, emap, oc)
            if d:
                box[g["id"]] = d
        n_s = sum(1 for g in up if "season" in box.get(g["id"], {}))
        n_l = sum(1 for g in up if "last" in box.get(g["id"], {}))
        n_p = sum(1 for g in up if "leaders" in box.get(g["id"], {}).get("pv", {}))
        n_f = sum(1 for g in up if "form" in box.get(g["id"], {}).get("pv", {}))
        print(f"{sport}: {len(up)} upcoming, {n_s} with season comparison, {n_l} with last meeting, {n_p} with season leaders, {n_f} with last five" + ("" if smu else " (no SMU season stats yet)"))
    checked = datetime.now().strftime("%b. %-d, %Y").replace("May.", "May")
    js = ("/* Game-day stats, generated by tools/build_boxscores.py from official SMU Athletics box scores, Game Center and\n"
          "   season stats pages (opponent season stats from the opponent's official site, else ESPN). Do not edit by hand. */\n"
          "window.MP=window.MP||{};MP.BOX=" + json.dumps({"checked": checked, "games": box}, ensure_ascii=False, separators=(",", ":")) + ";\n")
    open(OUT, "w").write(js)
    print(f"Wrote {OUT}: {len(box)} games" + ("".join("\n  - " + n for n in notes)))
    return 0


if __name__ == "__main__":
    sys.exit(main())
