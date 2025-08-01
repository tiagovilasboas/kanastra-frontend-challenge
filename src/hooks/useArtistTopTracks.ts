import { useQuery } from '@tanstack/react-query'

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
    queryKey: ['artistTopTracks', artistId],
    queryFn: async () => {
      if (!artistId) throw new Error('Artist ID is required')
      const response = await spotifyRepository.getArtistTopTracks(artistId)
      return response.tracks
    },
    enabled: !!artistId,
    retry: 2,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })

  return {
    tracks: data || [],
    isLoading,
    error: error as Error | null,
    refetch,
  }
}
