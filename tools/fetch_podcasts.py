#!/usr/bin/env python3
"""Refresh data/podcasts-feed.json from the public RSS feed of each show in data/podcasts.json.

No API key. For each show it reads the RSS feed, keeps episodes that have an audio enclosure, applies the
show's title filter ("smu" for broader shows), drops listed title prefixes and episodes reposted from another
show in the list, and records the title, date, length and audio URL. Show cover art is taken from the feed
itself (itunes:image), shrunk to a small WebP in assets/img/pods/. Episode links to Apple Podcasts come from
Apple's public lookup API when the episode is in the latest 200; otherwise the card links to the show.
The file is rewritten only when the episode lists change.

Usage: python3 tools/fetch_podcasts.py [--check]   (--check: print the result, write nothing)
"""
import hashlib, io, json, os, re, sys, time, urllib.error, urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone, timedelta
from email.utils import parsedate_to_datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SHOWS = os.path.join(ROOT, "data", "podcasts.json")
OUT = os.path.join(ROOT, "data", "podcasts-feed.json")
ART_DIR = os.path.join(ROOT, "assets", "img", "pods")
PER_SHOW = 12         # episodes kept per show row
BROAD_DAYS = 120      # broader shows: SMU-titled episodes from this many days back
NEW_TOTAL = 12        # episodes in the combined New episodes row
NEW_PER_SHOW = 2      # so one daily show cannot fill the New row
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
IT = "{http://www.itunes.com/dtds/podcast-1.0.dtd}"
FILTERS = {"smu": re.compile(r"\bSMU\b|Mustangs|Lashlee|Kevin Jennings", re.I)}
# Episodes titled around recruits (often high-school players) stay off the page, in every show.
RECRUIT = re.compile(r"\brecruit|\bcommits?\b|\bcommitment|\b[345]-star\b|\bofficial visit", re.I)


def get(url, tries=3, binary=False):
    last = None
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "*/*"})
            with urllib.request.urlopen(req, timeout=40) as r:
                b = r.read()
                return r.status, (b if binary else b.decode("utf-8", "replace"))
        except urllib.error.HTTPError as e:
            if e.code in (401, 403, 404, 410):
                return e.code, b"" if binary else ""
            last = e
        except Exception as e:
            last = e
        time.sleep(2 * (i + 1))
    raise RuntimeError(f"{url}: {last}")


def norm(t):
    return re.sub(r"[^a-z0-9]+", " ", t.lower().replace("\u2019", "'")).strip()


def base(t):
    """Title without a trailing ' | Show name' tag, so a repost with the source show's name appended still matches."""
    return norm(t.split(" | ")[0])


def secs(v):
    v = (v or "").strip()
    if not v:
        return 0
    if re.fullmatch(r"\d+(\.\d+)?", v):
        return int(float(v))
    p = [int(x) for x in v.split(":") if x.isdigit()]
    s = 0
    for x in p:
        s = s * 60 + x
    return s


def dur(s):
    if not s:
        return ""
    m = round(s / 60)
    if m < 60:
        return f"{max(m, 1)} min"
    return f"{m // 60} hr {m % 60} min" if m % 60 else f"{m // 60} hr"


def parse(body):
    root = ET.fromstring(body.encode("utf-8") if isinstance(body, str) else body)
    ch = root.find("channel")
    art = ""
    im = ch.find(IT + "image")
    if im is not None and im.get("href"):
        art = im.get("href")
    elif ch.find("image/url") is not None:
        art = ch.findtext("image/url", "")
    eps = []
    for it in ch.findall("item"):
        enc = it.find("enclosure")
        url = enc.get("url", "") if enc is not None else ""
        typ = enc.get("type", "") if enc is not None else ""
        if not url or (typ and not typ.startswith("audio")):
            continue
        try:
            pub = parsedate_to_datetime(it.findtext("pubDate", "")).astimezone(timezone.utc)
        except Exception:
            continue
        title = (it.findtext(IT + "title") or it.findtext("title") or "").strip()
        guid = (it.findtext("guid") or url).strip()
        eps.append({"guid": guid, "title": title, "pub": pub, "secs": secs(it.findtext(IT + "duration")), "audio": url})
    eps.sort(key=lambda e: e["pub"], reverse=True)
    return art, eps


def apple_links(apple_url):
    m = re.search(r"/id(\d+)", apple_url or "")
    if not m:
        return {}, {}
    try:
        st, body = get(f"https://itunes.apple.com/lookup?id={m.group(1)}&media=podcast&entity=podcastEpisode&limit=200")
        res = json.loads(body).get("results", []) if st == 200 else []
    except Exception:
        return {}, {}
    by_guid, by_title = {}, {}
    for r in res:
        if r.get("wrapperType") != "podcastEpisode" or not r.get("trackViewUrl"):
            continue
        u = r["trackViewUrl"].split("&uo=")[0].split("?uo=")[0]
        if r.get("episodeGuid"):
            by_guid[r["episodeGuid"]] = u
        by_title.setdefault(norm(r.get("trackName", "")), u)
    return by_guid, by_title


def save_art(key, url, problems):
    path = os.path.join(ART_DIR, key + ".webp")
    if not url:
        problems.append(f"{key}: feed has no cover art")
        return ""
    try:
        from PIL import Image
        st, b = get(url, binary=True)
        if st != 200 or not b:
            raise RuntimeError(f"HTTP {st}")
        im = Image.open(io.BytesIO(b)).convert("RGB")
        im.thumbnail((240, 240))
        buf = io.BytesIO()
        im.save(buf, "WEBP", quality=82)
        data = buf.getvalue()
        old = open(path, "rb").read() if os.path.exists(path) else b""
        if abs(len(old) - len(data)) > 64 or not old:  # re-encode noise aside, only rewrite real changes
            os.makedirs(ART_DIR, exist_ok=True)
            open(path, "wb").write(data)
        return "assets/img/pods/" + key + ".webp"
    except Exception as e:
        problems.append(f"{key}: cover art not saved ({e})")
        return "assets/img/pods/" + key + ".webp" if os.path.exists(path) else ""


def main():
    check = "--check" in sys.argv
    cfg = json.load(open(SHOWS))
    now = datetime.now(timezone.utc)
    problems, raw, arts = [], {}, {}
    for s in cfg["shows"]:
        try:
            st, body = get(s["rss"])
            if st != 200 or not body:
                raise RuntimeError(f"RSS returned {st}")
            arts[s["key"]], raw[s["key"]] = parse(body)
        except Exception as e:
            problems.append(f"{s['key']}: {e}")
            raw[s["key"]] = None
    old = json.load(open(OUT)) if os.path.exists(OUT) else {}
    old_shows = {x["key"]: x for x in old.get("shows", [])}
    shows = []
    for s in cfg["shows"]:
        k, eps = s["key"], raw.get(s["key"])
        if eps is None:  # feed down today: keep yesterday's episodes rather than emptying the row
            if k in old_shows:
                shows.append(old_shows[k])
            continue
        f = FILTERS.get(s.get("filter"))
        drop = tuple(s.get("drop_prefix", []))
        src = raw.get(s.get("dedupe_against")) or []
        other = {base(e["title"]) for e in src}
        other_tag = re.compile(r"\|\s*" + re.escape(s.get("dedupe_name", "")), re.I) if s.get("dedupe_name") else None
        seen, keep = set(), []
        for e in eps:
            t = e["title"]
            if f and (not f.search(t) or e["pub"] < now - timedelta(days=BROAD_DAYS)):
                continue
            if drop and t.startswith(drop):
                continue
            if RECRUIT.search(t):
                continue
            n = norm(t)
            if base(t) in other or (other_tag and other_tag.search(t)) or n in seen:
                continue
            seen.add(n)
            keep.append(e)
            if len(keep) >= PER_SHOW:
                break
        if not keep:
            problems.append(f"{k}: no episodes passed the filters")
            continue
        by_guid, by_title = apple_links(s.get("apple"))
        out = []
        for e in keep:
            ep = {"id": hashlib.sha1(e["guid"].encode()).hexdigest()[:10], "title": e["title"],
                  "published": e["pub"].strftime("%Y-%m-%dT%H:%M:%SZ"), "dur": dur(e["secs"]),
                  "audio": re.sub(r"^http://", "https://", e["audio"])}
            a = by_guid.get(e["guid"]) or by_title.get(norm(e["title"]))
            if a:
                ep["apple"] = a
            out.append(ep)
        meta = {"key": k, "name": s["name"], "apple": s.get("apple", ""), "spotify": s.get("spotify", ""),
                "art": save_art(k, arts.get(k), problems) if not check else "", "episodes": out}
        if s.get("filter") in FILTERS:
            meta["broad"] = True
        shows.append(meta)
    pool = sorted(((x["published"], x["id"], sh["key"], norm(x["title"])) for sh in shows for x in sh["episodes"]), reverse=True)
    new, per, titles = [], {}, set()
    for pub, i, k, n in pool:
        if per.get(k, 0) >= NEW_PER_SHOW or n in titles:
            continue
        per[k] = per.get(k, 0) + 1
        titles.add(n)
        new.append({"key": k, "id": i})
        if len(new) >= NEW_TOTAL:
            break
    res = {"generated": now.strftime("%Y-%m-%dT%H:%M:%SZ"), "shows": shows, "new": new}
    for p in problems:
        print("WARN", p, file=sys.stderr)
    for sh in shows:
        print(f"{sh['key']}: {len(sh['episodes'])} episodes, latest {sh['episodes'][0]['published'][:10]}")
    if check:
        return
    if old and {k: v for k, v in old.items() if k != "generated"} == {k: v for k, v in res.items() if k != "generated"}:
        print("No change.")
        return
    with open(OUT, "w") as fh:
        json.dump(res, fh, ensure_ascii=False, indent=1)
        fh.write("\n")
    print(f"Wrote {OUT}: {sum(len(s['episodes']) for s in shows)} episodes, {len(new)} in New episodes")


if __name__ == "__main__":
    main()
