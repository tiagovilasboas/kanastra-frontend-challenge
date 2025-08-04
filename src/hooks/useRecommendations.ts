import { useQuery } from '@tanstack/react-query'

import { cache } from '@/config/cache'
import { queryKeys } from '@/config/react-query'
import { spotifyRepository } from '@/repositories'
import { RecommendationParams } from '@/repositories/spotify/SpotifySearchService'
import { SpotifyTrack } from '@/types/spotify'

interface UseRecommendationsParams {
  params: RecommendationParams
  enabled?: boolean
}

interface UseRecommendationsReturn {
  recommendations: SpotifyTrack[]
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

export function useRecommendations({
  params,
  enabled = true,
}: UseRecommendationsParams): UseRecommendationsReturn {
  const {
    data: recommendations,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.recommendations.byParams(params),
    queryFn: async () => {
      return await spotifyRepository.getRecommendations(params)
    },
    enabled: enabled && (!!params.seed_artists?.length || !!params.seed_genres?.length || !!params.seed_tracks?.length),
    staleTime: cache.stale.OCCASIONAL,
    gcTime: cache.times.MEDIUM,
  })

  return {
    recommendations: recommendations || [],
    isLoading,
    error: error as Error | null,
    refetch,
  }
} 