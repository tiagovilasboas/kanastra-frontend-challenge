import { QueryClient } from '@tanstack/react-query'

import { cache } from './cache'

// Query key factories for type safety
export const queryKeys = {
  // Search
  search: {
    all: ['searchArtists'] as const,
    byQuery: (query: string) => [...queryKeys.search.all, query] as const,
  },

  // Artists
  artists: {
    all: ['artist'] as const,
    details: (id: string) => [...queryKeys.artists.all, id] as const,
    topTracks: (id: string) =>
      [...queryKeys.artists.all, id, 'topTracks'] as const,
    albums: (id: string, page: number, limit: number) =>
      [...queryKeys.artists.all, id, 'albums', page, limit] as const,
    popular: (limit: number) =>
      [...queryKeys.artists.all, 'popular', limit] as const,
  },
} as const

// Query client configuration
export const createQueryClient = (): QueryClient => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Default stale time for most queries
        staleTime: cache.stale.OCCASIONAL,

        // Default cache time (gcTime)
        gcTime: cache.times.MEDIUM,

        // Default retry configuration
        retry: cache.retry.IMPORTANT.retry,
        retryDelay: cache.retry.IMPORTANT.retryDelay,

        // Refetch on window focus for critical data
        refetchOnWindowFocus: false,

        // Refetch on reconnect
        refetchOnReconnect: true,

        // Refetch on mount if data is stale
        refetchOnMount: true,
      },
      mutations: {
        // Default retry for mutations
        retry: 1,

        // Retry delay for mutations
        retryDelay: 1000,
      },
    },
  })
}

// Type for query key patterns
export type QueryKeyPattern = typeof queryKeys

// Re-export cache types for convenience
export type { CacheTime, RetryConfig, StaleTime } from './cache'

// Re-export cache constants for backward compatibility
export const CACHE_TIMES = cache.times
export const STALE_TIMES = cache.stale
export const RETRY_CONFIGS = cache.retry

// Export cache namespace
export { cache }
