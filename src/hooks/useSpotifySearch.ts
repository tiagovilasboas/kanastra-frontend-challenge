import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useState } from 'react'

import {
  CACHE_TIMES,
  queryKeys,
  RETRY_CONFIGS,
  STALE_TIMES,
} from '@/config/react-query'
import { spotifyRepository } from '@/repositories'
import { SpotifyArtist } from '@/types/spotify'

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
  const queryClient = useQueryClient()

  const {
    data,
    isFetching: isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.search.byQuery(searchQuery),
    queryFn: async () => {
      if (!searchQuery.trim()) return []
      const response = await spotifyRepository.searchArtists(searchQuery)
      return response.artists.items
    },
    enabled: !!searchQuery,
    staleTime: STALE_TIMES.FREQUENT, // Search results change frequently
    gcTime: CACHE_TIMES.SHORT, // Keep in memory for short time
    retry: RETRY_CONFIGS.OPTIONAL.retry,
    retryDelay: RETRY_CONFIGS.OPTIONAL.retryDelay,
  })

  const searchArtists = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  const clearSearch = useCallback(() => {
    setSearchQuery('')
    queryClient.removeQueries({ queryKey: queryKeys.search.all })
  }, [queryClient])

  return {
    isLoading,
    error: error instanceof Error ? error.message : null,
    searchResults: (data as SpotifyArtist[]) || [],
    searchArtists,
    clearSearch,
    searchQuery,
  }
}
