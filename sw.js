const CACHE = "cockpit-v1";
self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(["./", "./donnees.bin", "./icone-180.png"])).catch(() => {}));
});
self.addEventListener("activate", e => e.waitUntil(
  caches.keys().then(l => Promise.all(l.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim())));
self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
  e.respondWith(fetch(r, {cache: "no-cache"}).then(rep => {
    if (rep.ok) { const copie = rep.clone(); caches.open(CACHE).then(c => c.put(r, copie)); }
    return rep;
  }).catch(() => caches.match(r, {ignoreSearch: true})
    .then(c => c || caches.match("./index.html")).then(c => c || Response.error())));
});
