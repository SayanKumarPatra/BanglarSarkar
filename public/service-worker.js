const CACHE_NAME = 'sahaj-seba-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.png',
  '/favicon.ico',
  '/icon.svg',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-192-maskable.png',
  '/icon-512-maskable.png'
];

// Install listener
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Pre-caching critical application assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate listener
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheKeys) => {
      return Promise.all(
        cacheKeys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache storage key:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch listener
self.addEventListener('fetch', (event) => {
  // Only intercept GET queries
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Avoid intercepting non-HTTP protocols (e.g., chrome-extension://, file://)
  if (!url.protocol.startsWith('http')) return;

  // Bypass cache for development HMR websockets or other non-cached queries
  if (url.pathname.includes('/socket.io') || url.pathname.includes('/ws')) return;

  // Bypass cache for API endpoints so that they are live-queried
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Fallback or offline JSON response if network fails
        return new Response(
          JSON.stringify({ error: "নেটওয়ার্ক কানেকশন ডাউন রয়েছে। অনুগ্রহ করে লাইভ সেবার জন্য পুনরায় চেষ্টা করুন।" }), 
          { 
            status: 503, 
            headers: { 'Content-Type': 'application/json; charset=utf-8' } 
          }
        );
      })
    );
    return;
  }

  // Handle SPA routing: fall back to /index.html if we are navigating to an HTML route
  const isNavigation = event.request.mode === 'navigate';
  
  if (isNavigation) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          // Put clean HTML in cache for offline use
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put('/index.html', responseClone);
          });
          return networkResponse;
        })
        .catch(() => {
          // If offline, serve cached /index.html
          return caches.match('/index.html');
        })
    );
    return;
  }

  // Stale-While-Revalidate caching strategy for internal assets
  const isLocalAsset = url.origin === self.location.origin;

  if (isLocalAsset) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        }).catch((err) => {
          console.log('[Service Worker] Failed background fetch for static asset:', err);
        });

        // Return the cached response first if it exists, otherwise wait for the network fetch
        return cachedResponse || fetchPromise;
      })
    );
  } else {
    // External resources (e.g., Google Web Fonts, CDNs, etc.)
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(event.request).then((networkResponse) => {
          // Cache fonts or static assets from external CDNs safely
          if (networkResponse && networkResponse.status === 200) {
            const isFont = url.hostname.includes('fonts.gstatic.com') || url.hostname.includes('fonts.googleapis.com');
            const isCdn = url.pathname.endsWith('.js') || url.pathname.endsWith('.css') || url.pathname.endsWith('.png');
            
            if (isFont || isCdn) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone);
              });
            }
          }
          return networkResponse;
        }).catch(() => {
          // Fail gracefully for foreign requests without crash
          return null;
        });
      })
    );
  }
});
