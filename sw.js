self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("fishing-log-v1").then((cache) => {
      return cache.addAll([
        "./",
        "./index.html",
        "./style.css",
        "./script.js",
        "./manifest.json",
        "./IMG_1595.jpg",
        "./1E44A4B3-867E-4276-AAB4-502B760C8F57.png"
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
