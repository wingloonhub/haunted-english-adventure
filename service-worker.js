/* service-worker.js — minimal offline shell + install eligibility for the PWA.
   Strategy:
     • Pre-cache the app shell on install (HTML, CSS, JS, icons).
     • On fetch: same-origin GETs → cache-first with network fallback.
     • Cross-origin (Firebase, gstatic CDN) → always go to network.
     • Bump CACHE_VERSION when you ship changes so old caches clear out.
*/
const CACHE_VERSION = "haunted-v6";
const CORE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./favicon.svg",
  "./icons/icon.svg",
  "./icons/icon-maskable.svg",
  "./css/style.css",
  "./js/firebase-config.js",
  "./js/art.js",
  "./js/questions.js",
  "./js/questions_mall.js",
  "./js/data.js",
  "./js/store.js",
  "./js/sound.js",
  "./js/firebase.js",
  "./js/report.js",
  "./js/game.js",
  "./js/ui.js",
  "./js/main.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) =>
      // Best-effort cache fill — a missing file shouldn't abort install.
      cache.addAll(CORE).catch(() => Promise.all(
        CORE.map((url) => cache.add(url).catch(() => {}))
      ))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // Cross-origin (Firebase auth/firestore, gstatic CDN) → network only.
  if (url.origin !== self.location.origin) return;
  // Range requests (audio/video seek) — let the network handle them.
  if (req.headers.has("range")) return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) {
        // Stale-while-revalidate: fire-and-forget refresh in background.
        fetch(req).then((fresh) => {
          if (fresh && fresh.ok) {
            caches.open(CACHE_VERSION).then((c) => c.put(req, fresh.clone()));
          }
        }).catch(() => {});
        return cached;
      }
      return fetch(req).then((fresh) => {
        if (fresh && fresh.ok && fresh.type === "basic") {
          const copy = fresh.clone();
          caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
        }
        return fresh;
      }).catch(() => caches.match("./index.html"));
    })
  );
});
