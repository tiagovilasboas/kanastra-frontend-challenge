import { useCallback, useEffect, useRef, useState } from 'react'

import { spotifyRepository } from '@/repositories'
import { useSearchStore } from '@/stores/searchStore'
import { SearchFilters } from '@/types/search'
import { SpotifyAlbum, SpotifyArtist, SpotifyTrack } from '@/types/spotify'
import { logger } from '@/utils/logger'

// Types
interface SearchResults {
  artists: SpotifyArtist[]
  albums: SpotifyAlbum[]
  tracks: SpotifyTrack[]
}

interface SearchState {
  isLoading: boolean
  isLoadingMore: boolean
  error: string | null
  hasMore: boolean
  totalResults: number
}

interface UseSpotifySearchReturn {
  // Search state
  searchState: SearchState
  results: SearchResults

  // Search actions
  search: (
    query: string,
    types: ('artist' | 'album' | 'track')[],
  ) => Promise<void>
  loadMore: () => Promise<void>
  clearSearch: () => void

  // Filters
  filters: SearchFilters
  setFilters: (filters: SearchFilters) => void
  buildSearchQuery: (baseQuery: string) => string
}

export function useSpotifySearch(): UseSpotifySearchReturn {
  const { searchQuery } = useSearchStore()
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [results, setResults] = useState<SearchResults>({
    artists: [],
    albums: [],
    tracks: [],
  })
  const [searchState, setSearchState] = useState<SearchState>({
    isLoading: false,
    isLoadingMore: false,
    error: null,
    hasMore: false,
    totalResults: 0,
  })
  const [page, setPage] = useState(0)
  const [limit] = useState(20)
  const [currentSearchTypes, setCurrentSearchTypes] = useState<
    ('artist' | 'album' | 'track')[]
  >(['artist'])
  const [filters, setFilters] = useState<SearchFilters>({
    types: ['artist'],
    genres: [],
    yearFrom: undefined,
    yearTo: undefined,
    popularityFrom: undefined,
    popularityTo: undefined,
    market: undefined,
    includeExplicit: false,
    includeExternal: false,
  })
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // Build advanced search query with filters
  const buildSearchQuery = useCallback(
    (baseQuery: string): string => {
      let query = baseQuery

      // Add genre filters
      if (filters.genres && filters.genres.length > 0) {
        const genreFilters = filters.genres
          .map((genre) => `genre:${genre}`)
          .join(' ')
        query += ` ${genreFilters}`
      }

      // Add year range
      if (filters.yearFrom || filters.yearTo) {
        const yearFilter = `year:${filters.yearFrom || '*'}-${filters.yearTo || '*'}`
        query += ` ${yearFilter}`
      }

      // Add popularity range
      if (filters.popularityFrom || filters.popularityTo) {
        const popularityFilter = `popularity:${filters.popularityFrom || 0}-${filters.popularityTo || 100}`
        query += ` ${popularityFilter}`
      }

      return query.trim()
    },
    [filters],
  )

  // Search function
  const search = useCallback(
    async (query: string, types: ('artist' | 'album' | 'track')[]) => {
      if (!query.trim()) {
        setResults({ artists: [], albums: [], tracks: [] })
        setSearchState((prev) => ({ ...prev, isLoading: false, error: null }))
        return
      }

      setSearchState((prev) => ({ ...prev, isLoading: true, error: null }))
      setCurrentSearchTypes(types)

      try {
        // Ensure we have a token
        if (
          !spotifyRepository.isAuthenticated() &&
          !spotifyRepository.getAuthStatus().hasClientToken
        ) {
          await spotifyRepository.getClientToken()
        }

        const advancedQuery = buildSearchQuery(query)
        const offset = 0

        logger.debug('Starting segmented search', {
          query: advancedQuery,
          types,
          offset,
        })

        // Search for each type
        const searchPromises = types.map(async (type) => {
          try {
            const response = await spotifyRepository.searchAdvanced(
              advancedQuery,
              type,
              undefined,
              limit,
              offset,
            )
            return { type, response }
          } catch (error) {
            logger.error(`Search failed for type ${type}`, error)
            return { type, response: null }
          }
        })

        const searchResults = await Promise.all(searchPromises)

        // Process results
        const newResults: SearchResults = {
          artists: [],
          albums: [],
          tracks: [],
        }

        let totalResults = 0

        searchResults.forEach(({ type, response }) => {
          if (response) {
            const items = response[type + 's']?.items || []
            const total = response[type + 's']?.total || 0

            switch (type) {
              case 'artist':
                newResults.artists = items
                break
              case 'album':
                newResults.albums = items
                break
              case 'track':
                newResults.tracks = items
                break
            }

            totalResults += total
          }
        })

        setResults(newResults)
        setSearchState((prev) => ({
          ...prev,
          isLoading: false,
          totalResults,
          hasMore: totalResults > limit,
          error: null,
        }))

        logger.debug('Segmented search completed', {
          results: {
            artists: newResults.artists.length,
            albums: newResults.albums.length,
            tracks: newResults.tracks.length,
          },
          totalResults,
        })
      } catch (error) {
        logger.error('Search error', error)
        setSearchState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Search failed',
        }))
      }
    },
    [buildSearchQuery, limit],
  )

  // Load more function
  const loadMore = useCallback(async () => {
    if (
      !searchState.hasMore ||
      searchState.isLoadingMore ||
      !debouncedQuery.trim()
    ) {
      return
    }

    setSearchState((prev) => ({ ...prev, isLoadingMore: true }))
    const nextPage = page + 1
    setPage(nextPage)

    try {
      const advancedQuery = buildSearchQuery(debouncedQuery)
      const offset = nextPage * limit

      logger.debug('Loading more results', {
        query: advancedQuery,
        types: currentSearchTypes,
        offset,
      })

      // Load more for each type
      const loadMorePromises = currentSearchTypes.map(async (type) => {
        try {
          const response = await spotifyRepository.searchAdvanced(
            advancedQuery,
            type,
            undefined,
            limit,
            offset,
          )
          return { type, response }
        } catch (error) {
          logger.error(`Load more failed for type ${type}`, error)
          return { type, response: null }
        }
      })

      const loadMoreResults = await Promise.all(loadMorePromises)

      // Merge results
      setResults((prev) => {
        const newResults = { ...prev }

        loadMoreResults.forEach(({ type, response }) => {
          if (response) {
            const newItems = response[type + 's']?.items || []
            const existingIds = new Set(
              newResults[(type + 's') as keyof SearchResults].map(
                (item: SpotifyArtist | SpotifyAlbum | SpotifyTrack) => item.id,
              ),
            )
            const uniqueNewItems = newItems.filter(
              (item: SpotifyArtist | SpotifyAlbum | SpotifyTrack) =>
                !existingIds.has(item.id),
            )

            switch (type) {
              case 'artist':
                newResults.artists = [...newResults.artists, ...uniqueNewItems]
                break
              case 'album':
                newResults.albums = [...newResults.albums, ...uniqueNewItems]
                break
              case 'track':
                newResults.tracks = [...newResults.tracks, ...uniqueNewItems]
                break
            }
          }
        })

        return newResults
      })

      setSearchState((prev) => ({ ...prev, isLoadingMore: false }))
    } catch (error) {
      logger.error('Load more error', error)
      setSearchState((prev) => ({
        ...prev,
        isLoadingMore: false,
        error: error instanceof Error ? error.message : 'Load more failed',
      }))
    }
  }, [
    searchState.hasMore,
    searchState.isLoadingMore,
    debouncedQuery,
    buildSearchQuery,
    limit,
    page,
    currentSearchTypes,
  ])

  // Clear search function
  const clearSearch = useCallback(() => {
    setDebouncedQuery('')
    setResults({ artists: [], albums: [], tracks: [] })
    setPage(0)
    setSearchState({
      isLoading: false,
      isLoadingMore: false,
      error: null,
      hasMore: false,
      totalResults: 0,
    })
  }, [])

  // Debounce effect
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    if (searchQuery.trim()) {
      debounceRef.current = setTimeout(() => {
        logger.debug('Debounced search triggered', { searchQuery })
        setDebouncedQuery(searchQuery)
        setPage(0)
        setSearchState((prev) => ({ ...prev, error: null }))
        search(searchQuery, filters.types)
      }, 500)
    } else {
      setDebouncedQuery('')
      setResults({ artists: [], albums: [], tracks: [] })
      setPage(0)
      setSearchState({
        isLoading: false,
        isLoadingMore: false,
        error: null,
        hasMore: false,
        totalResults: 0,
      })
    }
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [searchQuery, filters.types, search])

  return {
    searchState,
    results,
    search,
    loadMore,
    clearSearch,
    filters,
    setFilters,
    buildSearchQuery,
  }
}
