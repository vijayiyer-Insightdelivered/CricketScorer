// PitchUp Service Worker
// Strategy: network-first for HTML (always get latest), cache-first for static assets
const CACHE_VERSION = 'pitchup-v3';
const HTML_URLS = ['/', '/pitchup.html', '/index.html'];

self.addEventListener('install', e => {
  // Pre-cache the main HTML
  e.waitUntil(
    caches.open(CACHE_VERSION)
      .then(c => c.addAll(HTML_URLS.filter(u => u !== '/index.html')).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
      .then(() => {
        // Notify all clients that a new SW has taken over
        return self.clients.matchAll().then(clients => {
          clients.forEach(c => c.postMessage({ type: 'SW_UPDATED', version: CACHE_VERSION }));
        });
      })
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  // Network-first for HTML (always try to get latest)
  const isHTML = req.mode === 'navigate' ||
    req.destination === 'document' ||
    url.pathname.endsWith('.html') ||
    url.pathname === '/';

  if (isHTML) {
    e.respondWith(
      fetch(req)
        .then(response => {
          // Cache the fresh HTML
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_VERSION).then(c => c.put(req, copy)).catch(() => {});
          }
          return response;
        })
        .catch(() => caches.match(req).then(r => r || caches.match('/')))
    );
    return;
  }

  // Cache-first for everything else (static assets)
  e.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(response => {
        if (response.ok && req.method === 'GET') {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then(c => c.put(req, copy)).catch(() => {});
        }
        return response;
      });
    })
  );
});

// Listen for skipWaiting messages from the page (when user clicks "update")
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
