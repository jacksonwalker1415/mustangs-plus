#!/usr/bin/env node
/* Build data/search-index.json for the site search page (search/). Prebuilt, client-side index of everything that is
   static on the site: videos (library + data/videos-feed.json outlet rows), articles, podcasts, players (every roster in
   assets/real.js, football profiles in assets/athletes.js), sports and game pages. Forum posts are NOT in here: the search
   page asks Supabase for them live. Usage: node tools/build_search.js */
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.dirname(__dirname);
const ctx = { window: {} }; ctx.window.window = ctx.window; ctx.MP = ctx.window.MP = {};
vm.createContext(ctx);
for (const f of ['data', 'content', 'real', 'athletes', 'games'])
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'assets', f + '.js'), 'utf8'), ctx, { filename: f + '.js' });
const MP = ctx.window.MP;
const feed = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'videos-feed.json'), 'utf8'));
const sportName = {}; MP.SPORTS.forEach(s => sportName[s.slug] = s.name);
const docs = [], seen = new Set(), seenVid = new Set();
const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\u2018\u2019']/g, '').replace(/\s+/g, ' ').trim();
const vidKey = t => norm(t).replace(/\b\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4}\b/g, ' ').replace(/\bpost game\b/g, 'postgame').replace(/\bvs\b\.?/g, 'vs').replace(/[^a-z0-9&]+/g, ' ').trim();
function add(d, yt) {
  const k = d.t + '|' + d.u + '|' + d.ti; if (seen.has(k)) return; seen.add(k);
  /* one row per video: the library copy wins (it is added first), outlet-feed repeats of the same YouTube id or the same title are dropped */
  if (d.t === 'video') { const a = yt && 'yt:' + yt, b = 'ti:' + vidKey(d.ti); if ((a && seenVid.has(a)) || seenVid.has(b)) return; if (a) seenVid.add(a); seenVid.add(b) }
  d.h = norm([d.ti, d.s, d.h].join(' ')); docs.push(d) }
const KIND = { video: 'video', article: 'article', podcast: 'podcast' };
/* Recruiting is unpublished: none of its items go in the index */
const REC_RE = /recruit|portal|visit weekend|visit list|offer tracker|commitment|2028 (board|class)/i;
MP.LIB.filter(c => c.cat !== 'recruiting' && !REC_RE.test([c.title, c.label, c.desc].join(' '))).forEach(c => {
  add({ t: KIND[c.t], ti: c.title, s: c.label + (c.dur ? ' · ' + c.dur : ''), u: (c.t === 'article' ? '#article=' : '#watch=') + c.id,
        h: [c.desc, sportName[c.sport] || '', c.credit || ''].join(' '), ...(c.expires ? { x: c.expires } : {}) }, c.yt);
});
const MON = ['Jan.', 'Feb.', 'March', 'April', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
const fmt = iso => { const d = new Date(iso); return isNaN(d) ? '' : MON[d.getUTCMonth()] + ' ' + d.getUTCDate() + ', ' + d.getUTCFullYear() };
(feed.channels || []).forEach(ch => (ch.videos || []).forEach(v => {
  add({ t: 'video', ti: v.title, s: ch.name + (v.published ? ' · ' + fmt(v.published) : ''), u: 'library/#watch=yt-' + v.id, h: ch.name + ' youtube', d: v.published }, v.id);
}));
const prof = {}; (MP.ATHLETES || []).forEach(a => prof[a.sport + '|' + a.name] = a.id);
Object.keys(MP.REAL).forEach(slug => (MP.REAL[slug].roster || []).forEach(p => {
  const id = prof[slug + '|' + p.name], nm = sportName[slug] || slug;
  add({ t: 'player', ti: p.name, s: [p.num != null && p.num !== '' ? '#' + p.num : '', p.pos, p.cls, nm].filter(Boolean).join(' · '),
        u: id ? 'athletes/?id=' + id : 'sports/' + slug + '/#roster', h: [p.town, p.prev, p.team === 'M' ? "men's" : p.team === 'W' ? "women's" : ''].join(' ') });
}));
/* Shorthand fans type. Sport aliases go on every doc about that sport (k on the sport row itself, so it ranks first);
   opponent aliases go on every doc that names the opponent. Matching on the search page is by word start. */
const SPORT_ALIAS = {
  'football': 'fb cfb', 'mens-basketball': 'mbb hoops', 'womens-basketball': 'wbb hoops', 'womens-soccer': 'wsoc soccer',
  'mens-soccer': 'msoc soccer', 'volleyball': 'vb vball', 'swimming-diving': 'swim swimming diving', 'golf': 'golf',
  'tennis': 'tennis', 'track-field': 'xc cross country track field', 'rowing': 'crew', 'equestrian': 'horses riding'
};
const OPP_ALIAS = [
  [/\bcal\b/, 'california golden bears'], [/\bcalifornia\b/, 'cal golden bears'], [/(^|[^a-z])(?<!(west|east) )texas a&m\b/, 'tamu aggies'],
  [/\bpitt\b/, 'pittsburgh panthers'], [/\bpittsburgh\b/, 'pitt'], [/\bvirginia military institute\b/, 'vmi'],
  [/\bnorth carolina\b(?! state)/, 'unc tar heels'], [/\bnc state\b/, 'north carolina state ncsu'], [/\bgeorgia tech\b/, 'gt yellow jackets'],
  [/\bvirginia tech\b/, 'vt hokies'], [/\bboston college\b/, 'bc eagles'], [/(?<!west |military institute )\bvirginia\b(?! tech| military)/, 'uva cavaliers'],
  [/\bnotre dame\b/, 'nd irish'], [/\bflorida state\b/, 'fsu seminoles'], [/\blsu\b/, 'louisiana state tigers'],
  [/\butsa\b/, 'ut san antonio roadrunners'], [/\bunlv\b/, 'las vegas'], [/\bstephen f\. austin\b/, 'sfa'],
  [/\bkansas state\b/, 'k state ksu'], [/\bsyracuse\b/, 'cuse orange'], [/\bwake forest\b/, 'wake demon deacons'],
  [/\bsouthern methodist\b/, 'smu'], [/\bmiami\b/, 'hurricanes canes']
];
const SPORT_RE = MP.SPORTS.map(sp => [sp.slug, new RegExp('(^|[^a-z])' + norm(sp.name).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b')]);
MP.SPORTS.forEach(s => add({ t: 'sport', ti: s.name, s: s.season + ' · ' + (s.coach || ''), u: 'sports/' + s.slug + '/', h: s.slug.replace(/-/g, ' '), k: SPORT_ALIAS[s.slug] || '' }));
const G = (MP.GAMES && MP.GAMES.games) || [];
G.forEach(g => add({ t: 'game', ti: 'SMU ' + (g.ha === 'away' ? 'at ' : 'vs. ') + g.opp, s: sportName[g.sport] + ' · ' + g.dow + '., ' + fmt(g.d + 'T12:00:00Z') + (g.res ? ' · ' + g.res : ''),
  u: 'games/?id=' + g.id, h: [g.venue, g.city, g.tv].join(' ') }));
/* Site pages, so "faq", "privacy", "account" or "join" find the page. u is relative to the site root ('./#x' = the home page). */
const PAGES = [
  ['SMU+ home', 'The front page: games, video and stories from every Mustang sport', './', 'home front page main start'],
  ['Join SMU+', 'Join the SMU+ waitlist (concept, no payments taken)', './#waitlist', 'join membership member members sign up signup waitlist subscribe'],
  ['All sports', 'Every SMU sport on SMU+', './#sports', 'sports teams all sports'],
  ['FAQ', 'Questions about SMU+, NIL and the boards, answered', 'faq/', 'faq faqs questions help answers how it works nil'],
  ['Privacy notice', 'What SMU+ collects, where it is kept and how to delete it', 'privacy/', 'privacy data delete deletion cookies policy personal information'],
  ['About this project', 'SMU+ is an SMU Cox MBA class project, not affiliated with SMU', 'privacy/#about', 'about project class disclaimer cox mba affiliated'],
  ['Contact SMU+', 'How to reach the SMU+ team', 'privacy/#contact', 'contact email help support reach'],
  ['Community rules', 'The rules for the message boards', 'rules/', 'rules guidelines conduct code of conduct moderation report'],
  ['Your account', 'Sign in, your profile, saved players and settings', 'account/', 'account sign in signin login log in profile settings password saved'],
  ...(MP.FEATURES && MP.FEATURES.students !== false ? [['Student sign-up', 'SMU students sign up with an @smu.edu email', 'account/#student', 'student students smu edu sign up']] : []),
  ['Message Boards', 'Talk SMU sports with other fans', 'boards/', 'boards board forum forums message boards mustang board community'],
  ['Media library', 'Every video, podcast and story on SMU+', 'library/', 'media library watch videos podcasts articles stories'],
  ['Videos', 'Highlights, press conferences and series', 'library/?type=video', 'videos video highlights watch'],
  ['Podcasts', 'SMU podcasts and episodes', 'library/?type=podcast', 'podcasts podcast episodes listen'],
  ['Articles', 'Stories, previews and recaps', 'library/?type=article', 'articles stories news read recaps previews'],
  ['Game day', 'Schedules, results, kickoff times and where to watch', 'games/', 'game day games schedule schedules scores results kickoff tv watch tickets'],
  ['Football player profiles', 'Profiles of SMU football players', 'athletes/', 'players player profiles roster athletes football'],
  ['Search', 'Search all of SMU+', 'search/', 'search find'],
  ...(MP.FEATURES && MP.FEATURES.recruiting ? [['Recruiting & Portal', 'Recruiting and transfer portal news', 'recruiting/', 'recruiting recruits portal transfer']] : [])
];
PAGES.forEach(p => add({ t: 'page', ti: p[0], s: p[1], u: p[2], h: '', k: p[3] }));
/* aliases: appended to the searchable text only (never shown) */
docs.forEach(d => {
  const extra = [];
  if (d.k) extra.push(d.k);
  SPORT_RE.forEach(([slug, re]) => { if (d.t !== 'page' && d.t !== 'sport' && re.test(d.h) && SPORT_ALIAS[slug]) extra.push(SPORT_ALIAS[slug]) });
  OPP_ALIAS.forEach(([re, a]) => { if (d.t !== 'page' && d.t !== 'player' && re.test(d.h)) extra.push(a) });
  if (extra.length) d.h = norm(d.h + ' ' + extra.join(' '));
});
const out = { built: new Date().toISOString(), docs };
fs.writeFileSync(path.join(ROOT, 'data', 'search-index.json'), JSON.stringify(out));
const c = {}; docs.forEach(d => c[d.t] = (c[d.t] || 0) + 1);
console.log('search-index.json:', docs.length, 'docs', JSON.stringify(c), fs.statSync(path.join(ROOT, 'data', 'search-index.json')).size, 'bytes');
