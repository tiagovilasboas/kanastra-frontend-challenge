import { useCallback, useEffect, useRef, useState } from 'react'

import { spotifyRepository } from '@/repositories'
import { SpotifyArtist } from '@/types/spotify'
import { logger } from '@/utils/logger'

import { useSpotifyAuth } from './useSpotifyAuth'

interface UseSpotifySearchReturn {
  isLoading: boolean
  isLoadingMore: boolean
  error: string | null
  searchResults: SpotifyArtist[]
  searchArtists: (query: string) => void
  clearSearch: () => void
  searchQuery: string
  debouncedQuery: string
  hasMore: boolean
  loadMore: () => void
  totalResults: number
}

export function useSpotifySearch(): UseSpotifySearchReturn {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [results, setResults] = useState<SpotifyArtist[]>([])
  const [page, setPage] = useState(0)
  const [limit] = useState(20)
  const [hasMore, setHasMore] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [totalResults, setTotalResults] = useState(0)
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const { checkAuthError } = useSpotifyAuth()

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
      }, 500)
    } else {
      setDebouncedQuery('')
      setResults([])
      setPage(0)
      setHasMore(false)
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
        return
      }

      if (page === 0) {
        setIsLoading(true)
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
        let response
        const token = localStorage.getItem('spotify_token')
        if (token) {
          response = await spotifyRepository.searchArtists(
            debouncedQuery,
            limit,
            offset,
          )
        } else {
          await spotifyRepository.getClientToken()
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
        setHasMore(offset + newArtists.length < total)
        if (page === 0) {
          setResults(newArtists)
        } else {
          setResults((prev) => [...prev, ...newArtists])
        }

        // Reset loading state if no more results
        if (offset + newArtists.length >= total) {
          setIsLoadingMore(false)
        }
      } catch (error) {
        logger.error('Search failed', error)
        if (checkAuthError(error)) {
          setResults([])
          setHasMore(false)
          setTotalResults(0)
          return
        }
        throw error
      } finally {
        setIsLoading(false)
        setIsLoadingMore(false)
      }
    }
    fetchArtists()
    return () => {
      cancelled = true
    }
  }, [debouncedQuery, page, limit, checkAuthError, results.length])

  const searchArtists = useCallback((query: string) => {
    logger.debug('searchArtists called', { query })
    setSearchQuery(query)
  }, [])

  const clearSearch = useCallback(() => {
    logger.debug('clearSearch called')
    setSearchQuery('')
    setDebouncedQuery('')
    setResults([])
    setPage(0)
    setHasMore(false)
    setTotalResults(0)
    setIsLoadingMore(false)
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

  return {
    isLoading,
    isLoadingMore,
    error: null,
    searchResults: results,
    searchArtists,
    clearSearch,
    searchQuery,
    debouncedQuery,
    hasMore,
    loadMore,
    totalResults,
  }
}
