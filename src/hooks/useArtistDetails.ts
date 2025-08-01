import { useQuery } from '@tanstack/react-query'

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
    queryKey: ['artist', artistId],
    queryFn: async () => {
      if (!artistId) throw new Error('Artist ID is required')
      return await spotifyRepository.getArtist(artistId)
    },
    enabled: !!artistId,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  return {
    artist: artist || null,
    isLoading,
    error: error as Error | null,
    refetch,
  }
}
