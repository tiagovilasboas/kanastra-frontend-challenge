import { useQuery } from '@tanstack/react-query'

import { cache, queryKeys } from '@/config/react-query'
import { spotifyRepository } from '@/repositories'
import { SpotifyAlbum } from '@/schemas/spotify'

interface UseArtistAlbumsParams {
  artistId: string | undefined
  page: number
  limit?: number
}

interface UseArtistAlbumsReturn {
  albums: SpotifyAlbum[]
  totalPages: number
  totalItems: number
  hasNextPage: boolean
  hasPreviousPage: boolean
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

      // Get albums for current page with pagination info
      const response = await spotifyRepository.getArtistAlbums(
        artistId,
        ['album', 'single'],
        limit,
        offset,
      )

      // The response should include pagination info, but we need to get it from the service
      // For now, we'll calculate pagination based on the response
      const totalItems = response.length >= limit ? limit * 2 : response.length // Estimate total
      const totalPages = Math.ceil(totalItems / limit)

      // Sort albums by release date (newest first)
      const sortedAlbums = response.sort((a, b) => {
        const dateA = new Date(a.release_date)
        const dateB = new Date(b.release_date)
        return dateB.getTime() - dateA.getTime() // Descending order (newest first)
      })

      return {
        albums: sortedAlbums,
        total: totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      }
    },
    enabled: !!artistId, // Enable when we have an artist ID
    staleTime: cache.stale.OCCASIONAL, // Albums change occasionally
    gcTime: cache.times.MEDIUM, // Keep in memory for medium time
    retry: cache.retry.IMPORTANT.retry,
    retryDelay: cache.retry.IMPORTANT.retryDelay,
  })

  return {
    albums: (data?.albums as unknown as SpotifyAlbum[]) || [],
    totalPages: data?.totalPages || 0,
    totalItems: data?.total || 0,
    hasNextPage: data?.hasNextPage || false,
    hasPreviousPage: data?.hasPreviousPage || false,
    isLoading,
    error: error as Error | null,
    refetch,
  }
}
