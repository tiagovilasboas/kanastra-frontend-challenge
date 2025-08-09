import { logger } from './logger'

interface ServiceWorkerConfig {
  cacheVersion: string
  staticCacheName: string
  imageCacheName: string
  apiCacheName: string
  maxImageCacheAge: number
  maxApiCacheAge: number
}

const CONFIG: ServiceWorkerConfig = {
  cacheVersion: 'v1',
  staticCacheName: 'static-cache-v1',
  imageCacheName: 'images-cache-v1',
  apiCacheName: 'api-cache-v1',
  maxImageCacheAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  maxApiCacheAge: 5 * 60 * 1000, // 5 minutes
}

// Service Worker registration
export async function registerServiceWorker(): Promise<void> {
  if (!('serviceWorker' in navigator) || import.meta.env.DEV) {
    logger.info('Service Worker not available or in development mode')
    return
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    })

    logger.info('Service Worker registered successfully', {
      scope: registration.scope,
    })

    // Listen for updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (
            newWorker.state === 'installed' &&
            navigator.serviceWorker.controller
          ) {
            logger.info('New Service Worker available')
            // Optionally notify user about update
            showUpdateNotification()
          }
        })
      }
    })
  } catch (error) {
    logger.error('Service Worker registration failed', error as Error)
  }
}

// Show update notification to user
function showUpdateNotification(): void {
  // This could be integrated with your notification system
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('App Update Available', {
      body: 'A new version of the app is available. Refresh to update.',
      icon: '/spotify-icon.svg',
    })
  }
}

// Generate Service Worker content
export function generateServiceWorkerContent(): string {
  return `
// Service Worker for Spotify Clone
// Generated at build time with strategic caching

const CACHE_VERSION = '${CONFIG.cacheVersion}';
const STATIC_CACHE = '${CONFIG.staticCacheName}';
const IMAGES_CACHE = '${CONFIG.imageCacheName}';
const API_CACHE = '${CONFIG.apiCacheName}';

const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/spotify-icon.svg',
  // Add other static assets that should be cached
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== IMAGES_CACHE && 
                cacheName !== API_CACHE) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Strategy 1: Cache First for images from Spotify
  if (request.destination === 'image' || url.hostname.includes('spotify')) {
    event.respondWith(cacheFirstStrategy(request, IMAGES_CACHE, ${CONFIG.maxImageCacheAge}));
    return;
  }

  // Strategy 2: Network First for API calls
  if (url.pathname.startsWith('/api/') || url.hostname.includes('api.spotify.com')) {
    event.respondWith(networkFirstStrategy(request, API_CACHE, ${CONFIG.maxApiCacheAge}));
    return;
  }

  // Strategy 3: Stale While Revalidate for static assets
  if (request.destination === 'script' || 
      request.destination === 'style' || 
      request.destination === 'document') {
    event.respondWith(staleWhileRevalidateStrategy(request, STATIC_CACHE));
    return;
  }

  // Default: Network only
  event.respondWith(fetch(request));
});

// Cache First Strategy (best for images)
async function cacheFirstStrategy(request, cacheName, maxAge) {
  try {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    
    if (cached) {
      const dateHeader = cached.headers.get('date');
      const cachedDate = dateHeader ? new Date(dateHeader).getTime() : 0;
      const now = Date.now();
      
      // Check if cache is still valid
      if (now - cachedDate < maxAge) {
        return cached;
      }
    }
    
    // Fetch from network and cache
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
    
  } catch (error) {
    // Return cached version if network fails
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    return cached || new Response('Network error', { status: 408 });
  }
}

// Network First Strategy (best for API calls)
async function networkFirstStrategy(request, cacheName, maxAge) {
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    
    return response;
    
  } catch (error) {
    // Fall back to cache
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    
    if (cached) {
      const dateHeader = cached.headers.get('date');
      const cachedDate = dateHeader ? new Date(dateHeader).getTime() : 0;
      const now = Date.now();
      
      // Return cached if within acceptable age
      if (now - cachedDate < maxAge) {
        return cached;
      }
    }
    
    throw error;
  }
}

// Stale While Revalidate Strategy (best for static assets)
async function staleWhileRevalidateStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  // Start fetch in background
  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  });
  
  // Return cached immediately if available, otherwise wait for fetch
  return cached || fetchPromise;
}
`
}

// Utility to check if Service Worker is supported and active
export function isServiceWorkerSupported(): boolean {
  return 'serviceWorker' in navigator
}

export function isServiceWorkerActive(): boolean {
  return (
    isServiceWorkerSupported() && navigator.serviceWorker.controller !== null
  )
}

// Clear all caches
export async function clearAllCaches(): Promise<void> {
  if (!isServiceWorkerSupported()) return

  try {
    const cacheNames = await caches.keys()
    await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)))
    logger.info('All caches cleared')
  } catch (error) {
    logger.error('Failed to clear caches', error as Error)
  }
}

// Get cache storage usage
export async function getCacheStorageUsage(): Promise<{
  used: number
  quota: number
} | null> {
  if (!('storage' in navigator) || !('estimate' in navigator.storage)) {
    return null
  }

  try {
    const estimate = await navigator.storage.estimate()
    return {
      used: estimate.usage || 0,
      quota: estimate.quota || 0,
    }
  } catch (error) {
    logger.error('Failed to get storage estimate', error as Error)
    return null
  }
}
