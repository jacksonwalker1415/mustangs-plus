/* SMU+ native app shim (Capacitor iOS). Copied into the app bundle by ../scripts/copy-web.mjs and never
   referenced by the website. It does nothing unless window.Capacitor says this is a native platform.
   Plugins are called through Capacitor's native bridge (Capacitor.nativePromise), so no bundler is needed. */
(function (w, d) {
  'use strict';
  var C = w.Capacitor;
  if (!C || typeof C.isNativePlatform !== 'function' || !C.isNativePlatform()) return;
  var LIVE = 'https://jacksonwalker1415.github.io/mustangs-plus/';
  d.documentElement.classList.add('cap-native');

  function call(plugin, method, opts) {
    try { if (C.nativePromise) return C.nativePromise(plugin, method, opts || {}); } catch (e) {}
    return Promise.reject(new Error('bridge unavailable'));
  }
  function tick(style) { call('Haptics', 'impact', { style: style || 'LIGHT' }).catch(function () {}); }
  function root() { return (d.body && d.body.getAttribute('data-root')) || ''; }

  // Public URL of the current page (capacitor://localhost/library/#x -> https://.../mustangs-plus/library/#x)
  function liveUrl() {
    var path = location.pathname.replace(/^\/+/, '').replace(/index\.html$/, '');
    return LIVE + path + location.search + location.hash;
  }

  var I = {
    home: '<path d="M4 11.5 12 5l8 6.5"/><path d="M6.5 10v9h11v-9"/><path d="M10 19v-5h4v5"/>',
    watch: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m10.5 9.5 4 2.5-4 2.5z"/>',
    sports: '<circle cx="12" cy="12" r="8"/><path d="M12 4v16M4 12h16"/><path d="M6.3 6.3c3 3 3 8.4 0 11.4M17.7 6.3c-3 3-3 8.4 0 11.4"/>',
    boards: '<path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H10l-4 3.5V16h0A2 2 0 0 1 4 14z"/><path d="M8 9h8M8 12h5"/>',
    account: '<circle cx="12" cy="8.5" r="3.5"/><path d="M5 19.5c1.3-3.3 4-5 7-5s5.7 1.7 7 5"/>'
  };
  function svg(k) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + I[k] + '</svg>'; }

  function build() {
    if (d.querySelector('.cap-tabs')) return;
    var r = root(), page = d.body.getAttribute('data-page');
    var tabs = [
      ['home', 'Home', r, page === 'home'],
      ['watch', 'Watch', r + 'library/', page === 'library'],
      ['sports', 'Sports', null, page === 'sport'],
      ['boards', 'Boards', r + 'boards/', page === 'boards'],
      ['account', 'Account', r + 'account/', page === 'account']
    ];
    var nav = d.createElement('nav');
    nav.className = 'cap-tabs';
    nav.setAttribute('aria-label', 'App tabs');
    nav.innerHTML = tabs.map(function (t) {
      var cur = t[3] ? ' aria-current="page"' : '';
      if (!t[2]) return '<button type="button" data-tab="' + t[0] + '" aria-expanded="false" aria-controls="capSports"' + cur + '>' + svg(t[0]) + '<span>' + t[1] + '</span></button>';
      return '<a href="' + t[2] + '" data-tab="' + t[0] + '"' + cur + '>' + svg(t[0]) + '<span>' + t[1] + '</span></a>';
    }).join('');
    d.body.appendChild(nav);

    var scrim = d.createElement('div'); scrim.className = 'cap-scrim'; scrim.hidden = true;
    var sheet = d.createElement('div');
    sheet.className = 'cap-sheet'; sheet.id = 'capSports'; sheet.hidden = true;
    sheet.setAttribute('role', 'dialog'); sheet.setAttribute('aria-label', 'All sports');
    d.body.appendChild(scrim); d.body.appendChild(sheet);
    var btn = nav.querySelector('[data-tab="sports"]');
    function fill() {
      // reuse the site's own sports links (same hrefs and icons as the header menu)
      var src = d.getElementById('mmSports') || d.querySelector('#sportsMenu .sdd-list');
      var links = src ? Array.prototype.map.call(src.querySelectorAll('a'), function (a) {
        var slug = (a.getAttribute('href').match(/sports\/([^/]+)\//) || [])[1];
        var cur = page === 'sport' && d.body.getAttribute('data-sport') === slug ? ' aria-current="page"' : '';
        return '<a href="' + a.getAttribute('href') + '"' + cur + '>' + a.innerHTML + '</a>';
      }).join('') : '';
      sheet.innerHTML = '<h2>All 12 sports</h2><div class="list">' + links + '</div>';
    }
    function setSheet(open) {
      if (open && !sheet.querySelector('.list a')) fill();
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      scrim.hidden = !open;
      if (open) { sheet.hidden = false; requestAnimationFrame(function () { sheet.classList.add('open'); }); }
      else { sheet.classList.remove('open'); sheet.hidden = true; }
    }
    btn.addEventListener('click', function () { tick(); setSheet(btn.getAttribute('aria-expanded') !== 'true'); });
    scrim.addEventListener('click', function () { setSheet(false); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') setSheet(false); });
    nav.addEventListener('click', function (e) {
      var a = e.target.closest('a[data-tab]');
      if (!a) return;
      tick();
      if (a.getAttribute('aria-current') === 'page') { e.preventDefault(); setSheet(false); w.scrollTo({ top: 0, behavior: 'smooth' }); }
    });
    sheet.addEventListener('click', function (e) { if (e.target.closest('a')) tick(); });
  }

  // Native share sheet for the site's Share buttons (falls back to the Web Share API, then to the site's own handler)
  d.addEventListener('click', function (e) {
    var b = e.target.closest('[data-demo="Share this story"],[data-share]');
    if (!b) return;
    e.preventDefault(); e.stopImmediatePropagation();
    var h = d.getElementById('reader-h');
    var title = (h && h.textContent.trim()) || d.title.replace(/\s*\|\s*SMU\+.*$/, '') || 'SMU+';
    var opts = { title: title + ' | SMU+', text: title + ' on SMU+ (concept fan site)', url: liveUrl(), dialogTitle: 'Share' };
    tick();
    call('Share', 'share', opts).catch(function (err) {
      if (err && /cancel/i.test(String(err.message || err))) return;
      if (navigator.share) navigator.share({ title: opts.title, text: opts.text, url: opts.url }).catch(function () {});
    });
  }, true);

  // Light haptics on primary actions
  d.addEventListener('click', function (e) {
    if (e.target.closest('.btn-red,[data-join],[data-join-pick],button[type="submit"],.menu-btn')) tick();
  }, true);

  // Deep links: smuplus://app/<path>#<hash> (email sign-in links, once enabled; see ios-app/README.md)
  try {
    C.nativeCallback('App', 'addListener', { eventName: 'appUrlOpen' }, function (data) {
      if (!data || !data.url) return;
      var m = String(data.url).match(/^smuplus:\/\/app\/?([^?#]*)([?#].*)?$/);
      if (!m) return;
      var path = m[1] || '', rest = m[2] || '';
      if (path && !/\/$/.test(path) && !/\.[a-z0-9]+$/i.test(path)) path += '/';
      location.href = '/' + path + rest;
    });
  } catch (e) {}

  function ready() {
    build();
    call('StatusBar', 'setStyle', { style: 'DARK' }).catch(function () {});
    setTimeout(function () { call('SplashScreen', 'hide', { fadeOutDuration: 200 }).catch(function () {}); }, 150);
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', ready); else ready();
})(window, document);
