// Jagadhatri Darshan Service Worker (Offline Support & PWA)
const CACHE_NAME = "jd-pwa-cache-v5";

const CORE_STATIC_ASSETS = [
  "/",
  "/pandals",
  "/icon-192.png",
  "/icon-512.png",
  "/apple-touch-icon.png",
  "/favicon.ico",
  "/icon.svg",
];

// Install Event: precache essential offline assets & skip waiting immediately
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_STATIC_ASSETS))
      .catch((err) => {
        console.warn("[SW] Pre-caching non-fatal warning:", err);
      })
  );
});

// Activate Event: instantly clean up old caches and take control of all clients
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              console.log("[SW] Deleting old cache:", key);
              return caches.delete(key);
            }
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

// Fetch Event: cache images/fonts, never interfere with Next.js navigation when online
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. NEVER intercept non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // 2. NEVER intercept Next.js internal assets, RSC requests, or API routes
  if (
    url.pathname.startsWith("/_next/") ||
    url.pathname.startsWith("/api/") ||
    url.searchParams.has("_rsc") ||
    request.headers.get("rsc") === "1" ||
    request.headers.get("next-router-prefetch") ||
    request.headers.get("next-router-state-tree")
  ) {
    return;
  }

  // 3. Static Media & Assets (Images, Icons, Webfonts): Cache-First strategy
  if (
    request.destination === "image" ||
    request.destination === "font" ||
    url.pathname.match(/\.(png|jpg|jpeg|svg|ico|webp|woff2?)$/)
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return networkResponse;
          })
          .catch(() => cachedResponse || Response.error());
      })
    );
    return;
  }

  // 4. HTML Navigation: Let native browser networking handle it when online.
  // ONLY intervene when offline to serve the cached app shell or friendly offline page.
  if (request.mode === "navigate") {
    if (navigator.onLine) {
      // Online: let the browser and Next.js App Router perform navigation directly.
      // Do NOT call event.respondWith() so no Response.error() or AbortError can ever occur.
      return;
    }

    // Offline: return cached page or home or friendly offline fallback
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return caches.match("/").then((home) => {
          if (home) return home;
          return new Response(
            `<!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="utf-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <title>Offline — Jagadhatri Darshan</title>
                <style>
                  body { font-family: system-ui, sans-serif; background: #fcfaf5; color: #1c1917; text-align: center; padding: 3rem 1rem; }
                  h1 { color: #4a1810; margin-bottom: 0.5rem; }
                  p { color: #57534e; margin-bottom: 1.5rem; }
                  a { display: inline-block; background: #d99b26; color: #1c1917; padding: 0.75rem 1.5rem; border-radius: 0.75rem; text-decoration: none; font-weight: bold; }
                </style>
              </head>
              <body>
                <h1>জগদ্ধাত্রী দর্শন (Offline)</h1>
                <p>You appear to be offline. Please reconnect to the internet or return to the home screen.</p>
                <a href="/">Go to Home Screen</a>
              </body>
            </html>`,
            {
              status: 200,
              headers: { "Content-Type": "text/html; charset=utf-8" },
            }
          );
        });
      })
    );
    return;
  }
});
