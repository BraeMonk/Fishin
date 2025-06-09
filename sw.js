
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open("v1").then(cache => {
            return cache.addAll([
                "index.html",
                "styles.css",
                "script.js",
                "manifest.json",
                "1E44A4B3-867E-4276-AAB4-502B760C8F57.png"
            ]);
        })
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
