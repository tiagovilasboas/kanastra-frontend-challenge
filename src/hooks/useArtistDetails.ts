import { useQuery } from '@tanstack/react-query'

import {
  CACHE_TIMES,
  queryKeys,
  RETRY_CONFIGS,
  STALE_TIMES,
} from '@/config/react-query'
import { spotifyRepository } from '@/repositories'
import { SpotifyArtist } from '@/types/spotify'

interface UseArtistDetailsReturn {
  artist: SpotifyArtist | null
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

export function useArtistDetails(
  artistId: string | undefined,
): UseArtistDetailsReturn {
  const {
    data: artist,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.artists.details(artistId || ''),
    queryFn: async () => {
      if (!artistId) throw new Error('Artist ID is required')
      return await spotifyRepository.getArtist(artistId)
    },
    enabled: !!artistId,
    staleTime: STALE_TIMES.OCCASIONAL, // Artist details change occasionally
    gcTime: CACHE_TIMES.MEDIUM, // Keep in memory for medium time
    retry: RETRY_CONFIGS.IMPORTANT.retry,
    retryDelay: RETRY_CONFIGS.IMPORTANT.retryDelay,
  })

  return {
    artist: artist || null,
    isLoading,
    error: error as Error | null,
    refetch,
  }
}
