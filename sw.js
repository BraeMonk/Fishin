const CACHE_NAME = 'fish-tally-v3';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './styles.css',
  './script.js',
  './icon_192x192.png',
  './icon_512x512.png'
];

// Install event - cache static assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Fetch event - try cache first, then network, then fallback to cache if offline
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse; // return cached asset
      }
      return fetch(e.request).then(networkResponse => {
        // Optionally cache new requests dynamically here
        return caches.open(CACHE_NAME).then(cache => {
          // Cache only GET requests and successful responses
          if (e.request.method === 'GET' && networkResponse.status === 200) {
            cache.put(e.request, networkResponse.clone());
          }
          return networkResponse;
        });
      }).catch(() => {
        // If both fail (offline & no cache), optionally respond with a fallback page/image
        if (e.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
});
