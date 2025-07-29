const CACHE_NAME = 'zero1-network-v1';
const STATIC_CACHE = 'zero1-static-v1';
const DYNAMIC_CACHE = 'zero1-dynamic-v1';

// Cache static assets
const STATIC_ASSETS = [
  '/',
  '/zero1-logo-dark.svg',
  '/manifest.json'
];

// Cache strategies
const CACHE_STRATEGIES = {
  // Always fetch fresh data for HTML pages and JSON
  NETWORK_FIRST: ['/', '/archive', '/channels', '/about', '.json'],
  // Cache static assets aggressively  
  CACHE_FIRST: ['.css', '.js', '.woff2', '.woff', '.svg', '.png', '.jpg', '.webp'],
  // Cache images with fallback to network
  STALE_WHILE_REVALIDATE: ['img.youtube.com']
};

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => 
            cacheName.startsWith('zero1-') && 
            ![STATIC_CACHE, DYNAMIC_CACHE].includes(cacheName)
          )
          .map(cacheName => caches.delete(cacheName))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip Chrome extension requests
  if (url.protocol === 'chrome-extension:') return;

  event.respondWith(
    handleRequest(request)
  );
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
  // Network first strategy for HTML and JSON (always fresh content)
  if (shouldUseNetworkFirst(request)) {
    return networkFirst(request);
  }
  
  // Cache first for static assets
  if (shouldUseCacheFirst(request)) {
    return cacheFirst(request);
  }
  
  // Stale while revalidate for images
  if (shouldUseStaleWhileRevalidate(request)) {
    return staleWhileRevalidate(request);
  }
  
  // Default to network first
  return networkFirst(request);
}

function shouldUseNetworkFirst(request) {
  const url = new URL(request.url);
  return CACHE_STRATEGIES.NETWORK_FIRST.some(pattern => 
    url.pathname.includes(pattern) || url.pathname.endsWith(pattern)
  );
}

function shouldUseCacheFirst(request) {
  const url = new URL(request.url);
  return CACHE_STRATEGIES.CACHE_FIRST.some(pattern => 
    url.pathname.includes(pattern) || url.pathname.endsWith(pattern)
  );
}

function shouldUseStaleWhileRevalidate(request) {
  const url = new URL(request.url);
  return CACHE_STRATEGIES.STALE_WHILE_REVALIDATE.some(pattern => 
    url.hostname.includes(pattern)
  );
}

// Network first strategy - always try network, fallback to cache
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Only cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Offline content not available', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Cache first strategy - check cache first, fallback to network  
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    return new Response('Resource not available offline', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Stale while revalidate - return cache immediately, update in background
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  // Fetch in background and update cache
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => cachedResponse);
  
  // Return cached version immediately, or wait for network if no cache
  return cachedResponse || fetchPromise;
}

// Background sync for offline actions (future enhancement)
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Future: sync any offline actions when connection is restored
  console.log('Background sync triggered');
}