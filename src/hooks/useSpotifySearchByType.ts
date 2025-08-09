import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { cache } from '@/config/react-query'
import { API_LIMITS } from '@/constants/limits'
import { spotifyRepository } from '@/repositories'
import { SearchService } from '@/services/SearchService'
import { SpotifySearchType } from '@/types/spotify'
import { logger } from '@/utils/logger'

import { useDebounce } from './useDebounce'

// Interface para parâmetros do hook
interface UseSpotifySearchByTypeParams {
  q: string
  type: SpotifySearchType
  market?: string
  includeExternal?: boolean
}

// Interface para retorno do hook
interface UseSpotifySearchByTypeReturn {
  flatItems: unknown[]
  isFetching: boolean
  fetchNextPage: () => void
  hasNextPage: boolean
  total: number
}

// Interface para página de resultado
interface SearchPageResult {
  items: unknown[]
  total: number
  hasMore: boolean
}

export function useSpotifySearchByType({
  q,
  type,
  market = 'BR',
  includeExternal = false,
}: UseSpotifySearchByTypeParams): UseSpotifySearchByTypeReturn {
  // Debounce the query with 200ms delay (reduced for better responsiveness)
  const debouncedQ = useDebounce(q, 200)
  const searchService = useMemo(() => new SearchService(spotifyRepository), [])

  // Create a more specific cache key to avoid conflicts
  const queryKey = useMemo(
    () => [
      'spotify-search-by-type',
      debouncedQ,
      type,
      market,
      includeExternal,
      'v2', // Version to force cache refresh if needed
    ],
    [debouncedQ, type, market, includeExternal],
  )

  const { data, isFetching, fetchNextPage, hasNextPage } = useInfiniteQuery({
    initialPageParam: 0,
    queryKey,
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      // Enhanced query validation with debug logging
      const trimmedQuery = debouncedQ.trim()
      const isValidQuery = trimmedQuery.length >= 2

      if (import.meta.env.DEV) {
        logger.debug('🔍 useSpotifySearchByType - Query validation:', {
          originalQuery: debouncedQ,
          trimmedQuery,
          queryLength: trimmedQuery.length,
          isValidQuery,
          type,
          market,
        })
      }

      if (!isValidQuery) {
        return {
          items: [],
          total: 0,
          hasMore: false,
        }
      }

      const limit = API_LIMITS.SEARCH.DEFAULT
      const offset = pageParam * limit

      // Enhanced debug logging
      if (import.meta.env.DEV) {
        logger.debug('🔍 useSpotifySearchByType - Starting search:', {
          q: debouncedQ,
          type,
          market,
          includeExternal,
          pageParam,
          limit,
          offset,
          queryKey,
          timestamp: new Date().toISOString(),
        })
      }

      // Build filters object
      const filters = {
        market,
        includeExternal,
      }

      try {
        // Use SearchService helpers based on type
        let result: unknown

        switch (type) {
          case SpotifySearchType.ARTIST:
            result = await searchService.searchArtists(
              debouncedQ,
              filters,
              limit,
              offset,
            )
            break

          case SpotifySearchType.ALBUM:
            result = await searchService.searchAlbums(
              debouncedQ,
              filters,
              limit,
              offset,
            )
            break

          case SpotifySearchType.TRACK:
            result = await searchService.searchTracks(
              debouncedQ,
              filters,
              limit,
              offset,
            )
            break

          case SpotifySearchType.PLAYLIST:
            result = await searchService.searchPlaylists(
              debouncedQ,
              filters,
              limit,
              offset,
            )
            break

          case SpotifySearchType.SHOW:
            result = await searchService.searchShows(
              debouncedQ,
              filters,
              limit,
              offset,
            )
            break

          case SpotifySearchType.EPISODE:
            result = await searchService.searchEpisodes(
              debouncedQ,
              filters,
              limit,
              offset,
            )
            break

          case SpotifySearchType.AUDIOBOOK:
            result = await searchService.searchAudiobooks(
              debouncedQ,
              filters,
              limit,
              offset,
            )
            break

          default:
            throw new Error(`Unsupported search type: ${type}`)
        }

        // Enhanced debug logging for results
        if (import.meta.env.DEV) {
          const typedResult = result as {
            results: { items: unknown[]; total: number; hasMore: boolean }
          }
          logger.debug('🔍 useSpotifySearchByType - Search completed:', {
            type,
            query: debouncedQ,
            resultItems: typedResult.results?.items?.length || 0,
            resultTotal: typedResult.results?.total || 0,
            resultHasMore: typedResult.results?.hasMore || false,
            timestamp: new Date().toISOString(),
          })
        }

        return (result as { results: unknown }).results as unknown
      } catch (error) {
        logger.logError(
          'Search error in useSpotifySearchByType',
          error as Error,
          {
            type,
            query: debouncedQ,
            error: error instanceof Error ? error.message : error,
            timestamp: new Date().toISOString(),
          },
        )
        throw error
      }
    },
    getNextPageParam: (lastPage, allPages) => {
      // Calculate if there are more pages based on total and current offset
      const pageResult = lastPage as SearchPageResult
      const currentOffset = allPages.length * API_LIMITS.SEARCH.DEFAULT
      const hasMore =
        pageResult.hasMore &&
        currentOffset + API_LIMITS.SEARCH.DEFAULT < pageResult.total

      // Enhanced debug logging
      if (import.meta.env.DEV) {
        logger.debug('🔍 useSpotifySearchByType - getNextPageParam:', {
          type,
          lastPage: pageResult,
          allPagesLength: allPages.length,
          currentOffset,
          hasMore,
          total: pageResult.total,
          timestamp: new Date().toISOString(),
        })
      }

      return hasMore ? allPages.length : undefined
    },
    enabled: debouncedQ.trim().length >= 2,
    staleTime: cache.stale.FREQUENT, // Search results change frequently
    gcTime: cache.times.SHORT, // Keep in memory for short time
    retry: cache.retry.IMPORTANT.retry,
    retryDelay: cache.retry.IMPORTANT.retryDelay,
    // Add refetch on window focus to ensure fresh data
    refetchOnWindowFocus: true,
    // Add refetch on reconnect to handle network issues
    refetchOnReconnect: true,
  })

  // Flatten pages into a single array of items
  const flatItems = useMemo(() => {
    const items =
      data?.pages.flatMap((page) => (page as SearchPageResult).items) || []

    // Debug logging for flatItems
    if (import.meta.env.DEV) {
      logger.debug('🔍 useSpotifySearchByType - flatItems updated:', {
        type,
        itemsCount: items.length,
        pagesCount: data?.pages.length || 0,
        timestamp: new Date().toISOString(),
      })
    }

    return items
  }, [data?.pages, type])

  // Get total from the first page or 0
  const total = useMemo(() => {
    const totalValue = data?.pages[0]
      ? (data.pages[0] as SearchPageResult).total
      : 0

    // Debug logging for total
    if (import.meta.env.DEV) {
      logger.debug('🔍 useSpotifySearchByType - total updated:', {
        type,
        total: totalValue,
        timestamp: new Date().toISOString(),
      })
    }

    return totalValue
  }, [data?.pages, type])

  return {
    flatItems,
    isFetching,
    fetchNextPage,
    hasNextPage: hasNextPage || false,
    total,
  }
}
