#!/usr/bin/env python3
"""From Socials builder: curator account list + raw public X reads -> data/socials.json.

The page (socials/index.html + assets/socials-feed.js) shows each post as X's own embed (blockquote.twitter-tweet + widgets.js),
so this file carries only post ids, order, author name/handle, time and a short text excerpt (used before the embed loads and as
the text-only fallback). No avatars, photos, bios or like/repost counts are stored.

REFRESH STEPS (a routine can run these as written; full details in tools/README-socials.md)
  1. python3 tools/build_socials.py plan > /tmp/socials-plan.jsonl
       Prints one JSON line per X read to make, in order. Each line has "tool" (an x MCP tool), "args" and "save" (file name).
       Timeline reads use the user ids in RAW_DIR/users.json; if that file is missing, make the first read, save it, run plan again.
  2. For every line: call the x MCP tool with "args" (CallDynamicTool namespace "x", write_to_file true) and copy the
       result file to RAW_DIR/<save>. Stay under 30 reads a minute (pause 60 s after every 25) and 1000 a day.
  3. python3 tools/build_socials.py fill > /tmp/socials-fill.jsonl
       Prints get_posts_by_ids reads (100 ids each) for posts whose read came back without link details or the sensitive
       flag. Make them the same way (save as lookup-<n>.txt). Prints nothing when no re-read is needed.
  4. python3 tools/build_socials.py build      -> writes data/socials.json and prints a summary.
Options: build [--cap 150] [--per 12]. Paths: ACCOUNTS (curator list) and RAW_DIR below; override with env SOCIALS_ACCOUNTS / SOCIALS_RAW.

Rules applied at build time
  - Accounts: the curator's top TOP ranked, minus anything marked EXCLUDE or held (possible minors, injured, fan/NIL accounts,
    general news desks) and minus DROP (Counsel, Oct 27).
  - Original posts only: replies, reposts and quote posts are skipped. Same-text duplicates are dropped.
  - possibly_sensitive true, or still unknown after step 3, is skipped.
  - Accounts the curator marked as covering more than SMU (flag mentions a keyword filter) keep only posts matching SMU_WORDS.
"""
import json, os, sys, glob, datetime, re
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ACCOUNTS = os.environ.get('SOCIALS_ACCOUNTS', '/workspace/smu-media/from-socials-accounts.json')
RAW = os.environ.get('SOCIALS_RAW', '/workspace/smu-media/socials-raw')
OUT = os.path.join(ROOT, 'data', 'socials.json')
AV_OUT = os.path.join(ROOT, 'data', 'x-avatars.json')
TOP = 25
# Counsel, Oct 27: accounts whose X picture reads as an SMU, team or ACC logo never get one (initials instead), even in Writers
NO_AVATAR = {'smumustangson3'}  # On3's red mustang reads as SMU's logo
DROP = {'billyembody', 'kevin8jennings', 'goodwin2026'}          # Counsel, Oct 27: NIL tie (On3 stays via @SMUMustangsOn3); athletes off for now
HOLD_WORDS = ('exclude', 'class-of-2026', 'out for the se', 'fan account', 'general news', 'hold', 'nil activity', 'unaffiliated')
SMU_WORDS = re.compile(r"\b(SMU|Mustangs?|Ponies|Pony ?Up|Pony Express|Hilltop|Peruna|Ford Stadium|Moody Coliseum|Lashlee|Dallas'? Team)\b", re.I)
CAP, PER = 150, 12
FIELDS = 'created_at,author_id,entities,attachments,possibly_sensitive,referenced_tweets,in_reply_to_user_id,lang,note_tweet'

def blob(path):
    t = open(path, encoding='utf-8').read(); i = t.find('{"')
    return json.loads(t[i:t.rindex('}') + 1]) if i >= 0 else {}

def group_of(a):
    g = a['group']
    if g == 'media': return 'writers'
    if g == 'athletes': return 'athletes'
    if g == 'official':  # team accounts read as Teams; the department and the coaches as Official
        return 'teams' if re.match(r"SMU (?!Athletics)", a['name']) else 'official'
    return None

def accounts():
    L = json.load(open(ACCOUNTS, encoding='utf-8'))
    L = L['accounts'] if isinstance(L, dict) else L
    keep = []
    for a in sorted((a for a in L if a.get('rank')), key=lambda a: a['rank']):
        h = a['handle'].lstrip('@'); fl = str(a.get('flag') or '').lower()
        if h.lower() in DROP or any(w in fl for w in HOLD_WORDS) or not group_of(a): continue
        keep.append({'h': h, 'n': a['name'], 'g': group_of(a), 'rank': a['rank'], 'kw': 'keyword' in fl, 'pw': 'paywall' in fl})
        if len(keep) >= TOP: break
    return keep

def user_ids():
    """handle (lower) -> X user id from RAW_DIR/users.json, if it is there"""
    f = os.path.join(RAW, 'users.json')
    if not os.path.exists(f): return {}
    d = blob(f); return {u['username'].lower(): u['id'] for u in d.get('data', []) if u.get('id')}

def plan(acc):
    def line(tool, args, save): print(json.dumps({'tool': tool, 'args': args, 'save': save}))
    ids = user_ids()   # ids rarely change; with users.json present the timeline reads carry real ids
    line('get_users_by_usernames', {'usernames': ','.join(a['h'] for a in acc), 'user.fields': 'name,username,protected,profile_image_url'}, 'users.json')
    for a in acc:
        if a['kw']:  # mixed-topic accounts: search their originals for SMU words instead of reading the whole timeline
            q = 'from:%s (SMU OR Mustangs OR Ponies OR "Pony Up" OR Hilltop OR Peruna OR "Ford Stadium" OR "Moody Coliseum" OR Lashlee) -is:retweet -is:reply -is:quote' % a['h']
            start = (datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=14)).strftime('%Y-%m-%dT00:00:00Z')
            line('search_posts_all', {'query': q, 'max_results': 15, 'sort_order': 'recency', 'start_time': start, 'tweet.fields': FIELDS, 'post.fields': FIELDS, 'expansions': 'referenced_tweets.id'}, 'posts-%s.txt' % a['h'])
        else:
            line('get_users_posts', {'id': ids.get(a['h'].lower(), '<id of @%s from users.json>' % a['h']), 'max_results': 15, 'exclude': 'replies,retweets', 'tweet.fields': FIELDS, 'post.fields': FIELDS, 'expansions': 'referenced_tweets.id'}, 'posts-%s.txt' % a['h'])
    print('# %d reads' % (len(acc) + 1), file=sys.stderr)

def raw_posts():
    look = {}
    for f in glob.glob(os.path.join(RAW, 'lookup-*')):
        for p in blob(f).get('data', []): look[p['id']] = p
    for f in sorted(glob.glob(os.path.join(RAW, 'posts-*'))):
        hint = os.path.basename(f).split('.')[0][6:].lower()
        for p in blob(f).get('data', []):
            q = dict(p); q.update(look.get(p['id'], {})); yield hint, q

def fill(acc):
    ids = [p['id'] for _, p in raw_posts() if 'possibly_sensitive' not in p]
    for i in range(0, len(ids), 100):
        print(json.dumps({'tool': 'get_posts_by_ids', 'args': {'ids': ','.join(ids[i:i + 100]), 'tweet.fields': FIELDS, 'post.fields': FIELDS}, 'save': 'lookup-%d.txt' % (i // 100 + 1)}))
    print('# %d posts need a re-read' % len(ids), file=sys.stderr)

def build(acc):
    users = {}
    for f in glob.glob(os.path.join(RAW, 'users*')):
        for u in blob(f).get('data', []): users[u['username'].lower()] = u
    A = {a['h'].lower(): a for a in acc}
    out, seen, texts = [], set(), set()
    sk = dict(reply=0, repost=0, quote=0, sensitive=0, unknown=0, off_topic=0, dup=0, not_listed=0)
    for hint, p in raw_posts():
        a = A.get(hint)
        if not a: sk['not_listed'] += 1; continue
        if p['id'] in seen: continue
        refs = {r['type'] for r in p.get('referenced_tweets', [])}
        if p.get('in_reply_to_user_id') or 'replied_to' in refs: sk['reply'] += 1; continue
        if 'retweeted' in refs: sk['repost'] += 1; continue
        if 'quoted' in refs: sk['quote'] += 1; continue
        if 'possibly_sensitive' not in p: sk['unknown'] += 1; continue
        if p['possibly_sensitive']: sk['sensitive'] += 1; continue
        text = (p.get('note_tweet') or {}).get('text') or p.get('text', '')
        if a['kw'] and not SMU_WORDS.search(text): sk['off_topic'] += 1; continue
        ent = (p.get('note_tweet') or {}).get('entities') or p.get('entities') or {}
        for u in ent.get('urls', []):  # excerpt: t.co -> display text; media links dropped (the embed shows the media)
            media = u.get('media_key') or re.search(r'/(photo|video)/\d', u.get('expanded_url') or '')
            text = text.replace(u['url'], '' if media else (u.get('display_url') or u['url']))
        text = re.sub(r'\s*https://t\.co/\w+', '', text).strip()
        key = re.sub(r'\W+', '', text.lower())[:120]
        if key and key in texts: sk['dup'] += 1; continue
        seen.add(p['id']); texts.add(key)
        u = users.get(hint, {})
        out.append({'id': p['id'], 'h': u.get('username', a['h']), 'n': u.get('name', a['n']), 'g': a['g'], 't': p['created_at'],
                    'x': text[:280], 'pw': a['pw'], 'm': bool((p.get('attachments') or {}).get('media_keys'))})
    out.sort(key=lambda x: x['t'], reverse=True)
    n = {}; keep = []
    for x in out:
        n[x['h']] = n.get(x['h'], 0) + 1
        if n[x['h']] <= PER: keep.append(x)
    keep = keep[:CAP]
    inf = {x['h'].lower() for x in keep}
    def av(a):
        """Writers only (Counsel, Oct 27): the X profile picture URL from this refresh's users read, hotlinked by the page and
        never downloaded. Official, team and coach accounts keep initials. Private, suspended or missing: no URL (initials)."""
        u = users.get(a['h'].lower())
        if a['g'] != 'writers' or a['h'].lower() in NO_AVATAR or not u or u.get('protected'): return {}
        url = str(u.get('profile_image_url') or '')
        if not re.match(r'^https://pbs\.twimg\.com/profile_images/[^\s"<>]+$', url) or 'default_profile' in url: return {}
        return {'av': url}
    follow = [{'h': users.get(a['h'].lower(), {}).get('username', a['h']), 'n': users.get(a['h'].lower(), {}).get('name', a['n']), 'g': a['g'], **av(a)}
              for a in acc if a['h'].lower() in inf]
    data = {'checked': datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'), 'source': 'Public posts read from X; shown as X embeds',
            'count': len(keep), 'accounts': follow, 'posts': keep}
    json.dump(data, open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    # the home page's "Conference and beat coverage" row reads writer/outlet avatars from here (small file, same refresh)
    avs = {a['h']: av(a)['av'] for a in acc if a['g'] == 'writers' and av(a)}
    json.dump({'checked': data['checked'], 'note': 'X profile picture URLs for writer and outlet accounts only; hotlinked, never stored',
               'avatars': avs}, open(AV_OUT, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    print('wrote %s: %d posts from %d of %d accounts; skipped %s' % (os.path.relpath(OUT, ROOT), len(keep), len(follow), len(acc), sk))

if __name__ == '__main__':
    args = sys.argv[1:]
    for flag in ('--cap', '--per'):
        if flag in args:
            i = args.index(flag); v = int(args[i + 1]); del args[i:i + 2]
            if flag == '--cap': CAP = v
            else: PER = v
    cmd = args[0] if args else 'build'
    acc = accounts()
    print('accounts: %s -> %d kept: %s' % (ACCOUNTS, len(acc), ' '.join('@' + a['h'] for a in acc)), file=sys.stderr)
    {'plan': plan, 'fill': fill, 'build': build}[cmd](acc)
