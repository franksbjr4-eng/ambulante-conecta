const CACHE = 'ambulante-conecta-v1';
const ASSETS = [
  'cadastro.html','orientacao.html','mapa.html','comunicacao.html','gestor.html','dashboard.html',
  'styles.css','script.js','manifest.json'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).catch(() => caches.match('cadastro.html'))));
});
