import { useQuery } from '@tanstack/react-query'

import {
  CACHE_TIMES,
  queryKeys,
  RETRY_CONFIGS,
  STALE_TIMES,
} from '@/config/react-query'
import { spotifyRepository } from '@/repositories'
import { SpotifyAlbum } from '@/types/spotify'

interface UseArtistAlbumsParams {
  artistId: string | undefined
  page: number
  limit?: number
}

interface UseArtistAlbumsReturn {
  albums: SpotifyAlbum[]
  totalPages: number
  totalItems: number
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

export function useArtistAlbums({
  artistId,
  page,
  limit = 20,
}: UseArtistAlbumsParams): UseArtistAlbumsReturn {
  const offset = (page - 1) * limit

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.artists.albums(artistId || '', page, limit),
    queryFn: async () => {
      if (!artistId) throw new Error('Artist ID is required')
      const response = await spotifyRepository.getArtistAlbums(artistId, {
        limit,
        offset,
      })
      return {
        albums: response.items,
        total: response.total,
        totalPages: Math.ceil(response.total / limit),
      }
    },
    enabled: !!artistId,
    staleTime: STALE_TIMES.OCCASIONAL, // Albums change occasionally
    gcTime: CACHE_TIMES.MEDIUM, // Keep in memory for medium time
    retry: RETRY_CONFIGS.IMPORTANT.retry,
    retryDelay: RETRY_CONFIGS.IMPORTANT.retryDelay,
  })

  return {
    albums: data?.albums || [],
    totalPages: data?.totalPages || 0,
    totalItems: data?.total || 0,
    isLoading,
    error: error as Error | null,
    refetch,
  }
}
