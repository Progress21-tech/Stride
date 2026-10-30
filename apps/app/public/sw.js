const CACHE = 'sylpace-shell-v1';
const STATIC = ['/manifest.json', '/icon-192.png', '/icon-512.png'];
const OFFLINE = '/offline';

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(STATIC);
    try { const page = await fetch(OFFLINE, { cache: 'reload' }); if (page.ok) await cache.put(OFFLINE, page); } catch {}
    if (!self.registration.active) await self.skipWaiting();
  })());
});
self.addEventListener('activate', (event) => event.waitUntil((async () => {
  const names = await caches.keys();
  await Promise.all(names.filter((name) => (name.startsWith('sylpace-') || name.startsWith('stride-')) && name !== CACHE).map((name) => caches.delete(name)));
  await self.clients.claim();
})()));
self.addEventListener('message', (event) => { if (event.data?.type === 'SKIP_WAITING') self.skipWaiting(); });
self.addEventListener('fetch', (event) => {
  const request = event.request; const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin || url.pathname.startsWith('/api/')) return;
  if (request.mode === 'navigate') event.respondWith(fetch(request).catch(async () => (await caches.open(CACHE)).match(OFFLINE)));
  else if (STATIC.includes(url.pathname)) event.respondWith(caches.match(request).then((cached) => cached || fetch(request)));
});
