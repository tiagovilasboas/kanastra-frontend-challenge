import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { cache } from '@/config/react-query'
import { spotifyRepository } from '@/repositories'
import { SearchService } from '@/services/SearchService'
import { SpotifySearchType } from '@/types/spotify'

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
  // Debounce the query with 350ms delay
  const debouncedQ = useDebounce(q, 350)
  const searchService = useMemo(() => new SearchService(spotifyRepository), [])

  const { data, isFetching, fetchNextPage, hasNextPage } = useInfiniteQuery({
    initialPageParam: 0,
    queryKey: [
      'spotify-search-by-type',
      debouncedQ,
      type,
      market,
      includeExternal,
    ],
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      if (!debouncedQ.trim() || debouncedQ.trim().length < 2) {
        return {
          items: [],
          total: 0,
          hasMore: false,
        }
      }

      const limit = 20
      const offset = pageParam * limit

      // Only log in development
      if (import.meta.env.DEV) {
        console.log('🔍 useSpotifySearchByType - Debug:', {
          q: debouncedQ,
          type,
          market,
          includeExternal,
          pageParam,
          limit,
          offset,
        })
      }

      // Build filters object
      const filters = {
        market,
        includeExternal,
      }

      // Use SearchService helpers based on type
      switch (type) {
        case SpotifySearchType.ARTIST:
          const artistResult = await searchService.searchArtists(
            debouncedQ,
            filters,
            limit,
            offset,
          )
          return artistResult.results as unknown

        case SpotifySearchType.ALBUM:
          const albumResult = await searchService.searchAlbums(
            debouncedQ,
            filters,
            limit,
            offset,
          )
          return albumResult.results as unknown

        case SpotifySearchType.TRACK:
          const trackResult = await searchService.searchTracks(
            debouncedQ,
            filters,
            limit,
            offset,
          )
          return trackResult.results as unknown

        case SpotifySearchType.PLAYLIST:
          const playlistResult = await searchService.searchPlaylists(
            debouncedQ,
            filters,
            limit,
            offset,
          )
          return playlistResult.results as unknown

        case SpotifySearchType.SHOW:
          const showResult = await searchService.searchShows(
            debouncedQ,
            filters,
            limit,
            offset,
          )
          return showResult.results as unknown

        case SpotifySearchType.EPISODE:
          const episodeResult = await searchService.searchEpisodes(
            debouncedQ,
            filters,
            limit,
            offset,
          )
          return episodeResult.results as unknown

        case SpotifySearchType.AUDIOBOOK:
          const audiobookResult = await searchService.searchAudiobooks(
            debouncedQ,
            filters,
            limit,
            offset,
          )
          return audiobookResult.results as unknown

        default:
          throw new Error(`Unsupported search type: ${type}`)
      }
    },
    getNextPageParam: (lastPage, allPages) => {
      // Calculate if there are more pages based on total and current offset
      const pageResult = lastPage as SearchPageResult
      const currentOffset = allPages.length * 20 // 20 items per page
      const hasMore =
        pageResult.hasMore && currentOffset + 20 < pageResult.total

      // Only log in development
      if (import.meta.env.DEV) {
        console.log('🔍 useSpotifySearchByType - getNextPageParam:', {
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
    staleTime: cache.stale.FREQUENT, // Search results change frequently
    gcTime: cache.times.SHORT, // Keep in memory for short time
    retry: cache.retry.IMPORTANT.retry,
    retryDelay: cache.retry.IMPORTANT.retryDelay,
  })

  // Flatten pages into a single array of items
  const flatItems = useMemo(() => {
    return data?.pages.flatMap((page) => (page as SearchPageResult).items) || []
  }, [data?.pages])

  // Get total from the first page or 0
  const total = useMemo(() => {
    return data?.pages[0] ? (data.pages[0] as SearchPageResult).total : 0
  }, [data?.pages])

  return {
    flatItems,
    isFetching,
    fetchNextPage,
    hasNextPage: hasNextPage || false,
    total,
  }
}
