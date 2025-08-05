import { useCallback, useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import {
  getDeviceBasedConfig,
  getLimitByType,
} from '@/config/searchLimits'
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
  loadMore: () => Promise<void>
  clearSearch: () => void

  // Filters
  filters: SearchFilters
  setFilters: (filters: SearchFilters) => void
}

export function useSpotifySearch(): UseSpotifySearchReturn {
  const queryClient = useQueryClient()
  const { searchQuery } = useSearchStore()

  // Initialize search service
  const searchService = useMemo(() => new SearchService(spotifyRepository), [])

  // Local state for filters
  const [filters, setFiltersState] = useState<SearchFilters>({
    types: [
      SpotifySearchType.ARTIST,
      SpotifySearchType.ALBUM,
      SpotifySearchType.TRACK,
      SpotifySearchType.PLAYLIST,
      SpotifySearchType.SHOW,
      SpotifySearchType.EPISODE,
      SpotifySearchType.AUDIOBOOK,
    ],
    genres: [],
    yearFrom: undefined,
    yearTo: undefined,
    popularityFrom: undefined,
    popularityTo: undefined,
    market: undefined,
    includeExplicit: false,
    includeExternal: false,
  })

  // Search query with React Query
  const {
    data: searchData,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      'spotify-search',
      searchQuery,
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
      if (!searchQuery.trim() || searchQuery.trim().length < 2) {
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

      // Se apenas um tipo está selecionado, usa o método específico
      if (filters.types.length === 1) {
        const type = filters.types[0]
        const limit = getLimitByType(
          type.toLowerCase(),
          getDeviceBasedConfig(),
        )

        switch (type) {
          case SpotifySearchType.ARTIST:
            const artistResult = await searchService.searchArtists(
              searchQuery,
              filters,
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
              searchQuery,
              filters,
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
              searchQuery,
              filters,
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
              searchQuery,
              filters,
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
              searchQuery,
              filters,
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
              searchQuery,
              filters,
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
              searchQuery,
              filters,
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
            throw new Error(`Tipo de busca não suportado: ${type}`)
        }
      } else {
        // Para múltiplos tipos ou "tudo", usa o método múltiplo
        const result = await searchService.searchMultipleTypes(
          searchQuery,
          filters.types,
          filters,
          0,
        )
        return result
      }
    },
    enabled: searchQuery.trim().length >= 2,
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

    return searchData?.state || {
      isLoading: false,
      isLoadingMore: false,
      error: null,
      hasMore: false,
      totalResults: 0,
    }
  }, [isLoading, error, searchData])

  const results: AggregatedSearchResults = useMemo(() => {
    return searchData?.results || {
      artists: { items: [], total: 0, hasMore: false },
      albums: { items: [], total: 0, hasMore: false },
      tracks: { items: [], total: 0, hasMore: false },
      playlists: { items: [], total: 0, hasMore: false },
      shows: { items: [], total: 0, hasMore: false },
      episodes: { items: [], total: 0, hasMore: false },
      audiobooks: { items: [], total: 0, hasMore: false },
    }
  }, [searchData])

  // Actions
  const search = useCallback(
    async (_query: string, _types: SpotifySearchType[]) => {
      // React Query handles the search automatically based on query key changes
      // This function is kept for backward compatibility
    },
    []
  )

  const loadMore = useCallback(async () => {
    if (!searchState.hasMore || searchState.isLoadingMore || !searchQuery.trim()) {
      return
    }

    // TODO: Implement load more with React Query
    // This would require a separate query or mutation
  }, [searchState.hasMore, searchState.isLoadingMore, searchQuery])

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
    loadMore,
    clearSearch,
    filters,
    setFilters,
  }
}
