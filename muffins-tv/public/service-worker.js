const CACHE_NAME = "muffins-cache-v1";
const urlsToCache = [
  "/",
  "/css/styles.css",
  "/js/scripts.js",
  "/images/favicon/web-app-manifest-96x96.png",
  "/images/favicon/web-app-manifest-192x192.png",
  "/images/favicon/web-app-manifest-512x512.png",
];

// Instalar o Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Buscar arquivos do cache
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Atualizar o cache
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});
