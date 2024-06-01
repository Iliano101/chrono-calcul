const SERVICEWORKER_CACHE_NAME = "timer-v1";
const staticAssets = [
    "./",
    "./assets/512px-icon.png",
    "./assets/maskable-icon.png",
    "./assets/svg-icon.svg",
    "./CSS/style.css",
    "./CSS/preflight.css",
    "./JS/index.js",
    "./JS/sw.js",
    "./index.html",
    "./manifest.webmanifest",
];

self.addEventListener("install", async (err) => {
    caches.delete(SERVICEWORKER_CACHE_NAME);
    const cache = await caches.open(SERVICEWORKER_CACHE_NAME);
    await cache.addAll(staticAssets);
    return self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    self.clients.claim();
});

self.addEventListener("fetch", async (event) => {
    const req = event.request;
    const url = new URL(req.url);

    if (url.origin === location.origin) {
        event.respondWith(cacheFirst(req));
    } else {
        event.respondWith(networkAndCache(req));
    }
});

async function cacheFirst(req) {
    const cache = await caches.open(SERVICEWORKER_CACHE_NAME);
    const cached = await cache.match(req);
    return cached || fetch(req);
}

async function networkAndCache(req) {
    const cache = await caches.open(SERVICEWORKER_CACHE_NAME);
    try {
        const fresh = await fetch(req);
        await cache.put(req, fresh.clone());
        return fresh;
    } catch (err) {
        const cached = await cache.match(req);
        return cached;
    }
}
