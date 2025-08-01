import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useRef, useState } from 'react'

import { cache, queryKeys } from '@/config/react-query'
import { spotifyRepository } from '@/repositories'
import { SpotifyArtist } from '@/types/spotify'
import { logger } from '@/utils/logger'

interface UseSpotifySearchReturn {
  isLoading: boolean
  error: string | null
  searchResults: SpotifyArtist[]
  searchArtists: (query: string) => void
  clearSearch: () => void
  searchQuery: string
}

export function useSpotifySearch(): UseSpotifySearchReturn {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const queryClient = useQueryClient()
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // Debounce effect - similar to betalent-desafio-frontend
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (searchQuery.trim()) {
      debounceRef.current = setTimeout(() => {
        logger.debug('Debounced search triggered', { searchQuery })
        setDebouncedQuery(searchQuery)
      }, 300) // 300ms debounce delay
    } else {
      setDebouncedQuery('')
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [searchQuery])

  const {
    data,
    isFetching: isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.search.byQuery(debouncedQuery),
    queryFn: async () => {
      logger.debug('useSpotifySearch queryFn called', { debouncedQuery })

      if (!debouncedQuery.trim()) {
        logger.debug('Empty debounced query, returning empty array')
        return []
      }

      try {
        // Try authenticated search first if user is logged in
        const token = localStorage.getItem('spotify_token')
        if (token) {
          logger.debug('Attempting authenticated search')
          const response = await spotifyRepository.searchArtists(debouncedQuery)
          logger.debug('Authenticated search successful', {
            itemsCount: response.artists.items.length,
          })
          return response.artists.items
        }

        // Fallback to public search
        logger.debug('Attempting public search')
        const response = await spotifyRepository.searchArtistsPublic(debouncedQuery)
        logger.debug('Public search successful', {
          itemsCount: response.artists.items.length,
        })
        return response.artists.items
      } catch (error) {
        logger.error('Search failed', error)
        
        // If public search fails, try to get client token and retry
        try {
          logger.debug('Attempting to get client token and retry')
          await spotifyRepository.getClientToken()
          const response = await spotifyRepository.searchArtistsPublic(debouncedQuery)
          logger.debug('Retry search successful', {
            itemsCount: response.artists.items.length,
          })
          return response.artists.items
        } catch (retryError) {
          logger.error('Retry search also failed', retryError)
          throw retryError
        }
      }
    },
    enabled: !!debouncedQuery,
    staleTime: cache.stale.FREQUENT,
    gcTime: cache.times.SHORT,
    retry: cache.retry.OPTIONAL.retry,
    retryDelay: cache.retry.OPTIONAL.retryDelay,
  })

  const searchArtists = useCallback((query: string) => {
    logger.debug('searchArtists called', { query })
    setSearchQuery(query)
  }, [])

  const clearSearch = useCallback(() => {
    logger.debug('clearSearch called')
    setSearchQuery('')
    setDebouncedQuery('')
    queryClient.removeQueries({ queryKey: queryKeys.search.all })
  }, [queryClient])

  logger.debug('useSpotifySearch render', {
    searchQuery,
    debouncedQuery,
    isLoading,
    error: error?.message,
    dataLength: data?.length || 0,
  })

  return {
    isLoading,
    error: error instanceof Error ? error.message : null,
    searchResults: (data as SpotifyArtist[]) || [],
    searchArtists,
    clearSearch,
    searchQuery,
  }
}
