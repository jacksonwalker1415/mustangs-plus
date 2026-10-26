// Copy the SMU+ website (repo root) into ios-app/www for the native bundle, and add the native shim.
// The website itself is never modified. Run from ios-app/: `npm run copy-web` (or `npm run sync`).
//
// Optional: SMU_NATIVE_AUTH_REDIRECT=1 points Supabase email links (magic link, confirm sign-up,
// password reset) at smuplus://app/ in the bundled copy of assets/config.js only. Turn it on only
// after smuplus://** is in the Supabase dashboard's Redirect URLs (see README). Without it, email
// links open the live website in Safari.
import { cpSync, rmSync, mkdirSync, readdirSync, readFileSync, writeFileSync, statSync, existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const APP = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = join(APP, '..');
const OUT = join(APP, 'www');
const SKIP = new Set(['.git', '.github', 'ios-app', 'supabase', 'node_modules', '.nojekyll', 'README.md', 'SETUP.md',
  'robots.txt', 'sitemap.xml', 'sw.js', 'offline.html', 'mustangs-plus-qr.png']);

if (!existsSync(join(SITE, 'index.html')) || !existsSync(join(SITE, 'assets', 'app.js'))) {
  console.error('copy-web: site not found at ' + SITE); process.exit(1);
}
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
for (const name of readdirSync(SITE)) {
  if (SKIP.has(name) || name.startsWith('.') || name.startsWith('RUN_ME') || name.endsWith('.sql')) continue;
  cpSync(join(SITE, name), join(OUT, name), { recursive: true });
}
cpSync(join(APP, 'native'), join(OUT, 'native'), { recursive: true });

const SW = /<script>if\('serviceWorker' in navigator[^\n]*<\/script>\n?/;
const MANIFEST = /<link rel="manifest"[^>]*>\n?/;
let pages = 0;
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) { if (name !== 'native') walk(p); continue; }
    if (!name.endsWith('.html')) continue;
    let s = readFileSync(p, 'utf8');
    const m = s.match(/<body[^>]*data-root="([^"]*)"/);
    const pre = m ? m[1] : '';
    s = s.replace(SW, '').replace(MANIFEST, '');               // no service worker / web manifest inside the app
    if (!s.includes('native/native.css')) s = s.replace('</head>', `<link rel="stylesheet" href="${pre}native/native.css">\n</head>`);
    if (!s.includes('native/native.js')) s = s.replace('</body>', `<script src="${pre}native/native.js"></script>\n</body>`);
    writeFileSync(p, s);
    pages++;
  }
})(OUT);

if (process.env.SMU_NATIVE_AUTH_REDIRECT === '1') {
  const cfg = join(OUT, 'assets', 'config.js');
  const s = readFileSync(cfg, 'utf8');
  const t = s.replace(/SITE_URL:\s*'[^']*'/, "SITE_URL: 'smuplus://app/'");
  if (t === s) { console.error('copy-web: SITE_URL not found in config.js'); process.exit(1); }
  writeFileSync(cfg, t);
  console.log('copy-web: email sign-in links will open the app (smuplus://app/)');
}
console.log(`copy-web: ${pages} pages -> ${relative(process.cwd(), OUT) || OUT}`);
