self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('fish-tally').then(cache => {
      return cache.addAll([
        './',
        './index.html',
        './manifest.json',
        './styles.css',
        './script.js',
        './icon_192x192.webp',
        './icon_512x512.webp'
      ]);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
