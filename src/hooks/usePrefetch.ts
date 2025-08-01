import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

import { cache, queryKeys } from '@/config/react-query'
import { spotifyRepository } from '@/repositories'

interface PrefetchOptions {
  enabled?: boolean
}

export function usePrefetch() {
  const queryClient = useQueryClient()

  // Prefetch artist details and related data
  const prefetchArtistData = useCallback(
    async (artistId: string, options: PrefetchOptions = {}) => {
      const { enabled = true } = options
      if (!enabled) return

      try {
        // Prefetch artist details
        await queryClient.prefetchQuery({
          queryKey: queryKeys.artists.details(artistId),
          queryFn: () => spotifyRepository.getArtist(artistId),
          staleTime: cache.stale.OCCASIONAL,
          gcTime: cache.times.MEDIUM,
        })

        // Prefetch top tracks
        await queryClient.prefetchQuery({
          queryKey: queryKeys.artists.topTracks(artistId),
          queryFn: () => spotifyRepository.getArtistTopTracks(artistId),
          staleTime: cache.stale.RARE,
          gcTime: cache.times.LONG,
        })

        // Prefetch first page of albums
        await queryClient.prefetchQuery({
          queryKey: queryKeys.artists.albums(artistId, 1, 20),
          queryFn: () =>
            spotifyRepository.getArtistAlbums(artistId, {
              limit: 20,
              offset: 0,
            }),
          staleTime: cache.stale.OCCASIONAL,
          gcTime: cache.times.MEDIUM,
        })
      } catch (error) {
        // Silently fail prefetch - it's not critical
        console.debug('Prefetch failed:', error)
      }
    },
    [queryClient],
  )

  return {
    prefetchArtistData,
  }
}
