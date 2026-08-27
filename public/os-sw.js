/**
 * Techfind Revenue OS — service worker.
 *
 * Scope is registered as /app only (see ServiceWorkerRegister.tsx), so this
 * never touches the marketing site, /login, or the public /pay/[token]
 * payment page.
 *
 * Caching policy is deliberately conservative:
 *   - Precache a handful of truly static, non-sensitive assets (icons,
 *     manifest, the offline fallback shell).
 *   - Every navigation and every /api/* or Server Action request goes
 *     straight to the network — CRM records, balances, payment state and
 *     any RSC payload must always be fresh. On a failed navigation we show
 *     the offline shell, never a stale cached page.
 *   - No response bodies from app pages, API routes, or POSTs are ever
 *     written to a Cache — nothing financial or customer-identifying is
 *     persisted by this worker.
 */

const CACHE_VERSION = "techfind-os-v1";
const STATIC_CACHE = `${CACHE_VERSION}-static`;

const PRECACHE_URLS = [
  "/os-offline.html",
  "/os-icons/icon-192.png",
  "/os-icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== STATIC_CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function isStaticAsset(url) {
  return (
    url.pathname.startsWith("/os-icons/") ||
    url.pathname === "/os-manifest.webmanifest" ||
    url.pathname === "/os-offline.html"
  );
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return; // never intercept mutations
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Navigations: network-first, offline shell as the only fallback.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match("/os-offline.html"))
    );
    return;
  }

  // Static, non-sensitive assets: cache-first for speed.
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(request).then((cached) => cached ?? fetch(request))
    );
    return;
  }

  // Everything else (API routes, RSC data, images from CRM records, etc.)
  // — network only, never cached.
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});
