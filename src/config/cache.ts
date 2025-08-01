// Cache time configurations (in milliseconds)
export const CACHE_TIMES = {
  // Short-lived data (search results, user input)
  SHORT: 2 * 60 * 1000, // 2 minutes

  // Medium-lived data (artist details, albums)
  MEDIUM: 10 * 60 * 1000, // 10 minutes

  // Long-lived data (static content, user preferences)
  LONG: 30 * 60 * 1000, // 30 minutes

  // Infinite data (authentication status)
  INFINITE: Infinity,
} as const

// Stale time configurations (in milliseconds)
export const STALE_TIMES = {
  // Data that changes frequently
  FREQUENT: 1 * 60 * 1000, // 1 minute

  // Data that changes occasionally
  OCCASIONAL: 5 * 60 * 1000, // 5 minutes

  // Data that rarely changes
  RARE: 15 * 60 * 1000, // 15 minutes

  // Data that never changes automatically
  STATIC: Infinity,
} as const

// Retry configurations
export const RETRY_CONFIGS = {
  // Critical data (auth, user info)
  CRITICAL: {
    retry: 3,
    retryDelay: (attemptIndex: number) =>
      Math.min(1000 * 2 ** attemptIndex, 30000),
  },

  // Important data (artist details, search)
  IMPORTANT: {
    retry: 2,
    retryDelay: (attemptIndex: number) =>
      Math.min(1000 * 2 ** attemptIndex, 10000),
  },

  // Optional data (recommendations, suggestions)
  OPTIONAL: {
    retry: 1,
    retryDelay: 1000,
  },

  // No retry for non-critical data
  NONE: {
    retry: false,
  },
} as const

// Type for cache time values
export type CacheTime = (typeof CACHE_TIMES)[keyof typeof CACHE_TIMES]

// Type for stale time values
export type StaleTime = (typeof STALE_TIMES)[keyof typeof STALE_TIMES]

// Type for retry configurations
export type RetryConfig = (typeof RETRY_CONFIGS)[keyof typeof RETRY_CONFIGS]

// Cache namespace for better organization
export const cache = {
  times: CACHE_TIMES,
  stale: STALE_TIMES,
  retry: RETRY_CONFIGS,
} as const
