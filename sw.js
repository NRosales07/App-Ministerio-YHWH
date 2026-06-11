const CACHE_NAME = 'alabanzas-v30';

// ✅ UN solo evento install, con críticos y opcionales
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Archivos críticos — si fallan, el SW no se instala
      const criticos = [
        'index.html',
        'manifest.json',
        'icon-192.png',
        'icon-512.png'
      ];

      // Archivos opcionales — si fallan, no bloquean la instalación
      const opcionales = [
        'Alabanzas_Acordes.pdf',
        'Alabanzas_Jub_Acordes.pdf',
        'Alabanzas_Jub_Letra.pdf',
        'Alabanzas_Letra.pdf'
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

// Toma control inmediato de todas las pestañas abiertas
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME) // borra cachés viejos
          .map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Responde con caché primero, red como respaldo
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => {
      return cached || fetch(e.request);
    })
  );
});