import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect } from 'react'

import { cache, queryKeys } from '@/config/react-query'
import { spotifyRepository } from '@/repositories'

import { useArtistAlbums } from './useArtistAlbums'
import { useArtistDetails } from './useArtistDetails'
import { useArtistTopTracks } from './useArtistTopTracks'

interface UseArtistDetailsOptimizedParams {
  artistId: string | undefined
  page: number
}

interface UseArtistDetailsOptimizedReturn {
  // Data from individual hooks
  artist: ReturnType<typeof useArtistDetails>['artist']
  topTracks: ReturnType<typeof useArtistTopTracks>['tracks']
  albums: ReturnType<typeof useArtistAlbums>['albums']
  totalPages: ReturnType<typeof useArtistAlbums>['totalPages']
  totalItems: ReturnType<typeof useArtistAlbums>['totalItems']
  
  // Loading states
  isLoadingArtist: boolean
  isLoadingTracks: boolean
  isLoadingAlbums: boolean
  isLoading: boolean // Combined loading state
  
  // Error states
  artistError: Error | null
  tracksError: Error | null
  albumsError: Error | null
  
  // Actions
  refetchAll: () => void
  prefetchNextPage: () => void
  invalidateCache: () => void
  setPage: (page: number) => void
}

export function useArtistDetailsOptimized({
  artistId,
  page,
}: UseArtistDetailsOptimizedParams): UseArtistDetailsOptimizedReturn {
  const queryClient = useQueryClient()

  // Individual hooks
  const {
    artist,
    isLoading: isLoadingArtist,
    error: artistError,
    refetch: refetchArtist,
  } = useArtistDetails(artistId)

  const {
    tracks: topTracks,
    isLoading: isLoadingTracks,
    error: tracksError,
    refetch: refetchTracks,
  } = useArtistTopTracks(artistId)

  const {
    albums,
    totalPages,
    totalItems,
    isLoading: isLoadingAlbums,
    error: albumsError,
    refetch: refetchAlbums,
  } = useArtistAlbums({
    artistId,
    page,
  })

  // Combined loading state
  const isLoading = isLoadingArtist || isLoadingTracks || isLoadingAlbums

  // Prefetch next page when component mounts or page changes
  useEffect(() => {
    if (artistId && page < totalPages) {
      const nextPage = page + 1
      const offset = nextPage * 20
      
      queryClient.prefetchQuery({
        queryKey: queryKeys.artists.albums(artistId, nextPage, 20),
        queryFn: async () => {
          const response = await spotifyRepository.getArtistAlbums(artistId, ['album', 'single'], 20, offset)
          return {
            albums: response,
            total: response.length,
            totalPages: Math.ceil(response.length / 20),
          }
        },
        staleTime: cache.stale.OCCASIONAL,
        gcTime: cache.times.MEDIUM,
      })
    }
  }, [queryClient, artistId, page, totalPages])

  // Prefetch artist details and top tracks when artistId changes
  useEffect(() => {
    if (artistId) {
      // Prefetch artist details
      queryClient.prefetchQuery({
        queryKey: queryKeys.artists.details(artistId),
        queryFn: async () => {
          return await spotifyRepository.getArtistDetails(artistId)
        },
        staleTime: cache.stale.OCCASIONAL,
        gcTime: cache.times.MEDIUM,
      })

      // Prefetch top tracks
      queryClient.prefetchQuery({
        queryKey: queryKeys.artists.topTracks(artistId),
        queryFn: async () => {
          return await spotifyRepository.getArtistTopTracks(artistId)
        },
        staleTime: cache.stale.RARE,
        gcTime: cache.times.LONG,
      })
    }
  }, [queryClient, artistId])

  const refetchAll = useCallback(() => {
    refetchArtist()
    refetchTracks()
    refetchAlbums()
  }, [refetchArtist, refetchTracks, refetchAlbums])

  const prefetchNextPage = useCallback(() => {
    if (artistId && page < totalPages) {
      const nextPage = page + 1
      const offset = nextPage * 20
      
      queryClient.prefetchQuery({
        queryKey: queryKeys.artists.albums(artistId, nextPage, 20),
        queryFn: async () => {
          const response = await spotifyRepository.getArtistAlbums(artistId, ['album', 'single'], 20, offset)
          return {
            albums: response,
            total: response.length,
            totalPages: Math.ceil(response.length / 20),
          }
        },
        staleTime: cache.stale.OCCASIONAL,
        gcTime: cache.times.MEDIUM,
      })
    }
  }, [queryClient, artistId, page, totalPages])

  const invalidateCache = useCallback(() => {
    if (artistId) {
      // Invalidate all artist-related queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.artists.details(artistId),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.artists.topTracks(artistId),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.artists.albums(artistId, page, 20),
      })
    }
  }, [queryClient, artistId, page])

  const setPage = useCallback((newPage: number) => {
    // This is a placeholder - the actual page state should be managed by the parent component
    // The parent component should call this hook with the new page value
    console.log('Page changed to:', newPage)
  }, [])

  return {
    // Data
    artist,
    topTracks,
    albums,
    totalPages,
    totalItems,
    
    // Loading states
    isLoadingArtist,
    isLoadingTracks,
    isLoadingAlbums,
    isLoading,
    
    // Error states
    artistError,
    tracksError,
    albumsError,
    
    // Actions
    refetchAll,
    prefetchNextPage,
    invalidateCache,
    setPage,
  }
} 