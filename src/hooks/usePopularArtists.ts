import { useQuery } from '@tanstack/react-query'

import { cache, queryKeys } from '@/config/react-query'
import { POPULAR_ARTIST_IDS } from '@/constants/artists'
import { API_LIMITS } from '@/constants/limits'
import { spotifyRepository } from '@/repositories'
import { SpotifyArtist } from '@/schemas/spotify'
import { logger } from '@/utils/logger'

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
  limit = API_LIMITS.CONTENT.POPULAR_ARTISTS,
  enabled = true,
}: UsePopularArtistsParams = {}): UsePopularArtistsReturn {
  const { checkAuthError } = useSpotifyAuth()

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.artists.popular(limit),
    queryFn: async () => {
      // Buscar detalhes de artistas populares conhecidos
      const artistIdsToFetch = POPULAR_ARTIST_IDS.slice(0, limit)

      // 🚀 OTIMIZAÇÃO: Fazer requests em paralelo com Promise.allSettled
      const artistPromises = artistIdsToFetch.map(async (artistId) => {
        try {
          const artist = await spotifyRepository.getArtistDetails(artistId)
          return artist && artist.popularity && artist.popularity > 30
            ? artist
            : null
        } catch (error) {
          logger.warn(`Failed to fetch artist details`, { artistId, error })

          // Check if it's an auth error
          if (checkAuthError(error)) {
            throw error // Propagar erro de autenticação
          }

          return null // Continuar com outros artistas
        }
      })

      // Aguardar todas as requests em paralelo
      const results = await Promise.allSettled(artistPromises)

      // Filtrar apenas resultados válidos
      const artists = results
        .filter(
          (result): result is PromiseFulfilledResult<SpotifyArtist> =>
            result.status === 'fulfilled' && result.value !== null,
        )
        .map((result) => result.value)

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
