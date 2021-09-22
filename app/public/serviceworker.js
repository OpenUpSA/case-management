const staticCacheName = 'site-static-v1';
const dynamicCacheName = 'site-dynamic-v1';
const assets = [
  '/',
  'index.html'
];

// install event
self.addEventListener('install', evt => {
  //console.log('service worker installed');
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log('caching shell assets');
      cache.addAll(assets);
    })
  );
});

// activate event
self.addEventListener('activate', evt => {
  //console.log('service worker activated');
  evt.waitUntil(
    caches.keys().then(keys => {
      //console.log(keys);
      return Promise.all(keys
        .filter(key => key !== staticCacheName && key !== dynamicCacheName)
        .map(key => caches.delete(key))
      );
    })
  );
});

// fetch event
self.addEventListener('fetch', evt => {
  //console.log('fetch event', evt);
  if (!(evt.request.url.indexOf('http') === 0)) return; 
  evt.respondWith(
    caches.match(evt.request, {ignoreVary: true}).then(cacheRes => {
      //console.log(cacheRes)
      return cacheRes || fetch(evt.request).then(fetchRes => {
        return caches.open(dynamicCacheName).then(cache => {
          cache.put(evt.request.url, fetchRes.clone());
          return fetchRes;
        })
      });
    }).catch(err => console.log(err))
  );
});