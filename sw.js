const CACHE_NAME = 'nurahtii-v8';
const OFFLINE_URLS = [
  '/',
  '/styles.css',
  '/page-loader.js',
  '/app.js',
  '/birthday.css',
  '/birthday-effects.js',
  '/pages/birthday.html',
  '/pages/entry.html',
  '/pages/home.html',
  '/pages/note.html',
  '/pages/dua.html',
  '/pages/jar.html',
  '/pages/countdown.html',
  '/pages/mood.html',
  '/pages/qa.html',
  '/pages/daily-question.html',
  '/pages/admin.html',
  '/images/nurahtii-birthday-portrait.jpg',
  '/images/nurahtii-smile-green.jpg',
  '/images/nurahtii-quiet-moment.jpg',
  '/images/nurahtii-orange-portrait.jpg'
];

// Install: cache the shell, page fragments, and birthday assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(OFFLINE_URLS))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch same-origin assets network-first, falling back to the offline cache.
self.addEventListener('fetch', e => {
  const request = e.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  e.respondWith(
    fetch(request)
      .then(async res => {
        if (res.ok) {
          try {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(request, res.clone());
          } catch (error) {
            console.error('Offline cache update failed:', error);
          }
        }
        return res;
      })
      .catch(async error => {
        const cached = await caches.match(request);
        if (cached) return cached;
        throw error;
      })
  );
});
