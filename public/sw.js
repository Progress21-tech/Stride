/* eslint-disable no-restricted-globals */
/* Stride PWA Service Worker — PRD Section 19 */

const CACHE_NAME = 'stride-v1';
const OFFLINE_PAGE = '/offline';
const SKIP_WAITING = true;

const APP_SHELL_URLS = [
  '/',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/globals.css',
];

const DYNAMIC_ROUTES = [
  '/login',
  '/signup',
  '/apply',
  '/resources',
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([...APP_SHELL_URLS, ...DYNAMIC_ROUTES]);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
          return null;
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method === 'GET') {
    if (event.request.destination === 'image') {
      event.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
          return cache.match(event.request).then((response) => {
            return response || fetch(event.request).then((fetchResponse) => {
              cache.put(event.request, fetchResponse.clone());
              return fetchResponse;
            }).catch(() => null);
          });
        })
      );
      return;
    }

    if (event.request.mode === 'navigate') {
      event.respondWith(
        fetch(event.request).catch(() => {
          return caches.match('/').then((cached) => {
            return cached || new Response('Offline — content unavailable', {
              status: 503,
              statusText: 'Service Unavailable',
            });
          });
        })
      );
      return;
    }

    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request).then((response) => {
          if (
            !response.url.includes('/api/') &&
            !response.url.includes('/auth/') &&
            response.status === 200
          ) {
            const cloned = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, cloned);
            });
          }
          return response;
        }).catch(() => null);
      })
    );
  }
});
