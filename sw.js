/* SMU+ service worker (installable web app shell).
   Rules, in order. Anything not matched is left alone (no respondWith), so the browser handles it
   exactly as if there were no service worker:
   - only GET requests, only this origin, only URLs inside this worker's scope (the site root on
     fanplatformdemo.com; registration uses relative paths, so a subpath also works)
   - never anything on *.supabase.co or any other origin (CollegeFootballData, StatBroadcast, podcast
     hosts, CDNs, YouTube, X), never audio/video (media element or Range requests), never auth callbacks
     (?code=, ?access_token=, ?token_hash=, ?error=...)
   - page navigations: network first; the cached copy (or offline.html) is used only when offline
   - static files (css, js, images, fonts): network first too, cached by full URL including ?v=.
     When a new ?v= of a file is stored, older ?v= copies of that file are deleted, so a stale
     version can never be served.
   Navigation preload is on where supported: the page request starts while the worker is still waking up,
   so a cold worker never adds a pause (and a blank moment in the home-screen app) before a page arrives.
   Bump VERSION to drop every cache on the next visit. To retire the worker, replace this file with
   one that calls self.registration.unregister(). */
'use strict';
var VERSION = 'smu-pwa-v7';
var PREFIX = 'smu-pwa-';
var SHELL = VERSION + '-shell';
var RUNTIME = VERSION + '-runtime';
var MAX_RUNTIME = 150;
var SCOPE = self.registration.scope;              // e.g. https://fanplatformdemo.com/
var OFFLINE = new URL('offline.html', SCOPE).href;
var PRECACHE = ['offline.html', 'assets/brand/smu-plus-logo-lg.png', 'assets/brand/icon-192.png']
  .map(function (p) { return new URL(p, SCOPE).href; });
var STATIC_EXT = /\.(?:css|js|png|jpe?g|webp|avif|gif|svg|ico|woff2?|webmanifest)$/i;
var AUTH_PARAMS = ['code', 'access_token', 'refresh_token', 'token', 'token_hash', 'type', 'error', 'error_code', 'error_description'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(SHELL).then(function (c) {
    return Promise.all(PRECACHE.map(function (u) {
      return fetch(u, { cache: 'reload' }).then(function (r) { if (r.ok) return c.put(u, r); }).catch(function () {});
    }));
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) {
      return k.indexOf(PREFIX) === 0 && k !== SHELL && k !== RUNTIME;
    }).map(function (k) { return caches.delete(k); }));
  }).then(function () {
    if (self.registration.navigationPreload) return self.registration.navigationPreload.enable().catch(function () {});
  }).then(function () { return self.clients.claim(); }));
});

function handled(req) {
  if (req.method !== 'GET') return false;
  if (req.headers.has('range')) return false;
  if (req.destination === 'audio' || req.destination === 'video' || req.destination === 'track') return false;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return false;   // covers *.supabase.co, CDNs, embeds
  if (/(^|\.)supabase\.(co|in)$/i.test(url.hostname)) return false;
  if (req.url.indexOf(SCOPE) !== 0) return false;
  if (url.pathname.slice(-6) === '/sw.js') return false;
  for (var i = 0; i < AUTH_PARAMS.length; i++) if (url.searchParams.has(AUTH_PARAMS[i])) return false;
  if (req.mode === 'navigate') return true;
  return STATIC_EXT.test(url.pathname);
}

function cacheable(res) {
  return res && res.ok && res.status === 200 && res.type === 'basic' &&
    !/no-store/i.test(res.headers.get('cache-control') || '');
}

function store(req, res, nav) {
  var url = new URL(req.url);
  return caches.open(RUNTIME).then(function (c) {
    return c.keys().then(function (keys) {
      // static files: drop other ?v= copies of the same file; then trim the oldest entries
      var dels = nav ? [] : keys.filter(function (k) {
        var ku = new URL(k.url);
        return ku.pathname === url.pathname && ku.search !== url.search;
      }).map(function (k) { return c.delete(k); });
      var extra = keys.length - dels.length - MAX_RUNTIME + 1;
      for (var i = 0; i < extra; i++) dels.push(c.delete(keys[i]));
      return Promise.all(dels);
    }).then(function () { return c.put(req.url, res); });
  }).catch(function () {});
}

self.addEventListener('fetch', function (e) {
  var req = e.request;
  var pre = req.mode === 'navigate' && e.preloadResponse ? Promise.resolve(e.preloadResponse).catch(function () {}) : null;
  if (!handled(req)) { if (pre) e.waitUntil(pre); return; }   // let the preload settle quietly; the browser fetches as usual
  var nav = req.mode === 'navigate';
  var net = pre ? pre.then(function (r) { return r || fetch(req); }) : fetch(req);
  e.respondWith(net.then(function (res) {
    if (cacheable(res)) { var copy = res.clone(); e.waitUntil(store(req, copy, nav)); }
    return res;
  }).catch(function (err) {
    // Offline: exact URL match only (query string included), never a different ?v=
    return caches.match(req.url, { ignoreSearch: false, ignoreVary: true }).then(function (hit) {
      if (hit) return hit;
      if (nav) return caches.match(OFFLINE).then(function (o) { return o || Response.error(); });
      throw err;
    });
  }));
});
