import { useQuery } from '@tanstack/react-query'

import { cache, queryKeys } from '@/config/react-query'
import { spotifyRepository } from '@/repositories'
import { SpotifyArtist } from '@/schemas/spotify'

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

// Termos populares para buscar artistas em alta
const POPULAR_SEARCH_TERMS = [
  'pop',
  'rock',
  'hip hop',
  'rap',
  'electronic',
  'r&b',
  'country',
  'latin',
  'k-pop',
  'indie'
]

export function usePopularArtists({
  limit = 12,
  enabled = true,
}: UsePopularArtistsParams = {}): UsePopularArtistsReturn {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.artists.popular(limit),
    queryFn: async () => {
      // Buscar artistas usando termos populares
      const allArtists: SpotifyArtist[] = []
      
      // Buscar por cada termo popular
      for (const term of POPULAR_SEARCH_TERMS.slice(0, 5)) { // Limitar a 5 termos para performance
        try {
          const response = await spotifyRepository.searchArtistsPublic(term)
          if (response.artists?.items) {
            allArtists.push(...response.artists.items)
          }
        } catch (error) {
          console.warn(`Failed to search for term "${term}":`, error)
          // Continuar com outros termos mesmo se um falhar
        }
      }

      // Remover duplicatas baseado no ID
      const uniqueArtists = allArtists.filter((artist, index, self) => 
        index === self.findIndex(a => a.id === artist.id)
      )

      // Ordenar por popularidade (mais alta primeiro) e pegar os top N
      const sortedArtists = uniqueArtists
        .filter(artist => artist.popularity && artist.popularity > 50) // Filtrar apenas artistas populares
        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
        .slice(0, limit)

      return sortedArtists
    },
    enabled,
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