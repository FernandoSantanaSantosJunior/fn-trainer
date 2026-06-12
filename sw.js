self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('fn-trainer-v1').then((cache) => {
      return cache.addAll(['/', '/index.html', '/style.css', '/home.js']);
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then((res) => res || fetch(e.request)));
});
