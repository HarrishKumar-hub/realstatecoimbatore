// LPS Real Estate – Service Worker (PWA Feature 17)
const CACHE_NAME = 'smp-v1';
const OFFLINE_PAGE = '/index.html';
const PRECACHE = [
    '/',
    '/index.html',
    '/properties.html',
    '/about.html',
    '/contact.html',
    '/faq.html',
    '/blog.html',
    '/style.css',
    '/script.js',
    '/manifest.json'
];

// Install — pre-cache key pages
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE))
    );
    self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

// Fetch — network first, cache fallback
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;
    event.respondWith(
        fetch(event.request)
            .then(response => {
                // Cache successful responses
                if (response && response.status === 200) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                }
                return response;
            })
            .catch(() => caches.match(event.request).then(r => r || caches.match(OFFLINE_PAGE)))
    );
});
