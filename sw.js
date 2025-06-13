const CACHE_NAME = 'fish-tally-v19'; // Update this version when deploying new releases

const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon_192x192.png',
  './icon_512x512.png'
];

// Install: Cache app shell and immediately activate new service worker
self.addEventListener('install', event => {
  self.skipWaiting(); // Activate immediately without waiting
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Activate: Clean old caches and take control of clients immediately
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => (key !== CACHE_NAME ? caches.delete(key) : null))
      )
    )
  );
  self.clients.claim();
});

// Fetch: Cache-first strategy, fallback to network, cache new GET responses
self.addEventListener('fetch', event => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== 'GET') return;

  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) return cachedResponse;

      return fetch(request)
        .then(networkResponse => {
          // Cache only successful GET responses
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, networkResponse.clone());
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Offline fallback for navigation requests
          if (request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
    })
  );
});
