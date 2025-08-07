import { useQuery } from '@tanstack/react-query'

import { cache, queryKeys } from '@/config/react-query'
import { POPULAR_ARTIST_IDS } from '@/constants/artists'
import { spotifyRepository } from '@/repositories'
import { SpotifyArtist } from '@/schemas/spotify'

import { useSpotifyAuth } from './useSpotifyAuth'

interface UsePopularArtistsParams {
  limit?: number
  enabled?: boolean
}

interface UsePopularArtistsReturn {
  artists: SpotifyArtist[]
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

export function usePopularArtists({
  limit = 6,
  enabled = true,
}: UsePopularArtistsParams = {}): UsePopularArtistsReturn {
  const { checkAuthError } = useSpotifyAuth()

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.artists.popular(limit),
    queryFn: async () => {
      const artists: SpotifyArtist[] = []

      // Buscar detalhes de artistas populares conhecidos
      const artistIdsToFetch = POPULAR_ARTIST_IDS.slice(0, limit)

      for (const artistId of artistIdsToFetch) {
        try {
          const artist = await spotifyRepository.getArtistDetails(artistId)
          if (artist && artist.popularity && artist.popularity > 30) {
            artists.push(artist)
          }
        } catch (error) {
          console.warn(`Failed to fetch artist ${artistId}:`, error)

          // Check if it's an auth error and handle it gracefully
          if (checkAuthError(error)) {
            // Return empty array on auth error
            return []
          }

          // Continuar com outros artistas mesmo se um falhar
        }
      }

      // Ordenar por popularidade (mais alta primeiro)
      const sortedArtists = artists
        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
        .slice(0, limit)

      return sortedArtists
    },
    enabled: enabled,
    staleTime: cache.stale.OCCASIONAL, // Popular artists change occasionally
    gcTime: cache.times.MEDIUM, // Keep in memory for medium time
    retry: cache.retry.IMPORTANT.retry,
    retryDelay: cache.retry.IMPORTANT.retryDelay,
  })

  return {
    artists: (data as SpotifyArtist[]) || [],
    isLoading,
    error: error as Error | null,
    refetch,
  }
}
