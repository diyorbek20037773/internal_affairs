// HIMOYA-360 service worker: app shell + static assets cache (network-first for pages,
// cache-first for immutable /_next/static, models, hdri, textures). API calls are never cached.
const VERSION = "h360-v3";
const STATIC = /^\/(_next\/static|models|hdri|tex|icon-|iiv_logo|manifest)/;
self.addEventListener("install", (e) => { self.skipWaiting(); });
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin || url.pathname.startsWith("/api/")) return;
  if (STATIC.test(url.pathname)) {
    // 2k panoramas are 6–7 MB each — stream them, don't fill the tablet's cache.
    if (/_2k\.hdr$/.test(url.pathname)) return;
    e.respondWith(caches.open(VERSION).then(async (c) => (await c.match(req)) || fetch(req).then((r) => { if (r.ok && !r.redirected) c.put(req, r.clone()); return r; })));
    return;
  }
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then((r) => { if (r.ok && !r.redirected) caches.open(VERSION).then((c) => c.put(req, r.clone())); return r; })
        .catch(() => caches.match(req).then((r) => r || caches.match("/uz")))
    );
  }
});
