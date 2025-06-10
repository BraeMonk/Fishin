const CACHE_NAME = 'fish-tally-v2';

const urlsToCache = [
  '/Fishin/',
  '/Fishin/index.html',
  '/Fishin/manifest.json',
  '/Fishin/styles.css',
  '/Fishin/script.js',
  '/Fishin/icon_192x192.webp',
  '/Fishin/icon_512x512.webp'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

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

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
