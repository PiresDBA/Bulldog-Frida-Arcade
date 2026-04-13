const CACHE_NAME = 'frida-arcade-v2.3';
const VERSION = '2.3';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './main.js',
  './manifest.json',
  './frida-icon.png',
  './luna-icon.png',
  './cinder-icon.png',
  './barbie-icon.png',
  './iris-icon.png',
  './luna-menu-transparent.png',
  './cartoon_bgm.mp3',
  './luna-latindo.mp3'
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Força este script a ser o ativo imediatamente
  // Força o navegador a buscar os arquivos novos (Cache Buster)
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      const bustedAssets = ASSETS.map(url => new Request(url + '?v=' + VERSION, { cache: 'reload' }));
      return cache.addAll(bustedAssets);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim()) // Assimila o controle das páginas web abertas
  );
});

self.addEventListener('fetch', (event) => {
  // Retira o '?v=X' do final se for procurar na cache, pois a chave original possui a string '?'
  event.respondWith(
    caches.match(event.request, {ignoreSearch: true}).then((response) => {
      return response || fetch(event.request);
    })
  );
});
