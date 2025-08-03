import { useQuery } from '@tanstack/react-query'

import { cache, queryKeys } from '@/config/react-query'
import { spotifyRepository } from '@/repositories'
import { SpotifyAlbum } from '@/schemas/spotify'

import { useSpotifyAuth } from './useSpotifyAuth'

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
  const { hasValidToken } = useSpotifyAuth()
  const offset = (page - 1) * limit

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.artists.albums(artistId || '', page, limit),
    queryFn: async () => {
      if (!artistId) throw new Error('Artist ID is required')

      // Get albums for current page
      const albums = await spotifyRepository.getArtistAlbums(
        artistId,
        ['album', 'single'],
        limit,
        offset,
      )

      // For now, just show the albums we have
      // Pagination will be handled by showing/hiding based on current page
      return {
        albums,
        total: albums.length,
        totalPages: 1, // Start with single page until we implement proper pagination
      }
    },
    enabled: !!artistId && hasValidToken(), // Only enable when we have a valid token
    staleTime: cache.stale.OCCASIONAL, // Albums change occasionally
    gcTime: cache.times.MEDIUM, // Keep in memory for medium time
    retry: cache.retry.IMPORTANT.retry,
    retryDelay: cache.retry.IMPORTANT.retryDelay,
  })

  return {
    albums: (data?.albums as unknown as SpotifyAlbum[]) || [],
    totalPages: data?.totalPages || 0,
    totalItems: data?.total || 0,
    isLoading,
    error: error as Error | null,
    refetch,
  }
}
