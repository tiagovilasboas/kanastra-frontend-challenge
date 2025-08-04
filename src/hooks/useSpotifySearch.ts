import { useCallback, useEffect, useRef, useState } from 'react'

import { spotifyRepository } from '@/repositories'
import { useSearchStore } from '@/stores/searchStore'
import { SpotifyArtist } from '@/types/spotify'
import { logger } from '@/utils/logger'

interface UseSpotifySearchReturn {
  isLoading: boolean
  isLoadingMore: boolean
  error: string | null
  searchResults: SpotifyArtist[]
  artists: SpotifyArtist[]
  genres: string[]
  clearSearch: () => void
  hasMore: boolean
  loadMore: () => void
  totalResults: number
}

// Helper function to extract unique genres from artists
const extractGenresFromArtists = (artists: SpotifyArtist[]): string[] => {
  const allGenres = artists.flatMap((artist) => artist.genres || [])
  const uniqueGenres = [...new Set(allGenres)]
  return uniqueGenres.sort()
}

// Helper function to separate artists and genres
const separateResults = (artists: SpotifyArtist[], query: string) => {
  const queryLower = query.toLowerCase()

  // Extract all genres from artists
  const allGenres = extractGenresFromArtists(artists)

  // Filter genres that match the query
  const matchingGenres = allGenres.filter((genre) =>
    genre.toLowerCase().includes(queryLower),
  )

  // For now, return all artists as regular artists and matching genres
  // This ensures we always show results
  return {
    artists: artists, // Show all artists
    genres: matchingGenres,
    genreArtists: [],
  }
}

export function useSpotifySearch(): UseSpotifySearchReturn {
  const { searchQuery } = useSearchStore()
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [results, setResults] = useState<SpotifyArtist[]>([])
  const [page, setPage] = useState(0)
  const [limit] = useState(20)
  const [hasMore, setHasMore] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [totalResults, setTotalResults] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined)

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
      setResults([])
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

  // Fetch results when debouncedQuery or page changes
  useEffect(() => {
    let cancelled = false
    async function fetchArtists() {
      if (!debouncedQuery.trim()) {
        setResults([])
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
      logger.debug('Fetching artists', {
        query: debouncedQuery,
        page,
        limit,
        offset,
        currentResults: results.length,
      })

      try {
        const token = localStorage.getItem('spotify_token')
        let response

        logger.debug('Search attempt', {
          hasUserToken: !!token,
          query: debouncedQuery,
          page,
          limit,
          offset,
        })

        if (token) {
          logger.debug('Using user token for search')
          response = await spotifyRepository.searchArtists(
            debouncedQuery,
            limit,
            offset,
          )
        } else {
          logger.debug('No user token, getting client token')
          try {
            await spotifyRepository.getClientToken()
            logger.debug('Client token obtained successfully')
          } catch (tokenError) {
            logger.error('Failed to get client token', tokenError)
            throw tokenError
          }

          logger.debug('Using client token for search')
          response = await spotifyRepository.searchArtistsPublic(
            debouncedQuery,
            limit,
            offset,
          )
        }

        if (cancelled) return

        const newArtists = response.artists.items
        const total = response.artists.total

        logger.debug('Artists fetched successfully', {
          query: debouncedQuery,
          page,
          offset,
          newArtistsCount: newArtists.length,
          totalResults: total,
          hasMore: offset + newArtists.length < total,
          firstArtist: newArtists[0]?.name,
          lastArtist: newArtists[newArtists.length - 1]?.name,
        })

        setTotalResults(total)
        const newHasMore = offset + newArtists.length < total
        setHasMore(newHasMore)

        logger.debug('Pagination info', {
          offset,
          newArtistsLength: newArtists.length,
          total,
          newHasMore,
          currentPage: page,
        })
        setError(null)

        if (page === 0) {
          setResults(newArtists)
        } else {
          setResults((prev) => {
            // Remove duplicates based on artist ID
            const existingIds = new Set(prev.map((artist) => artist.id))
            const uniqueNewArtists = newArtists.filter(
              (artist) => !existingIds.has(artist.id),
            )
            return [...prev, ...uniqueNewArtists]
          })
        }

        // Reset loading state if no more results
        if (offset + newArtists.length >= total) {
          setIsLoadingMore(false)
        }
      } catch (error) {
        logger.error('Search failed', error)

        if (cancelled) return

        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error occurred'
        setError(errorMessage)

        // Clear results on error
        if (page === 0) {
          setResults([])
          setTotalResults(0)
          setHasMore(false)
        }
      } finally {
        setIsLoading(false)
        setIsLoadingMore(false)
      }
    }
    fetchArtists()
    return () => {
      cancelled = true
    }
  }, [debouncedQuery, page, limit, results.length])

  const clearSearch = useCallback(() => {
    logger.debug('clearSearch called')
    setResults([])
    setPage(0)
    setHasMore(false)
    setTotalResults(0)
    setIsLoadingMore(false)
    setError(null)
  }, [])

  const loadMore = useCallback(() => {
    if (!hasMore || isLoadingMore) return
    logger.debug('Loading more artists', {
      currentPage: page,
      currentResults: results.length,
      totalResults,
      hasMore,
    })
    setIsLoadingMore(true)
    setPage((prev) => prev + 1)
  }, [hasMore, isLoadingMore, page, results.length, totalResults])

  // Separate results into artists and genres
  const { artists, genres } = separateResults(results, debouncedQuery)

  // Debug logs
  logger.debug('Search results separated', {
    totalResults: results.length,
    artistsCount: artists.length,
    genresCount: genres.length,
    hasMore,
    query: debouncedQuery,
  })

  return {
    isLoading,
    isLoadingMore,
    error,
    searchResults: results,
    artists,
    genres,
    clearSearch,
    hasMore,
    loadMore,
    totalResults,
  }
}
