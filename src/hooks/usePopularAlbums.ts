import { useQuery } from '@tanstack/react-query'

import { spotifyRepository } from '@/repositories'
import { SpotifyAlbum } from '@/types/spotify'
// Removed unused logger import

interface UsePopularAlbumsParams {
  limit?: number
}

interface UsePopularAlbumsReturn {
  albums: SpotifyAlbum[]
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

export function usePopularAlbums({
  limit = 20,
}: UsePopularAlbumsParams = {}): UsePopularAlbumsReturn {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['popular-albums', limit],
    queryFn: async () => {
      // Removed debug logs for cleaner production code

      // For now, we'll search for popular albums using a generic search
      // In a real implementation, you might want to use a different endpoint
      const response = await spotifyRepository.searchAdvanced(
        'year:2020-2024',
        'album',
        undefined,
        limit,
        0,
      )

      const albums = response.albums?.items || []

              // Removed debug logs for cleaner production code

      return albums
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })

  return {
    albums: data || [],
    isLoading,
    error: error as Error | null,
    refetch,
  }
}
