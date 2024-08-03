// service-worker.js

// Cache version
const CACHE_NAME = 'my-cache-v1';

// List of assets to cache
const CACHE_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/scripts.js',
  '/images/logo.png'
];

// Install event - Cache files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(CACHE_ASSETS);
      })
  );
});

// Fetch event - Serve cached files
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached response if available, else fetch from network
        return response || fetch(event.request);
      })
  );
});

// Activate event - Cleanup old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
