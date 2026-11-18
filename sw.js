const CACHE_NAME = 'mathe-trainer-v1';

// Alle Dateien, die offline verfügbar sein sollen
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './config.js',
  './app.js',
  './data/mathe.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Installation: Dateien im Cache speichern
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Aktivierung: Alte Caches aufräumen
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Abruf: Erst aus dem Cache bedienen, bei Bedarf aus dem Netz laden (inkl. CDN-Skripte)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        // Auch externe CDN-Dateien (React, SystemJS, Babel) für Offline-Betrieb cachen
        if (event.request.method === 'GET' && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      });
    })
  );
});
