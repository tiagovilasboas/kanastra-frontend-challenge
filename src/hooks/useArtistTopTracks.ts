import { useQuery } from '@tanstack/react-query'

import {
  CACHE_TIMES,
  queryKeys,
  RETRY_CONFIGS,
  STALE_TIMES,
} from '@/config/react-query'
import { spotifyRepository } from '@/repositories'
import { SpotifyTrack } from '@/types/spotify'

interface UseArtistTopTracksReturn {
  tracks: SpotifyTrack[]
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

export function useArtistTopTracks(
  artistId: string | undefined,
): UseArtistTopTracksReturn {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.artists.topTracks(artistId || ''),
    queryFn: async () => {
      if (!artistId) throw new Error('Artist ID is required')
      const response = await spotifyRepository.getArtistTopTracks(artistId)
      return response.tracks
    },
    enabled: !!artistId,
    staleTime: STALE_TIMES.RARE, // Top tracks rarely change
    gcTime: CACHE_TIMES.LONG, // Keep in memory for longer
    retry: RETRY_CONFIGS.IMPORTANT.retry,
    retryDelay: RETRY_CONFIGS.IMPORTANT.retryDelay,
  })

  return {
    tracks: data || [],
    isLoading,
    error: error as Error | null,
    refetch,
  }
}
