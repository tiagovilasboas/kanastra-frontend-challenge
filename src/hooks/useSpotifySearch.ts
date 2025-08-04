import { useCallback, useEffect, useRef, useState } from 'react'

import { spotifyRepository } from '@/repositories'
import { useSearchStore } from '@/stores/searchStore'
import { SearchFilters } from '@/types/search'
import { SpotifyArtist } from '@/types/spotify'
import { logger } from '@/utils/logger'

// Types
interface UseSpotifySearchReturn {
  isLoading: boolean
  isLoadingMore: boolean
  error: string | null
  artists: SpotifyArtist[]
  clearSearch: () => void
  hasMore: boolean
  loadMore: () => void
  totalResults: number
  // Advanced search
  filters: SearchFilters
  setFilters: (filters: SearchFilters) => void
  buildSearchQuery: (baseQuery: string) => string
}

export function useSpotifySearch(): UseSpotifySearchReturn {
  const { searchQuery } = useSearchStore()
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [artists, setArtists] = useState<SpotifyArtist[]>([])
  const [page, setPage] = useState(0)
  const [limit] = useState(20)
  const [hasMore, setHasMore] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [totalResults, setTotalResults] = useState(0)
  const [error, setError] = useState<string | null>(null)
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

  // Custom hook for search API calls
  const searchArtists = useCallback(
    async (query: string, limit: number, offset: number) => {
      try {
        // Ensure we have a token
        if (
          !spotifyRepository.isAuthenticated() &&
          !spotifyRepository.getAuthStatus().hasClientToken
        ) {
          await spotifyRepository.getClientToken()
        }

        // Build the search query with filters
        const advancedQuery = buildSearchQuery(query)

        return await spotifyRepository.searchAdvanced(
          advancedQuery,
          'artist',
          undefined,
          limit,
          offset,
        )
      } catch (error) {
        logger.error('Search API error', error)
        throw error
      }
    },
    [buildSearchQuery],
  )

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
        setError(null)
      }, 500)
    } else {
      setDebouncedQuery('')
      setArtists([])
      setPage(0)
      setHasMore(false)
      setError(null)
    }
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [searchQuery])

  // Fetch results when debouncedQuery, page, or filters change
  useEffect(() => {
    let cancelled = false
    async function fetchResults() {
      if (!debouncedQuery.trim()) {
        setArtists([])
        setHasMore(false)
        setIsLoading(false)
        setTotalResults(0)
        setError(null)
        return
      }

      if (page === 0) {
        setIsLoading(true)
        setError(null)
      }

      const offset = page * limit
      logger.debug('Fetching artist search results with filters', {
        query: debouncedQuery,
        page,
        limit,
        offset,
        filters,
      })

      try {
        const artistsResponse = await searchArtists(
          debouncedQuery,
          limit,
          offset,
        )

        if (cancelled) return

        const newArtists = artistsResponse?.artists || []

        // Update state based on page
        if (page === 0) {
          setArtists(newArtists)
        } else {
          setArtists((prev) => {
            const existingIds = new Set(prev.map((artist) => artist.id))
            const uniqueNewArtists = newArtists.filter(
              (artist: SpotifyArtist) => !existingIds.has(artist.id),
            )
            return [...prev, ...uniqueNewArtists]
          })
        }

        // Calculate total results and hasMore
        const totalArtists = artistsResponse?.total || 0
        setTotalResults(totalArtists)

        const hasMoreArtists =
          artistsResponse?.offset + artistsResponse?.limit < totalArtists
        setHasMore(hasMoreArtists)

        setIsLoading(false)
        setIsLoadingMore(false)
        setError(null)

        logger.debug('Artist search results updated', {
          newArtists: newArtists.length,
          totalArtists,
          hasMore: hasMoreArtists,
        })
      } catch (err) {
        if (cancelled) return

        // Handle specific authentication errors
        let errorMessage = 'Search failed'
        if (err instanceof Error) {
          if (err.message.includes('Spotify credentials not configured')) {
            errorMessage =
              'Spotify API não configurada. Configure as credenciais no arquivo .env'
          } else if (
            err.message.includes('401') ||
            err.message.includes('Authentication')
          ) {
            errorMessage = 'Erro de autenticação. Tente fazer login novamente.'
          } else {
            errorMessage = err.message
          }
        }

        logger.error('Search error', err)
        setError(errorMessage)
        setIsLoading(false)
        setIsLoadingMore(false)
      }
    }

    fetchResults()

    return () => {
      cancelled = true
    }
  }, [debouncedQuery, page, limit, filters, searchArtists])

  const clearSearch = useCallback(() => {
    setDebouncedQuery('')
    setArtists([])
    setPage(0)
    setHasMore(false)
    setError(null)
    setTotalResults(0)
  }, [])

  const loadMore = useCallback(() => {
    if (!hasMore || isLoadingMore) return
    setPage((prev) => prev + 1)
    setIsLoadingMore(true)
  }, [hasMore, isLoadingMore])

  return {
    isLoading,
    isLoadingMore,
    error,
    artists: Array.isArray(artists) ? artists : [],
    clearSearch,
    hasMore,
    loadMore,
    totalResults,
    // Advanced search
    filters,
    setFilters,
    buildSearchQuery,
  }
}
