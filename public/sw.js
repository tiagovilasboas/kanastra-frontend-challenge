// Service Worker for Spotify Clone
// Strategic caching for performance optimization

const STATIC_CACHE = 'static-cache-v1'
const IMAGES_CACHE = 'images-cache-v1'
const API_CACHE = 'api-cache-v1'

const STATIC_ASSETS = ['/', '/manifest.json', '/spotify-icon.svg']

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting()),
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== STATIC_CACHE &&
              cacheName !== IMAGES_CACHE &&
              cacheName !== API_CACHE
            ) {
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => self.clients.claim()),
  )
})

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Strategy 1: Cache First for images from Spotify
  if (request.destination === 'image' || url.hostname.includes('spotify')) {
    event.respondWith(cacheFirstStrategy(request, IMAGES_CACHE, 604800000)) // 7 days
    return
  }

  // Strategy 2: Network First for API calls
  if (
    url.pathname.startsWith('/api/') ||
    url.hostname.includes('api.spotify.com')
  ) {
    event.respondWith(networkFirstStrategy(request, API_CACHE, 300000)) // 5 minutes
    return
  }

  // Strategy 3: Stale While Revalidate for static assets
  if (
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'document'
  ) {
    event.respondWith(staleWhileRevalidateStrategy(request, STATIC_CACHE))
    return
  }

  // Default: Network only
  event.respondWith(fetch(request))
})

// Cache First Strategy (best for images)
async function cacheFirstStrategy(request, cacheName, maxAge) {
  try {
    const cache = await caches.open(cacheName)
    const cached = await cache.match(request)

    if (cached) {
      const dateHeader = cached.headers.get('date')
      const cachedDate = dateHeader ? new Date(dateHeader).getTime() : 0
      const now = Date.now()

      // Check if cache is still valid
      if (now - cachedDate < maxAge) {
        return cached
      }
    }

    // Fetch from network and cache
    const response = await fetch(request)
    if (response.ok) {
      cache.put(request, response.clone())
    }
    return response
  } catch {
    // Return cached version if network fails
    const cache = await caches.open(cacheName)
    const cached = await cache.match(request)
    return cached || new Response('Network error', { status: 408 })
  }
}

// Network First Strategy (best for API calls)
async function networkFirstStrategy(request, cacheName, maxAge) {
  try {
    const response = await fetch(request)

    if (response.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, response.clone())
    }

    return response
  } catch {
    // Fall back to cache
    const cache = await caches.open(cacheName)
    const cached = await cache.match(request)

    if (cached) {
      const dateHeader = cached.headers.get('date')
      const cachedDate = dateHeader ? new Date(dateHeader).getTime() : 0
      const now = Date.now()

      // Return cached if within acceptable age
      if (now - cachedDate < maxAge) {
        return cached
      }
    }

    return new Response('Network error', { status: 408 })
  }
}

// Stale While Revalidate Strategy (best for static assets)
async function staleWhileRevalidateStrategy(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)

  // Start fetch in background
  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone())
    }
    return response
  })

  // Return cached immediately if available, otherwise wait for fetch
  return cached || fetchPromise
}
