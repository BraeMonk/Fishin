const CACHE_NAME = 'fish-tally-v12'; // Increment this when deploying new versions

const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './styles.css',
  './script.js',
  './icon_192x192.png',
  './icon_512x512.png'
];

// Install and cache static assets
self.addEventListener('install', event => {
  self.skipWaiting(); // Activate new service worker immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Activate and clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }))
    )
  );
  self.clients.claim(); // Claim control immediately
});

// Fetch handling
self.addEventListener('fetch', event => {
  const { request } = event;

  // Bypass service worker for POST requests (like saving images or posts)
  if (request.method !== 'GET') return;

  // Try cache first, fall back to network
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request).then(networkResponse => {
        // Cache the response only if it's a valid GET request
        if (networkResponse.status === 200 && request.method === 'GET') {
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, networkResponse.clone());
          });
        }
        return networkResponse;
      }).catch(() => {
        // Offline fallback: if navigating, serve cached index.html
        if (request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
