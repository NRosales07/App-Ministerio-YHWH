const CACHE_NAME = 'alabanzas-v93';
const DATA_CACHE_NAME = 'alabanzas-data-v32';

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      const criticos = [
        'index.html',
        'manifest.json',
        'icon-192.png',
        'icon-512.png',
        'canciones-adoracion.js',
        'canciones-jubilo.js'
      ];

      const opcionales = [
        'Alabanzas_Acordes.pdf',
        'Alabanzas_Jub_Acordes.pdf',
        'Alabanzas_Jub_Letra.pdf',
        'Alabanzas_Letra.pdf',
        'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js',
        'https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js',
        'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js',
        // El piano (Tone.Sampler) usa estos samples de tonejs.github.io,
        // no los de piano-samples/ (esa carpeta no se referencia en ningún
        // lado del código, así que precacharla no ayudaba en nada). Los
        // dejamos precargados desde la instalación para que la primera
        // vez que se abra el piano ya suene al toque, sin esperar.
        'https://tonejs.github.io/audio/salamander/A0.mp3',
        'https://tonejs.github.io/audio/salamander/C1.mp3',
        'https://tonejs.github.io/audio/salamander/Ds1.mp3',
        'https://tonejs.github.io/audio/salamander/Fs1.mp3',
        'https://tonejs.github.io/audio/salamander/A1.mp3',
        'https://tonejs.github.io/audio/salamander/C2.mp3',
        'https://tonejs.github.io/audio/salamander/Ds2.mp3',
        'https://tonejs.github.io/audio/salamander/Fs2.mp3',
        'https://tonejs.github.io/audio/salamander/A2.mp3',
        'https://tonejs.github.io/audio/salamander/C3.mp3',
        'https://tonejs.github.io/audio/salamander/Ds3.mp3',
        'https://tonejs.github.io/audio/salamander/Fs3.mp3',
        'https://tonejs.github.io/audio/salamander/A3.mp3',
        'https://tonejs.github.io/audio/salamander/C4.mp3',
        'https://tonejs.github.io/audio/salamander/Ds4.mp3',
        'https://tonejs.github.io/audio/salamander/Fs4.mp3',
        'https://tonejs.github.io/audio/salamander/A4.mp3',
        'https://tonejs.github.io/audio/salamander/C5.mp3',
        'https://tonejs.github.io/audio/salamander/Ds5.mp3',
        'https://tonejs.github.io/audio/salamander/Fs5.mp3',
        'https://tonejs.github.io/audio/salamander/A5.mp3',
        // Muestras de trompeta (Júbilo), mismas 11 notas que carga
        // pianoGetTrumpetSampler() en index.html. Van en 'opcionales' con
        // el mismo trato que las de piano: si una falla, no aborta el
        // resto (cada cache.add() de la lista de abajo tiene su propio
        // .catch()).
        'https://nbrosowsky.github.io/tonejs-instruments/samples/trumpet/A3.mp3',
        'https://nbrosowsky.github.io/tonejs-instruments/samples/trumpet/F3.mp3',
        'https://nbrosowsky.github.io/tonejs-instruments/samples/trumpet/C4.mp3',
        'https://nbrosowsky.github.io/tonejs-instruments/samples/trumpet/Ds4.mp3',
        'https://nbrosowsky.github.io/tonejs-instruments/samples/trumpet/F4.mp3',
        'https://nbrosowsky.github.io/tonejs-instruments/samples/trumpet/G4.mp3',
        'https://nbrosowsky.github.io/tonejs-instruments/samples/trumpet/As4.mp3',
        'https://nbrosowsky.github.io/tonejs-instruments/samples/trumpet/D5.mp3',
        'https://nbrosowsky.github.io/tonejs-instruments/samples/trumpet/F5.mp3',
        'https://nbrosowsky.github.io/tonejs-instruments/samples/trumpet/A5.mp3',
        'https://nbrosowsky.github.io/tonejs-instruments/samples/trumpet/C6.mp3',

        // Muestras de guitarra eléctrica (17 notas), las que carga
// pianoGetGuitarraSampler() en index.html.
'https://nbrosowsky.github.io/tonejs-instruments/samples/guitar-electric/Cs2.mp3',
'https://nbrosowsky.github.io/tonejs-instruments/samples/guitar-electric/E2.mp3',
'https://nbrosowsky.github.io/tonejs-instruments/samples/guitar-electric/Fs2.mp3',
'https://nbrosowsky.github.io/tonejs-instruments/samples/guitar-electric/A2.mp3',
'https://nbrosowsky.github.io/tonejs-instruments/samples/guitar-electric/C3.mp3',
'https://nbrosowsky.github.io/tonejs-instruments/samples/guitar-electric/Ds3.mp3',
'https://nbrosowsky.github.io/tonejs-instruments/samples/guitar-electric/Fs3.mp3',
'https://nbrosowsky.github.io/tonejs-instruments/samples/guitar-electric/A3.mp3',
'https://nbrosowsky.github.io/tonejs-instruments/samples/guitar-electric/C4.mp3',
'https://nbrosowsky.github.io/tonejs-instruments/samples/guitar-electric/Ds4.mp3',
'https://nbrosowsky.github.io/tonejs-instruments/samples/guitar-electric/Fs4.mp3',
'https://nbrosowsky.github.io/tonejs-instruments/samples/guitar-electric/A4.mp3',
'https://nbrosowsky.github.io/tonejs-instruments/samples/guitar-electric/C5.mp3',
'https://nbrosowsky.github.io/tonejs-instruments/samples/guitar-electric/Ds5.mp3',
'https://nbrosowsky.github.io/tonejs-instruments/samples/guitar-electric/Fs5.mp3',
'https://nbrosowsky.github.io/tonejs-instruments/samples/guitar-electric/A5.mp3',
'https://nbrosowsky.github.io/tonejs-instruments/samples/guitar-electric/C6.mp3'
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
          .filter(key => key !== CACHE_NAME && key !== DATA_CACHE_NAME)
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
  // .js/.json (canciones-adoracion.js, canciones-jubilo.js, manifest, etc.):
  // deben tratarse como "código de la app", igual que el HTML, para que
  // las actualizaciones de canciones lleguen de verdad y no se queden
  // pegadas en un caché viejo.
  const isAppCode = isSameOrigin && /\.(js|json)(\?.*)?$/.test(url.pathname);

  if (isHtmlNav || isAppCode) {
    e.respondWith(
      fetch(e.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, copy));
          return response;
        })
        .catch(() => caches.match(e.request).then((cached) => cached || (isHtmlNav ? caches.match('index.html') : undefined)))
    );
    return;
  }

  if (!isSameOrigin) {
    // Antes esto solo miraba si ya había algo cacheado y, si no, iba a la
    // red sin guardar nada — por eso los samples del piano (que se bajan
    // de tonejs.github.io) se volvían a descargar cada vez que no estaban
    // ya en el caché HTTP normal del navegador, con la demora que eso
    // causaba al abrir el piano. Ahora sí se guardan, igual que los PDFs.
    e.respondWith(
      caches.open(DATA_CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(e.request);
        const networkFetch = fetch(e.request).then((response) => {
          if (response) cache.put(e.request, response.clone());
          return response;
        }).catch(() => cached);

        return cached || networkFetch;
      }).catch(() => fetch(e.request))
    );
    return;
  }

  // Recursos pesados que rara vez cambian (PDFs, samples de piano):
  // caché primero para no gastar datos de más, refrescando en segundo plano.
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