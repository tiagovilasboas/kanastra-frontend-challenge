import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { cache } from '@/config/react-query'
import { API_LIMITS } from '@/constants/limits'
import { spotifyRepository } from '@/repositories'
import { SearchService } from '@/services/SearchService'
import { SpotifySearchType } from '@/types/spotify'
import { logger } from '@/utils/logger'

import { useDebounce } from './useDebounce'

// Interface for page result (internal to hook)
interface SearchPageResult {
  items: unknown[]
  total: number
  hasMore: boolean
}

// Interface for hook parameters
interface UseSpotifyInfiniteByTypeParams {
  q: string
  type: SpotifySearchType
  market?: string
  pageSize?: number
  includeExternal?: boolean
}

// Interface for hook return
interface UseSpotifyInfiniteByTypeReturn {
  flatItems: unknown[]
  isFetching: boolean
  isFetchingNextPage: boolean
  fetchNextPage: () => void
  hasNextPage: boolean
  total: number
}

export function useSpotifyInfiniteByType({
  q,
  type,
  market = 'BR',
  pageSize = API_LIMITS.SEARCH.DEFAULT,
  includeExternal = false,
}: UseSpotifyInfiniteByTypeParams): UseSpotifyInfiniteByTypeReturn {
  const debouncedQ = useDebounce(q, 350)
  const searchService = useMemo(() => new SearchService(spotifyRepository), [])

  const { data, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      initialPageParam: 0,
      queryKey: [
        'spotify',
        'search',
        { q: debouncedQ, type, market, pageSize },
      ],
      queryFn: async ({ pageParam }: { pageParam: number }) => {
        if (!debouncedQ.trim() || debouncedQ.trim().length < 2) {
          return {
            items: [],
            total: 0,
            hasMore: false,
          } as SearchPageResult
        }

        const offset = pageParam * pageSize

        if (import.meta.env.DEV) {
          logger.debug('🔍 useSpotifyInfiniteByType - Debug:', {
            q: debouncedQ,
            type,
            market,
            pageSize,
            pageParam,
            offset,
          })
        }

        const filters = {
          market,
          includeExternal,
        }

        let result
        switch (type) {
          case SpotifySearchType.ARTIST:
            result = await searchService.searchArtists(
              debouncedQ,
              filters,
              pageSize,
              offset,
            )
            return result.results as unknown
          case SpotifySearchType.ALBUM:
            result = await searchService.searchAlbums(
              debouncedQ,
              filters,
              pageSize,
              offset,
            )
            return result.results as unknown
          case SpotifySearchType.TRACK:
            result = await searchService.searchTracks(
              debouncedQ,
              filters,
              pageSize,
              offset,
            )
            return result.results as unknown
          case SpotifySearchType.PLAYLIST:
            result = await searchService.searchPlaylists(
              debouncedQ,
              filters,
              pageSize,
              offset,
            )
            return result.results as unknown
          case SpotifySearchType.SHOW:
            result = await searchService.searchShows(
              debouncedQ,
              filters,
              pageSize,
              offset,
            )
            return result.results as unknown
          case SpotifySearchType.EPISODE:
            result = await searchService.searchEpisodes(
              debouncedQ,
              filters,
              pageSize,
              offset,
            )
            return result.results as unknown
          case SpotifySearchType.AUDIOBOOK:
            result = await searchService.searchAudiobooks(
              debouncedQ,
              filters,
              pageSize,
              offset,
            )
            return result.results as unknown
          default:
            throw new Error(`Unsupported search type: ${type}`)
        }
      },
      getNextPageParam: (lastPage, allPages) => {
        const pageResult = lastPage as SearchPageResult
        const currentOffset = allPages.length * pageSize
        const hasMore =
          pageResult.hasMore && currentOffset + pageSize < pageResult.total

        if (import.meta.env.DEV) {
          logger.debug('🔍 useSpotifyInfiniteByType - getNextPageParam:', {
            lastPage: pageResult,
            allPagesLength: allPages.length,
            currentOffset,
            hasMore,
            total: pageResult.total,
          })
        }

        return hasMore ? allPages.length : undefined
      },
      enabled: debouncedQ.trim().length >= 2,
      staleTime: cache.stale.FREQUENT,
      gcTime: cache.times.SHORT,
      retry: cache.retry.IMPORTANT.retry,
      retryDelay: cache.retry.IMPORTANT.retryDelay,
    })

  const flatItems = useMemo(() => {
    return data?.pages.flatMap((page) => (page as SearchPageResult).items) || []
  }, [data?.pages])

  const total = useMemo(() => {
    return data?.pages[0] ? (data.pages[0] as SearchPageResult).total : 0
  }, [data?.pages])

  return {
    flatItems,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage: hasNextPage || false,
    total,
  }
}
