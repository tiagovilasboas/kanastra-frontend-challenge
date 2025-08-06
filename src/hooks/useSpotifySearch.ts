import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo, useState } from 'react'

import { cache } from '@/config/react-query'
import { spotifyRepository } from '@/repositories'
import {
  AggregatedSearchResults,
  SearchService,
  SearchState,
} from '@/services/SearchService'
import { useSearchStore } from '@/stores/searchStore'
import { SearchFilters } from '@/types/search'
import { SpotifySearchType } from '@/types/spotify'

// Hook return interface
interface UseSpotifySearchReturn {
  // State
  searchState: SearchState
  results: AggregatedSearchResults

  // Actions
  search: (query: string, types: SpotifySearchType[]) => Promise<void>
  clearSearch: () => void

  // Filters
  filters: SearchFilters
  setFilters: (filters: SearchFilters) => void
}

export function useSpotifySearch(
  initialFilters?: Partial<SearchFilters>,
): UseSpotifySearchReturn {
  const queryClient = useQueryClient()
  const { debouncedSearchQuery } = useSearchStore()

  // Initialize search service
  const searchService = useMemo(() => new SearchService(spotifyRepository), [])

  // Local state for filters with initial values
  const [filters, setFiltersState] = useState<SearchFilters>({
    types: initialFilters?.types || [
      SpotifySearchType.ARTIST,
      SpotifySearchType.ALBUM,
      SpotifySearchType.TRACK,
      SpotifySearchType.PLAYLIST,
      SpotifySearchType.SHOW,
      SpotifySearchType.EPISODE,
      SpotifySearchType.AUDIOBOOK,
    ],
    genres: initialFilters?.genres || [],
    yearFrom: initialFilters?.yearFrom,
    yearTo: initialFilters?.yearTo,
    popularityFrom: initialFilters?.popularityFrom,
    popularityTo: initialFilters?.popularityTo,
    market: initialFilters?.market,
    includeExplicit: initialFilters?.includeExplicit ?? false,
    includeExternal: initialFilters?.includeExternal ?? false,
  })

  // Search query with React Query
  const {
    data: searchData,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      'spotify-search',
      debouncedSearchQuery,
      filters.types,
      filters.genres,
      filters.yearFrom,
      filters.yearTo,
      filters.popularityFrom,
      filters.popularityTo,
      filters.market,
      filters.includeExplicit,
      filters.includeExternal,
    ],
    queryFn: async () => {
      if (
        !debouncedSearchQuery.trim() ||
        debouncedSearchQuery.trim().length < 2
      ) {
        return {
          results: {
            artists: { items: [], total: 0, hasMore: false },
            albums: { items: [], total: 0, hasMore: false },
            tracks: { items: [], total: 0, hasMore: false },
            playlists: { items: [], total: 0, hasMore: false },
            shows: { items: [], total: 0, hasMore: false },
            episodes: { items: [], total: 0, hasMore: false },
            audiobooks: { items: [], total: 0, hasMore: false },
          },
          state: {
            isLoading: false,
            isLoadingMore: false,
            error: null,
            hasMore: false,
            totalResults: 0,
          },
        }
      }

      console.log('🔍 useSpotifySearch - filters.types:', filters.types)
      console.log(
        '🔍 useSpotifySearch - filters.types.length:',
        filters.types.length,
      )

      // If only one type is selected, use the specific method
      if (filters.types.length === 1) {
        const type = filters.types[0]

        // Fixed limit of 20 for specific types
        const limit = 20

        console.log('🔍 Debug Search Limits:', {
          type,
          typeLowerCase: type.toLowerCase(),
          limit,
          filtersTypes: filters.types,
        })

        switch (type) {
          case SpotifySearchType.ARTIST:
            const artistResult = await searchService.searchArtists(
              debouncedSearchQuery,
              filters as unknown as Record<string, unknown>,
              limit,
              0,
            )
            return {
              results: {
                artists: artistResult.results,
                albums: { items: [], total: 0, hasMore: false },
                tracks: { items: [], total: 0, hasMore: false },
                playlists: { items: [], total: 0, hasMore: false },
                shows: { items: [], total: 0, hasMore: false },
                episodes: { items: [], total: 0, hasMore: false },
                audiobooks: { items: [], total: 0, hasMore: false },
              },
              state: artistResult.state,
            }
          case SpotifySearchType.ALBUM:
            const albumResult = await searchService.searchAlbums(
              debouncedSearchQuery,
              filters as unknown as Record<string, unknown>,
              limit,
              0,
            )
            return {
              results: {
                artists: { items: [], total: 0, hasMore: false },
                albums: albumResult.results,
                tracks: { items: [], total: 0, hasMore: false },
                playlists: { items: [], total: 0, hasMore: false },
                shows: { items: [], total: 0, hasMore: false },
                episodes: { items: [], total: 0, hasMore: false },
                audiobooks: { items: [], total: 0, hasMore: false },
              },
              state: albumResult.state,
            }
          case SpotifySearchType.TRACK:
            const trackResult = await searchService.searchTracks(
              debouncedSearchQuery,
              filters as unknown as Record<string, unknown>,
              limit,
              0,
            )
            return {
              results: {
                artists: { items: [], total: 0, hasMore: false },
                albums: { items: [], total: 0, hasMore: false },
                tracks: trackResult.results,
                playlists: { items: [], total: 0, hasMore: false },
                shows: { items: [], total: 0, hasMore: false },
                episodes: { items: [], total: 0, hasMore: false },
                audiobooks: { items: [], total: 0, hasMore: false },
              },
              state: trackResult.state,
            }
          case SpotifySearchType.PLAYLIST:
            const playlistResult = await searchService.searchPlaylists(
              debouncedSearchQuery,
              filters as unknown as Record<string, unknown>,
              limit,
              0,
            )
            return {
              results: {
                artists: { items: [], total: 0, hasMore: false },
                albums: { items: [], total: 0, hasMore: false },
                tracks: { items: [], total: 0, hasMore: false },
                playlists: playlistResult.results,
                shows: { items: [], total: 0, hasMore: false },
                episodes: { items: [], total: 0, hasMore: false },
                audiobooks: { items: [], total: 0, hasMore: false },
              },
              state: playlistResult.state,
            }
          case SpotifySearchType.SHOW:
            const showResult = await searchService.searchShows(
              debouncedSearchQuery,
              filters as unknown as Record<string, unknown>,
              limit,
              0,
            )
            return {
              results: {
                artists: { items: [], total: 0, hasMore: false },
                albums: { items: [], total: 0, hasMore: false },
                tracks: { items: [], total: 0, hasMore: false },
                playlists: { items: [], total: 0, hasMore: false },
                shows: showResult.results,
                episodes: { items: [], total: 0, hasMore: false },
                audiobooks: { items: [], total: 0, hasMore: false },
              },
              state: showResult.state,
            }
          case SpotifySearchType.EPISODE:
            const episodeResult = await searchService.searchEpisodes(
              debouncedSearchQuery,
              filters as unknown as Record<string, unknown>,
              limit,
              0,
            )
            return {
              results: {
                artists: { items: [], total: 0, hasMore: false },
                albums: { items: [], total: 0, hasMore: false },
                tracks: { items: [], total: 0, hasMore: false },
                playlists: { items: [], total: 0, hasMore: false },
                shows: { items: [], total: 0, hasMore: false },
                episodes: episodeResult.results,
                audiobooks: { items: [], total: 0, hasMore: false },
              },
              state: episodeResult.state,
            }
          case SpotifySearchType.AUDIOBOOK:
            const audiobookResult = await searchService.searchAudiobooks(
              debouncedSearchQuery,
              filters as unknown as Record<string, unknown>,
              limit,
              0,
            )
            return {
              results: {
                artists: { items: [], total: 0, hasMore: false },
                albums: { items: [], total: 0, hasMore: false },
                tracks: { items: [], total: 0, hasMore: false },
                playlists: { items: [], total: 0, hasMore: false },
                shows: { items: [], total: 0, hasMore: false },
                episodes: { items: [], total: 0, hasMore: false },
                audiobooks: audiobookResult.results,
              },
              state: audiobookResult.state,
            }
          default:
            throw new Error(`Unsupported search type: ${type}`)
        }
      } else {
        // For multiple types or "all", use the appropriate method
        // Detecta se é modo "All" (mais de 1 tipo OU todos os tipos OU sentinel ALL)
        const isAllMode =
          filters.types.length > 1 ||
          filters.types.length === 7 ||
          filters.types.includes(SpotifySearchType.ALL)

        if (isAllMode) {
          // Use searchAllTypes for "All" mode with limit=5
          const result = await searchService.searchAllTypes(
            debouncedSearchQuery,
            filters.types,
            filters as unknown as Record<string, unknown>,
            0,
          )
          return result
        } else {
          // Use searchMultipleTypes for specific type combinations with limit=20
          const result = await searchService.searchMultipleTypes(
            debouncedSearchQuery,
            filters.types,
            filters as unknown as Record<string, unknown>,
            20,
            0,
          )
          return result
        }
      }
    },
    enabled: debouncedSearchQuery.trim().length >= 2,
    staleTime: cache.stale.FREQUENT, // Search results change frequently
    gcTime: cache.times.SHORT, // Keep in memory for short time
    retry: cache.retry.IMPORTANT.retry,
    retryDelay: cache.retry.IMPORTANT.retryDelay,
  })

  // Computed state
  const searchState: SearchState = useMemo(() => {
    if (isLoading) {
      return {
        isLoading: true,
        isLoadingMore: false,
        error: null,
        hasMore: false,
        totalResults: 0,
      }
    }

    if (error) {
      return {
        isLoading: false,
        isLoadingMore: false,
        error: error.message,
        hasMore: false,
        totalResults: 0,
      }
    }

    return (
      searchData?.state || {
        isLoading: false,
        isLoadingMore: false,
        error: null,
        hasMore: false,
        totalResults: 0,
      }
    )
  }, [isLoading, error, searchData])

  const results: AggregatedSearchResults = useMemo(() => {
    console.log('useSpotifySearch - searchData:', searchData)
    const defaultResults = {
      artists: { items: [], total: 0, hasMore: false },
      albums: { items: [], total: 0, hasMore: false },
      tracks: { items: [], total: 0, hasMore: false },
      playlists: { items: [], total: 0, hasMore: false },
      shows: { items: [], total: 0, hasMore: false },
      episodes: { items: [], total: 0, hasMore: false },
      audiobooks: { items: [], total: 0, hasMore: false },
    }

    const finalResults = searchData?.results || defaultResults
    console.log('useSpotifySearch - Final Results:', finalResults)
    return finalResults
  }, [searchData])

  // Actions
  const search = useCallback(async () => {
    // React Query handles the search automatically based on query key changes
    // This function is kept for backward compatibility
  }, [])

  const clearSearch = useCallback(() => {
    // Invalidate and remove search queries
    queryClient.removeQueries({
      queryKey: ['spotify-search'],
    })
  }, [queryClient])

  const setFilters = useCallback((newFilters: SearchFilters) => {
    setFiltersState(newFilters)
  }, [])

  return {
    searchState,
    results,
    search,
    clearSearch,
    filters,
    setFilters,
  }
}
