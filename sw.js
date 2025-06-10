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

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method === 'POST') {
    return; // Prevent caching of uploaded photos and posts
  }

  e.respondWith(
    caches.match(e.request).then(cachedResponse => {
      if (cachedResponse) return cachedResponse;

      return fetch(e.request).then(networkResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          if (e.request.method === 'GET' && networkResponse.status === 200) {
            cache.put(e.request, networkResponse.clone());
          }
          return networkResponse;
        });
      }).catch(() => {
        if (e.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});

// Cleans up old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => (key !== CACHE_NAME ? caches.delete(key) : null)))
    )
  );
});
