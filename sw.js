self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('fish-tally').then(cache => {
      return cache.addAll([
        './',
        './fish_tally_pwa.html',
        './manifest.json',
        './styles.css',
        './script.js'
      ]);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
