#!/usr/bin/env python3
"""From Socials builder: account list + raw X reads -> data/socials.json (newest first, deduped, capped).

X reads go through Grok Bot's built-in public X tools (the `x` MCP namespace), which a script cannot call directly, so this is two steps:
  1. python3 tools/build_socials.py plan [accounts.json]   prints the reads to make (one get_users_by_usernames per 100 handles,
     then one get_users_posts per account with the fields below). Save each response into the raw dir
     (users*.json / posts-*.txt|json; the CallDynamicTool write_to_file output works as is).
  2. python3 tools/build_socials.py build [accounts.json] [raw_dir] [--cap 150] [--per N]   writes data/socials.json.
Rules: real posts only, as returned by X. Replies and reposts are skipped; quote posts are kept only from official and team accounts;
anything X flags possibly_sensitive is skipped. No like or repost counts are written.
Default list: /workspace/smu-media/from-socials-accounts.json when it exists, else tools/socials-accounts.starter.json.
"""
import json, os, sys, glob, datetime, re
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CURATED = '/workspace/smu-media/from-socials-accounts.json'
STARTER = os.path.join(ROOT, 'tools', 'socials-accounts.starter.json')
RAW = '/workspace/smu-media/socials-raw'
OUT = os.path.join(ROOT, 'data', 'socials.json')
CAP = 150
QUOTE_OK = {'official', 'teams'}
FIELDS = {'exclude': 'replies,retweets', 'max_results': 10,
          'tweet.fields': 'created_at,author_id,entities,attachments,possibly_sensitive,referenced_tweets,in_reply_to_user_id,lang,note_tweet',
          'expansions': 'attachments.media_keys,referenced_tweets.id', 'media.fields': 'type,url,preview_image_url,width,height,alt_text'}

def load_json_blob(path):
    t = open(path, encoding='utf-8').read()
    i = t.find('{"')
    return json.loads(t[i:t.rindex('}') + 1]) if i >= 0 else {}

def accounts(path=None):
    path = path or (CURATED if os.path.exists(CURATED) else STARTER)
    d = json.load(open(path, encoding='utf-8'))
    L = d['accounts'] if isinstance(d, dict) else d
    return path, {a['handle'].lower(): a for a in L}

def plan(acc):
    hs = [a['handle'] for a in acc.values()]
    for i in range(0, len(hs), 100):
        print(json.dumps({'tool': 'get_users_by_usernames', 'usernames': ','.join(hs[i:i + 100]), 'user.fields': 'name,username,profile_image_url,verified,verified_type,protected'}))
    print(json.dumps({'tool': 'get_users_posts', 'id': '<user id from step above>', **FIELDS}))
    print('# %d accounts -> %d reads (X limit: 30 a minute, 1000 a day)' % (len(hs), len(hs) + (len(hs) + 99) // 100), file=sys.stderr)

def build(acc, raw):
    users = {}
    for f in glob.glob(os.path.join(raw, 'users*')):
        for u in load_json_blob(f).get('data', []):
            users[u['id']] = u
    byname = {u['username'].lower(): u for u in users.values()}
    posts, seen, skipped = [], set(), {'reply': 0, 'repost': 0, 'quote': 0, 'sensitive': 0, 'unlisted': 0, 'protected': 0}
    for f in sorted(glob.glob(os.path.join(raw, 'posts-*'))):
        d = load_json_blob(f); hint = os.path.basename(f).split('.')[0][6:].lower()
        media = {m['media_key']: m for m in d.get('includes', {}).get('media', [])}
        for p in d.get('data', []):
            if p['id'] in seen: continue
            u = users.get(p.get('author_id')) or byname.get(hint)  # some reads come back without author_id: the file name carries the handle
            a = u and acc.get(u['username'].lower())
            if not a: skipped['unlisted'] += 1; continue
            if u.get('protected'): skipped['protected'] += 1; continue
            refs = {r['type'] for r in p.get('referenced_tweets', [])}
            if p.get('in_reply_to_user_id') or 'replied_to' in refs: skipped['reply'] += 1; continue
            if 'retweeted' in refs: skipped['repost'] += 1; continue
            if 'quoted' in refs and a['group'] not in QUOTE_OK: skipped['quote'] += 1; continue
            if p.get('possibly_sensitive'): skipped['sensitive'] += 1; continue
            seen.add(p['id'])
            text = (p.get('note_tweet') or {}).get('text') or p['text']
            ent = (p.get('note_tweet') or {}).get('entities') or p.get('entities') or {}
            ph = None
            for k in (p.get('attachments') or {}).get('media_keys', []):
                m = media.get(k)
                if not m: continue
                src = m.get('url') if m['type'] == 'photo' else m.get('preview_image_url')
                if src: ph = {'src': src, 'w': m.get('width'), 'h': m.get('height'), 'alt': m.get('alt_text') or '', 'video': m['type'] != 'photo'}; break
            urls = [{'u': x['url'], 'x': x.get('expanded_url') or x['url'], 'd': x.get('display_url') or x['url']} for x in ent.get('urls', [])
                    if not (x.get('media_key') or '/photo/' in (x.get('expanded_url') or '') or '/video/' in (x.get('expanded_url') or ''))]
            hide = [x['url'] for x in ent.get('urls', []) if x.get('media_key') or '/photo/' in (x.get('expanded_url') or '') or '/video/' in (x.get('expanded_url') or '')]
            for h in hide: text = text.replace(h, '').rstrip()
            if ph and not ent.get('urls'):  # read came back without entities: X puts the media link last, so drop that one t.co
                text = re.sub(r'\s*https://t\.co/\w+$', '', text)
            posts.append({'id': p['id'], 'h': u['username'], 'n': u['name'], 'av': u.get('profile_image_url', '').replace('_normal.', '_bigger.'),
                          'g': a['group'], 'r': a.get('rank', 999), 't': p['created_at'], 'txt': text, 'urls': urls,
                          'q': 'quoted' in refs, 'ph': ph, 'url': 'https://x.com/%s/status/%s' % (u['username'], p['id'])})
    posts.sort(key=lambda x: (x['t'], -x['r']), reverse=True)
    if PER:  # at most PER posts per account (mockups, or to stop one busy account filling the feed)
        n = {}; keep = []
        for x in posts:
            n[x['h']] = n.get(x['h'], 0) + 1
            if n[x['h']] <= PER: keep.append(x)
        posts = keep
    posts = posts[:CAP]
    out = {'checked': datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'), 'source': 'Public posts read from X', 'count': len(posts), 'posts': posts}
    json.dump(out, open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    print('wrote %s: %d posts from %d accounts; skipped %s' % (os.path.relpath(OUT, ROOT), len(posts), len({p['h'] for p in posts}), skipped))

if __name__ == '__main__':
    args = sys.argv[1:]; PER = 0
    for flag in ('--cap', '--per'):
        if flag in args:
            i = args.index(flag); v = int(args[i + 1]); del args[i:i + 2]
            if flag == '--cap': CAP = v
            else: PER = v
    sys.argv = [sys.argv[0]] + args
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'build'
    path, acc = accounts(sys.argv[2] if len(sys.argv) > 2 else None)
    print('accounts: %s (%d)' % (path, len(acc)), file=sys.stderr)
    if cmd == 'plan': plan(acc)
    else: build(acc, sys.argv[3] if len(sys.argv) > 3 else RAW)
