// Pet Care Spot service worker.
// Network-first: when the phone is online it ALWAYS loads the latest version
// (prices, branding, deals). The saved copy is only used when there is no signal.
// To force every phone to drop the old saved copy, bump CACHE (pcs-v2, pcs-v3...).
const CACHE = 'pcs-v2';
const SHELL = [
  './',
  'index.html',
  'manifest.webmanifest',
  'icon-192.png',
  'icon-512.png',
  'icon-maskable-512.png',
  'apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || !req.url.startsWith('http')) return;

  event.respondWith(
    fetch(req)
      .then((res) => {
        // Save a copy of good responses (our files, fonts, the QR library) for offline use.
        if (res && (res.ok || res.type === 'opaque')) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() =>
        caches.match(req).then((hit) => hit || (req.mode === 'navigate' ? caches.match('index.html') : undefined))
          .then((hit) => hit || new Response('Offline', { status: 503, statusText: 'Offline' }))
      )
  );
});
