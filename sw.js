caches.open('fish-tally-v2') // <--- change the cache name

// and update cached icon paths
return cache.addAll([
  './',
  './index.html',
  './manifest.json',
  './styles.css',
  './script.js',
  './icon_192x192.png',
  './icon_512x512.png'
]);

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
