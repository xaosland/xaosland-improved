const CACHE_NAME = 'xaosland-v15';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/css/style.css',
    '/css/fonts-local.css',
    '/js/app.js',
    '/js/marked.min.js',
    '/data/navigation.json',
    '/data/footer.json'
];

// Паттерны данных — для них используется network-first
const NETWORK_FIRST = [
    /\/data\//,
    /\/rss\.xml$/,
    /\/sitemap\.xml$/
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((names) => Promise.all(
                names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);
    if (url.origin !== self.location.origin) return;

    const isNavigation = event.request.mode === 'navigate';
    const isData = NETWORK_FIRST.some((p) => p.test(url.pathname));

    if (isNavigation) {
        event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
        return;
    }

    if (isData) {
        // Network-first: свежие данные в приоритете, кэш — как fallback
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    if (response.ok) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                    }
                    return response;
                })
                .catch(() => caches.match(event.request))
        );
    } else {
        // Cache-first: статика редко меняется
        event.respondWith(
            caches.match(event.request).then((cached) => {
                if (cached) return cached;
                return fetch(event.request).then((response) => {
                    if (response.ok) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                    }
                    return response;
                });
            })
        );
    }
});