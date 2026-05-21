const CACHE_NAME = 'alabanzas-v4';
// Lista de archivos que la app guardará en el teléfono para usarse sin internet
const ASSETS = [
  'index.html',
  'manifest.json',
 'icon-192.png',
  'icon-512.png',
  'Alabanzas_Acordes.pdf',
  'Alabanzas_Jub_Acordes.pdf',
  'Alabanzas_Jub_Letra.pdf',
    'Alabanzas_Letra.pdf'
];

// Instala el Service Worker y guarda los archivos en caché
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Activa el Service Worker y limpia cachés viejos si actualizas la app
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Intercepta las peticiones para cargar todo desde el teléfono si no hay internet
// Intercepta las peticiones de forma segura para evitar el error "Load failed" en iOS
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      // Si el archivo está en la memoria del teléfono, lo entrega de inmediato
      if (response) {
        return response;
      }
      
      // Si no está en la memoria, intenta buscarlo en internet
      return fetch(e.request).catch(() => {
        // Si internet falla (modo avión), este bloque evita que Safari muera.
        // Opcional: podrías retornar una página de error, o simplemente dejar que falle limpio.
        console.log("Archivo no encontrado en caché ni en red.");
      });
    })
  );
});
