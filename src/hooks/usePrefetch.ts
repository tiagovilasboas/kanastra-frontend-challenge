import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

import { queryKeys } from '@/config/react-query'
import { spotifyRepository } from '@/repositories'

interface PrefetchOptions {
  enabled?: boolean
  priority?: 'high' | 'medium' | 'low'
}

export function usePrefetch() {
  const queryClient = useQueryClient()

  // Prefetch artist details when hovering over artist card
  const prefetchArtistDetails = useCallback(
    async (artistId: string, options: PrefetchOptions = {}) => {
      const { enabled = true } = options

      if (!enabled) return

      await queryClient.prefetchQuery({
        queryKey: queryKeys.artists.details(artistId),
        queryFn: () => spotifyRepository.getArtist(artistId),
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        retry: 1,
      })
    },
    [queryClient],
  )

  // Prefetch artist top tracks
  const prefetchArtistTopTracks = useCallback(
    async (artistId: string, options: PrefetchOptions = {}) => {
      const { enabled = true } = options

      if (!enabled) return

      await queryClient.prefetchQuery({
        queryKey: queryKeys.artists.topTracks(artistId),
        queryFn: () => spotifyRepository.getArtistTopTracks(artistId),
        staleTime: 10 * 60 * 1000, // 10 minutes
        gcTime: 15 * 60 * 1000, // 15 minutes
        retry: 1,
      })
    },
    [queryClient],
  )

  // Prefetch artist albums (first page)
  const prefetchArtistAlbums = useCallback(
    async (artistId: string, options: PrefetchOptions = {}) => {
      const { enabled = true } = options

      if (!enabled) return

      await queryClient.prefetchQuery({
        queryKey: queryKeys.artists.albums(artistId, 1, 20),
        queryFn: () =>
          spotifyRepository.getArtistAlbums(artistId, { limit: 20, offset: 0 }),
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        retry: 1,
      })
    },
    [queryClient],
  )

  // Prefetch related data for an artist
  const prefetchArtistData = useCallback(
    async (artistId: string, options: PrefetchOptions = {}) => {
      const { enabled = true } = options

      if (!enabled) return

      // Prefetch in parallel for better performance
      await Promise.allSettled([
        prefetchArtistDetails(artistId, { enabled }),
        prefetchArtistTopTracks(artistId, { enabled }),
        prefetchArtistAlbums(artistId, { enabled }),
      ])
    },
    [prefetchArtistDetails, prefetchArtistTopTracks, prefetchArtistAlbums],
  )

  // Prefetch search results for common queries
  const prefetchSearchResults = useCallback(
    async (query: string, options: PrefetchOptions = {}) => {
      const { enabled = true } = options

      if (!enabled || !query.trim()) return

      await queryClient.prefetchQuery({
        queryKey: queryKeys.search.byQuery(query),
        queryFn: () => spotifyRepository.searchArtists(query),
        staleTime: 2 * 60 * 1000, // 2 minutes
        gcTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
      })
    },
    [queryClient],
  )

  // Prefetch popular artists (could be used for recommendations)
  const prefetchPopularArtists = useCallback(
    async (options: PrefetchOptions = {}) => {
      const { enabled = true } = options

      if (!enabled) return

      // Prefetch search for popular artists
      const popularArtists = [
        'Drake',
        'Taylor Swift',
        'The Weeknd',
        'Bad Bunny',
      ]

      await Promise.allSettled(
        popularArtists.map((artist) =>
          prefetchSearchResults(artist, { enabled }),
        ),
      )
    },
    [prefetchSearchResults],
  )

  return {
    prefetchArtistDetails,
    prefetchArtistTopTracks,
    prefetchArtistAlbums,
    prefetchArtistData,
    prefetchSearchResults,
    prefetchPopularArtists,
  }
}
