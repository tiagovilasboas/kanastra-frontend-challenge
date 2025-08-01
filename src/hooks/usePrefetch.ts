import { useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@/config/react-query'
import { spotifyRepository } from '@/repositories'

export function usePrefetch() {
  const queryClient = useQueryClient()

  const prefetchArtistData = async (artistId: string) => {
    // Prefetch artist details
    await queryClient.prefetchQuery({
      queryKey: queryKeys.artists.details(artistId),
      queryFn: () => spotifyRepository.getArtistDetails(artistId),
      staleTime: 5 * 60 * 1000, // 5 minutes
    })

    // Prefetch top tracks
    await queryClient.prefetchQuery({
      queryKey: queryKeys.artists.topTracks(artistId),
      queryFn: () => spotifyRepository.getArtistTopTracks(artistId),
      staleTime: 10 * 60 * 1000, // 10 minutes
    })

    // Prefetch first page of albums
    await queryClient.prefetchQuery({
      queryKey: queryKeys.artists.albums(artistId, 1, 20),
      queryFn: () => spotifyRepository.getArtistAlbums(artistId, ['album', 'single'], 20, 0),
      staleTime: 5 * 60 * 1000, // 5 minutes
    })
  }

  const prefetchSearchResults = async (query: string) => {
    if (!query.trim()) return

    await queryClient.prefetchQuery({
      queryKey: queryKeys.search.byQuery(query),
      queryFn: async () => {
        try {
          // Try authenticated search first
          const token = localStorage.getItem('spotify_token')
          if (token) {
            return await spotifyRepository.searchArtists(query)
          }
          // Fallback to public search
          return await spotifyRepository.searchArtistsPublic(query)
                 } catch {
           // If public search fails, try to get client token and retry
           await spotifyRepository.getClientToken()
           return await spotifyRepository.searchArtistsPublic(query)
         }
      },
      staleTime: 2 * 60 * 1000, // 2 minutes
    })
  }

  const invalidateArtistData = (artistId: string) => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.artists.details(artistId),
    })
    queryClient.invalidateQueries({
      queryKey: queryKeys.artists.topTracks(artistId),
    })
    queryClient.invalidateQueries({
      queryKey: queryKeys.artists.albums(artistId, 1, 20),
    })
  }

  const invalidateSearchData = () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.search.all,
    })
  }

  const clearArtistCache = (artistId: string) => {
    queryClient.removeQueries({
      queryKey: queryKeys.artists.details(artistId),
    })
    queryClient.removeQueries({
      queryKey: queryKeys.artists.topTracks(artistId),
    })
    queryClient.removeQueries({
      queryKey: queryKeys.artists.albums(artistId, 1, 20),
    })
  }

  const clearSearchCache = () => {
    queryClient.removeQueries({
      queryKey: queryKeys.search.all,
    })
  }

  return {
    prefetchArtistData,
    prefetchSearchResults,
    invalidateArtistData,
    invalidateSearchData,
    clearArtistCache,
    clearSearchCache,
  }
}
