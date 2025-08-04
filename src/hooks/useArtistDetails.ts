import { useQuery } from '@tanstack/react-query'

import { cache, queryKeys } from '@/config/react-query'
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
      return await spotifyRepository.getArtistDetails(artistId)
    },
    enabled: !!artistId, // Enable when we have an artist ID
    staleTime: cache.stale.OCCASIONAL, // Artist details change occasionally
    gcTime: cache.times.MEDIUM, // Keep in memory for medium time
    retry: cache.retry.IMPORTANT.retry,
    retryDelay: cache.retry.IMPORTANT.retryDelay,
  })

  return {
    artist: artist || null,
    isLoading,
    error: error as Error | null,
    refetch,
  }
}
