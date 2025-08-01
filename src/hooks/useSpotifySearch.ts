import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useState } from 'react'

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
    queryKey: ['searchArtists', searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return []
      const response = await spotifyRepository.searchArtists(searchQuery)
      return response.artists.items
    },
    enabled: !!searchQuery,
    retry: 1,
  })

  const searchArtists = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  const clearSearch = useCallback(() => {
    setSearchQuery('')
    queryClient.removeQueries({ queryKey: ['searchArtists'] })
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
