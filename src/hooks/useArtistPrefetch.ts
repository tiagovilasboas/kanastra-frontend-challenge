import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

import { cache, queryKeys } from '@/config/react-query'
import { spotifyRepository } from '@/repositories'

interface UseArtistPrefetchReturn {
  prefetchArtistOnHover: (artistId: string) => void
  prefetchArtistOnFocus: (artistId: string) => void
  prefetchArtistData: (artistId: string) => void
}

export function useArtistPrefetch(): UseArtistPrefetchReturn {
  const queryClient = useQueryClient()

  const prefetchArtistData = useCallback(async (artistId: string) => {
    // Prefetch artist details
    await queryClient.prefetchQuery({
      queryKey: queryKeys.artists.details(artistId),
      queryFn: async () => {
        return await spotifyRepository.getArtistDetails(artistId)
      },
      staleTime: cache.stale.OCCASIONAL,
      gcTime: cache.times.MEDIUM,
    })

    // Prefetch top tracks
    await queryClient.prefetchQuery({
      queryKey: queryKeys.artists.topTracks(artistId),
      queryFn: async () => {
        return await spotifyRepository.getArtistTopTracks(artistId)
      },
      staleTime: cache.stale.RARE,
      gcTime: cache.times.LONG,
    })

    // Prefetch first page of albums
    await queryClient.prefetchQuery({
      queryKey: queryKeys.artists.albums(artistId, 1, 20),
      queryFn: async () => {
        const response = await spotifyRepository.getArtistAlbums(artistId, ['album', 'single'], 20, 0)
        return {
          albums: response,
          total: response.length,
          totalPages: Math.ceil(response.length / 20),
        }
      },
      staleTime: cache.stale.OCCASIONAL,
      gcTime: cache.times.MEDIUM,
    })
  }, [queryClient])

  const prefetchArtistOnHover = useCallback((artistId: string) => {
    // Use a small delay to avoid prefetching on accidental hovers
    const timeoutId = setTimeout(() => {
      prefetchArtistData(artistId)
    }, 200)

    return () => clearTimeout(timeoutId)
  }, [prefetchArtistData])

  const prefetchArtistOnFocus = useCallback((artistId: string) => {
    // Immediate prefetch on focus (keyboard navigation)
    prefetchArtistData(artistId)
  }, [prefetchArtistData])

  return {
    prefetchArtistOnHover,
    prefetchArtistOnFocus,
    prefetchArtistData,
  }
} 