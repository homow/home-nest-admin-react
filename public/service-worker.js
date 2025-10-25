const CACHE_NAME = "homenest-cache-v1";
const ASSETS = [
    "/",
    "/index.html",
    "/favicon/manifest.json",
    "/favicon/icon-192x192.png",
    "/favicon/icon-512x512.png"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then(
            (response) =>
                response ||
                fetch(event.request).catch(() =>
                    caches.match("/index.html")
                )
        )
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            )
        )
    );
});
