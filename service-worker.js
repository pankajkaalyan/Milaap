const CACHE_NAME = 'milaap-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  // Vite assets (JS/CSS) will be cached on the first visit by the fetch handler.
];

// Install event: Pre-cache the application shell.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) // Activate the new service worker immediately.
  );
});

// Activate event: Clean up old caches.
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Take control of all open clients.
  );
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(key => caches.delete(key))))
  );
});

// Fetch event: Implement a cache-first, then network strategy with caching.
self.addEventListener('fetch', (event) => {
  // We only want to cache GET requests.
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // If the resource is in the cache, return it.
        if (cachedResponse) {
          return cachedResponse;
        }

        // If it's not in the cache, fetch it from the network.
        return fetch(event.request).then((networkResponse) => {
            // We need to clone the response because it's a stream and can be consumed only once.
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                // Cache the new resource.
                // We only cache successful responses. We also don't cache opaque responses
                // for cross-origin requests to avoid filling up storage with unclear data.
                if (networkResponse.status === 200 && networkResponse.type !== 'opaque') {
                    cache.put(event.request, responseToCache);
                }
              });
            
            // Return the network response to the browser.
            return networkResponse;
          }
        ).catch(error => {
          console.error('Service Worker: Fetch failed.', error);
          // Optional: You could return a fallback offline page from the cache here.
          // For example: return caches.match('/offline.html');
          throw error;
        });
      })
  );
});