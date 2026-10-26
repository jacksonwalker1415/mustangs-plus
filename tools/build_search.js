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
const docs = [], seen = new Set();
const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\u2018\u2019']/g, '').replace(/\s+/g, ' ').trim();
function add(d) { const k = d.t + '|' + d.u + '|' + d.ti; if (seen.has(k)) return; seen.add(k); d.h = norm([d.ti, d.s, d.h].join(' ')); docs.push(d) }
const KIND = { video: 'video', article: 'article', podcast: 'podcast' };
MP.LIB.forEach(c => {
  add({ t: KIND[c.t], ti: c.title, s: c.label + (c.dur ? ' · ' + c.dur : ''), u: (c.t === 'article' ? '#article=' : '#watch=') + c.id,
        h: [c.desc, sportName[c.sport] || '', c.credit || ''].join(' '), ...(c.expires ? { x: c.expires } : {}) });
});
const MON = ['Jan.', 'Feb.', 'March', 'April', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
const fmt = iso => { const d = new Date(iso); return isNaN(d) ? '' : MON[d.getUTCMonth()] + ' ' + d.getUTCDate() + ', ' + d.getUTCFullYear() };
(feed.channels || []).forEach(ch => (ch.videos || []).forEach(v => {
  add({ t: 'video', ti: v.title, s: ch.name + (v.published ? ' · ' + fmt(v.published) : ''), u: 'library/#watch=yt-' + v.id, h: ch.name + ' youtube', d: v.published });
}));
const prof = {}; (MP.ATHLETES || []).forEach(a => prof[a.sport + '|' + a.name] = a.id);
Object.keys(MP.REAL).forEach(slug => (MP.REAL[slug].roster || []).forEach(p => {
  const id = prof[slug + '|' + p.name], nm = sportName[slug] || slug;
  add({ t: 'player', ti: p.name, s: [p.num != null && p.num !== '' ? '#' + p.num : '', p.pos, p.cls, nm].filter(Boolean).join(' · '),
        u: id ? 'athletes/?id=' + id : 'sports/' + slug + '/#roster', h: [p.town, p.prev, p.team === 'M' ? "men's" : p.team === 'W' ? "women's" : ''].join(' ') });
}));
MP.SPORTS.forEach(s => add({ t: 'sport', ti: s.name, s: s.season + ' · ' + (s.coach || ''), u: 'sports/' + s.slug + '/', h: s.slug.replace(/-/g, ' ') }));
const G = (MP.GAMES && MP.GAMES.games) || [];
G.forEach(g => add({ t: 'game', ti: 'SMU ' + (g.ha === 'away' ? 'at ' : 'vs. ') + g.opp, s: sportName[g.sport] + ' · ' + g.dow + '., ' + fmt(g.d + 'T12:00:00Z') + (g.res ? ' · ' + g.res : ''),
  u: 'games/?id=' + g.id, h: [g.venue, g.city, g.tv].join(' ') }));
const out = { built: new Date().toISOString(), docs };
fs.writeFileSync(path.join(ROOT, 'data', 'search-index.json'), JSON.stringify(out));
const c = {}; docs.forEach(d => c[d.t] = (c[d.t] || 0) + 1);
console.log('search-index.json:', docs.length, 'docs', JSON.stringify(c), fs.statSync(path.join(ROOT, 'data', 'search-index.json')).size, 'bytes');
