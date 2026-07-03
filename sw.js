const CACHE_NAME = 'alabanzas-v67';
const DATA_CACHE_NAME = 'alabanzas-data-v7';

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      const criticos = [
        'index.html',
        'manifest.json',
        'icon-192.png',
        'icon-512.png'
      ];

      const opcionales = [
        'Alabanzas_Acordes.pdf',
        'Alabanzas_Jub_Acordes.pdf',
        'Alabanzas_Jub_Letra.pdf',
        'Alabanzas_Letra.pdf',
        'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js',
        'https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js',
        'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js'
      ];

      return cache.addAll(criticos).then(() => {
        opcionales.forEach(url => {
          cache.add(url).catch(() => {
            console.log('No se pudo cachear (opcional):', url);
          });
        });
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;

  const url = new URL(e.request.url);
  const isSameOrigin = url.origin === self.location.origin;
  const isHtmlNav = e.request.mode === 'navigate' || (e.request.headers.get('accept') || '').includes('text/html');

  if (isHtmlNav) {
    e.respondWith(
      fetch(e.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put('index.html', copy));
          return response;
        })
        .catch(() => caches.match('index.html'))
    );
    return;
  }

  if (!isSameOrigin) {
    e.respondWith(
      caches.match(e.request).then((cached) => cached || fetch(e.request))
    );
    return;
  }

  e.respondWith(
    caches.open(DATA_CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(e.request);
      const networkFetch = fetch(e.request).then((response) => {
        if (response && response.ok) cache.put(e.request, response.clone());
        return response;
      }).catch(() => cached);

      return cached || networkFetch;
    }).catch(() => caches.match(e.request))
  );
});
