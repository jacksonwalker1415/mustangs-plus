#!/usr/bin/env python3
"""Refresh data/videos-feed.json from the public YouTube RSS feed of each channel in data/channels.json.

No API key. For each channel it reads https://www.youtube.com/feeds/videos.xml?channel_id=ID, drops Shorts,
keeps only videos whose title names SMU for broader channels (see "filter" in channels.json), checks each video is embeddable (YouTube
oEmbed returns 200) and records the length when the watch page gives it. It also records each video's public view count from
the same RSS entry (<media:statistics views="...">, YouTube's own number, as of the refresh); the site's "Most watched this week"
module ranks by it. View counts change every day, so the file is rewritten on most runs.

Usage: python3 tools/fetch_youtube.py [--check]   (--check: print the result, write nothing)
"""
import json, os, re, sys, time, urllib.error, urllib.parse, urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHANNELS = os.path.join(ROOT, "data", "channels.json")
OUT = os.path.join(ROOT, "data", "videos-feed.json")
PER_CHANNEL = 12      # videos kept per outlet row
NEW_TOTAL = 12        # videos in the combined New row
NEW_PER_OUTLET = 3    # so one busy channel cannot fill the New row
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
NS = {"a": "http://www.w3.org/2005/Atom", "yt": "http://www.youtube.com/xml/schemas/2015",
      "media": "http://search.yahoo.com/mrss/"}
# Broader channels: the title has to name SMU. "smu" mode is stricter for local TV and radio, where a
# "Mustangs" or "Ponies" headline is often a high school.
FILTERS = {
    "title": re.compile(r"\bSMU\b|\bMustangs\b|\bPonies\b", re.I),
    "smu": re.compile(r"\bSMU\b|\bSouthern Methodist\b", re.I),
}
KEEP_DAYS = 120       # a video found earlier stays in its row this long, even after it drops out of the 15-entry RSS
ID_RE = re.compile(r"^[A-Za-z0-9_-]{11}$")


def get(url, tries=3):
    last = None
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "en-US,en;q=0.9"})
            with urllib.request.urlopen(req, timeout=20) as r:
                return r.status, r.read().decode("utf-8", "replace")
        except urllib.error.HTTPError as e:
            if e.code in (401, 403, 404):
                return e.code, ""
            last = e
        except Exception as e:  # network hiccup: retry
            last = e
        time.sleep(1.5 * (i + 1))
    raise RuntimeError(f"{url}: {last}")


def feed(channel_id):
    status, body = get("https://www.youtube.com/feeds/videos.xml?channel_id=" + channel_id)
    if status != 200 or not body:
        raise RuntimeError(f"RSS returned {status}")
    root = ET.fromstring(body)
    out = []
    for e in root.findall("a:entry", NS):
        vid = e.findtext("yt:videoId", "", NS)
        link = (e.find("a:link", NS).get("href") if e.find("a:link", NS) is not None else "")
        g = e.find("media:group", NS)
        st = g.find("media:community/media:statistics", NS) if g is not None else None
        views = st.get("views") if st is not None else None
        out.append({
            "id": vid,
            "title": (e.findtext("a:title", "", NS) or "").strip(),
            "published": e.findtext("a:published", "", NS),
            "desc": (g.findtext("media:description", "", NS) if g is not None else "") or "",
            "short": "/shorts/" in link,
            "views": int(views) if views and views.isdigit() else None,
        })
    return out


def embeddable(vid):
    url = "https://www.youtube.com/oembed?format=json&url=" + urllib.parse.quote("https://www.youtube.com/watch?v=" + vid, safe="")
    try:
        return get(url)[0] == 200
    except RuntimeError:
        return False


def has_maxres(vid):
    try:
        req = urllib.request.Request(f"https://i.ytimg.com/vi/{vid}/maxresdefault.jpg", method="HEAD", headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=15) as r:
            return r.status == 200
    except urllib.error.HTTPError as e:
        return e.code != 404
    except Exception:
        return True


def watch_info(vid):
    """Best effort: (length in seconds or None, upcoming?). YouTube may serve a consent page; then both are unknown."""
    try:
        status, html = get("https://www.youtube.com/watch?v=" + vid, tries=2)
    except RuntimeError:
        return None, False
    if status != 200:
        return None, False
    m = re.search(r'"lengthSeconds":"(\d+)"', html)
    return (int(m.group(1)) if m else None), bool(re.search(r'"isUpcoming":true', html))


def clock(s):
    h, r = divmod(s, 3600)
    m, s = divmod(r, 60)
    return f"{h}:{m:02d}:{s:02d}" if h else f"{m}:{s:02d}"


def main():
    check = "--check" in sys.argv
    cfg = json.load(open(CHANNELS))
    prev = {}
    if os.path.exists(OUT):
        try:
            old = json.load(open(OUT))
            prev = {c["key"]: c for c in old.get("channels", [])}
        except ValueError:
            old = {}
    else:
        old = {}
    known = {v["id"]: v for c in prev.values() for v in c.get("videos", [])}

    cutoff = time.time() - KEEP_DAYS * 86400
    channels, failed = [], []
    for ch in cfg["channels"]:
        meta = {"key": ch["key"], "name": ch["name"], "url": ch["url"]}
        if ch.get("filter", "none") != "none":
            meta["broad"] = True  # covers more than SMU; the game-day hub asks for "SMU vs. <opponent>" in the title
        before = prev.get(ch["key"], {}).get("videos", [])
        try:
            entries = feed(ch["id"])
        except Exception as e:
            print(f"! {ch['name']}: {e}; keeping the previous list", file=sys.stderr)
            failed.append(ch["key"])
            channels.append({**meta, "videos": before})
            continue
        rx = FILTERS.get(ch.get("filter", "none"))
        vids, skipped = [], {"short": 0, "off-topic": 0, "not embeddable": 0, "upcoming": 0}
        for v in entries:
            if len(vids) >= PER_CHANNEL:
                break
            if not ID_RE.match(v["id"]):
                continue
            if v["short"] or re.search(r"#shorts?\b", v["title"] + " " + v["desc"], re.I):
                skipped["short"] += 1
                continue
            if rx and not rx.search(v["title"]):
                skipped["off-topic"] += 1
                continue
            if not embeddable(v["id"]):
                skipped["not embeddable"] += 1
                continue
            dur = known.get(v["id"], {}).get("dur")
            if not dur:
                secs, upcoming = watch_info(v["id"])
                if upcoming:
                    skipped["upcoming"] += 1
                    continue
                dur = clock(secs) if secs else None
            item = {"id": v["id"], "title": v["title"], "published": v["published"]}
            if v["views"] is not None:
                item["views"] = v["views"]  # public view count from YouTube's feed; never estimated
            if dur:
                item["dur"] = dur
            if (known[v["id"]].get("nomax") if v["id"] in known else not has_maxres(v["id"])):
                item["nomax"] = True  # no HD thumbnail: the page asks for hqdefault directly instead of logging a 404
            vids.append(item)
        # carry forward earlier finds that have scrolled out of the RSS window, if still recent and still embeddable
        in_feed = {v["id"] for v in entries}
        for v in before:
            if v["id"] in in_feed or len(vids) >= PER_CHANNEL * 2:
                continue
            try:
                ts = datetime.fromisoformat(v["published"]).timestamp()
            except ValueError:
                continue
            if ts >= cutoff and embeddable(v["id"]):
                vids.append({k: x for k, x in v.items() if k != "views"})  # out of the feed: no fresh count, so none shown
        vids = sorted(vids, key=lambda v: v["published"], reverse=True)[:PER_CHANNEL]
        print(f"{ch['name']}: {len(vids)} kept, skipped {skipped}")
        channels.append({**meta, "videos": vids})

    if len(failed) == len(cfg["channels"]):
        print("Every feed failed; leaving the file alone.", file=sys.stderr)
        return 1

    pool = sorted(((v["published"], c["key"], v["id"], v["title"]) for c in channels for v in c["videos"]), reverse=True)
    new, per, seen = [], {}, set()
    for _, key, vid, title in pool:
        same_title = re.sub(r"\W+", " ", title).strip().lower()  # one show posted on two channels counts once
        if vid in seen or same_title in seen or per.get(key, 0) >= NEW_PER_OUTLET:
            continue
        seen.update((vid, same_title))
        per[key] = per.get(key, 0) + 1
        new.append({"key": key, "id": vid})
        if len(new) >= NEW_TOTAL:
            break

    by_key = {c["key"]: c for c in cfg["channels"]}
    rows = []
    for r in cfg["rows"]:
        members = [c["key"] for c in cfg["channels"] if c.get("row") == r["key"]]
        one = by_key[members[0]] if len(members) == 1 else None
        rows.append({"key": r["key"], "name": r["name"], "url": one["url"] if one else None, "channels": members})

    data = {"updated": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
            "source": "Public YouTube RSS feeds, checked embeddable via YouTube oEmbed. Built by tools/fetch_youtube.py.",
            "rows": rows, "channels": channels, "new": new}
    if check:
        print(json.dumps(data, indent=1, ensure_ascii=False)[:4000])
        return 0
    same = old and {k: old.get(k) for k in ("rows", "channels", "new")} == {k: data[k] for k in ("rows", "channels", "new")}
    if same:
        print("No change.")
        return 0
    with open(OUT, "w") as f:
        json.dump(data, f, indent=1, ensure_ascii=False)
        f.write("\n")
    print(f"Wrote {OUT}: {sum(len(c['videos']) for c in channels)} videos, {len(new)} in New.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
