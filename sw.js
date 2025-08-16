// Service Worker for Catholic Daily Dozen Tracker

const CACHE_VERSION = 'v2.0.0';
const CACHE_NAME = `daily-dozen-${CACHE_VERSION}`;
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/manifest.json'
];

// Install event - cache resources
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // For HTML, CSS, and JS files, always try to fetch from network first
                if (event.request.url.includes('.html') || 
                    event.request.url.includes('.css') || 
                    event.request.url.includes('.js')) {
                    return fetch(event.request)
                        .then(networkResponse => {
                            // Update cache with new response
                            const responseClone = networkResponse.clone();
                            caches.open(CACHE_NAME).then(cache => {
                                cache.put(event.request, responseClone);
                            });
                            return networkResponse;
                        })
                        .catch(() => {
                            // If network fails, return cached version
                            return response;
                        });
                }
                // For other resources, return cached version or fetch from network
                return response || fetch(event.request);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            // Force update of all clients
            return self.clients.claim();
        })
    );
});

// Background sync for offline data
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

function doBackgroundSync() {
    // Handle any background sync tasks
    console.log('Background sync completed');
}

