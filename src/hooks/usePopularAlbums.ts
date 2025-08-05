import { useCallback, useEffect, useState } from 'react'

import { spotifyRepository } from '@/repositories'
import { SpotifyAlbum } from '@/types/spotify'
import { logger } from '@/utils/logger'

interface UsePopularAlbumsParams {
  limit?: number
}

interface UsePopularAlbumsReturn {
  albums: SpotifyAlbum[]
  isLoading: boolean
  error: string | null
}

export function usePopularAlbums({
  limit = 20,
}: UsePopularAlbumsParams = {}): UsePopularAlbumsReturn {
  const [albums, setAlbums] = useState<SpotifyAlbum[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPopularAlbums = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // For now, we'll search for popular albums using a generic search
      // In a real implementation, you might want to use a different endpoint
      const response = await spotifyRepository.searchAdvanced(
        'year:2020-2024',
        'album',
        undefined,
        limit,
        0,
      )

      if (response.albums?.items) {
        setAlbums(response.albums.items)
      }

      logger.debug('Popular albums fetched successfully', {
        count: response.albums?.items?.length || 0,
      })
    } catch (err) {
      logger.error('Failed to fetch popular albums', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch albums')
    } finally {
      setIsLoading(false)
    }
  }, [limit])

  useEffect(() => {
    fetchPopularAlbums()
  }, [fetchPopularAlbums])

  return {
    albums,
    isLoading,
    error,
  }
}
