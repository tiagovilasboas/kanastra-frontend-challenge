import { useQuery } from '@tanstack/react-query'

import { cache, queryKeys } from '@/config/react-query'
import { spotifyRepository } from '@/repositories'
import { SpotifyTrack } from '@/types/spotify'

import { useSpotifyAuth } from './useSpotifyAuth'

interface UseArtistTopTracksReturn {
  tracks: SpotifyTrack[]
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

export function useArtistTopTracks(
  artistId: string | undefined,
): UseArtistTopTracksReturn {
  const { isAuthenticated } = useSpotifyAuth()

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.artists.topTracks(artistId || ''),
    queryFn: async () => {
      if (!artistId) throw new Error('Artist ID is required')
      const response = await spotifyRepository.getArtistTopTracks(artistId)
      return response
    },
    enabled: !!artistId && isAuthenticated, // Only enable when user is authenticated
    staleTime: cache.stale.RARE, // Top tracks rarely change
    gcTime: cache.times.LONG, // Keep in memory for longer
    retry: cache.retry.IMPORTANT.retry,
    retryDelay: cache.retry.IMPORTANT.retryDelay,
  })

  return {
    tracks: (data as unknown as SpotifyTrack[]) || [],
    isLoading,
    error: error as Error | null,
    refetch,
  }
}
