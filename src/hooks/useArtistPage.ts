import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@/config/react-query'
import { spotifyRepository } from '@/repositories'
import { useArtistAlbums } from './useArtistAlbums'
import { useArtistDetails } from './useArtistDetails'
import { useArtistTopTracks } from './useArtistTopTracks'

export function useArtistPage(artistId: string | undefined) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [currentPage, setCurrentPage] = useState(1)

  // React Query hooks
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
    page: currentPage,
  })

  const handleBackToHome = useCallback(() => {
    navigate('/')
  }, [navigate])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const handleRefresh = useCallback(() => {
    // Refetch all data for this artist
    refetchArtist()
    refetchTracks()
    refetchAlbums()
  }, [refetchArtist, refetchTracks, refetchAlbums])

  const handlePrefetchNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      queryClient.prefetchQuery({
        queryKey: queryKeys.artists.albums(artistId || '', currentPage + 1, 20),
        queryFn: async () => {
          if (!artistId) throw new Error('Artist ID is required')
          const offset = currentPage * 20
          return await spotifyRepository.getArtistAlbums(artistId, ['album', 'single'], 20, offset)
        },
      })
    }
  }, [queryClient, artistId, currentPage, totalPages])

  const handleInvalidateArtistData = useCallback(() => {
    // Invalidate all artist-related queries
    queryClient.invalidateQueries({
      queryKey: queryKeys.artists.details(artistId || ''),
    })
    queryClient.invalidateQueries({
      queryKey: queryKeys.artists.topTracks(artistId || ''),
    })
    queryClient.invalidateQueries({
      queryKey: queryKeys.artists.albums(artistId || '', 1, 20),
    })
  }, [queryClient, artistId])

  return {
    artist,
    topTracks,
    albums,
    currentPage,
    totalPages,
    totalItems,
    isLoadingArtist,
    isLoadingTracks,
    isLoadingAlbums,
    artistError,
    tracksError,
    albumsError,
    handlePageChange,
    handleBackToHome,
    handleRefresh,
    handlePrefetchNextPage,
    handleInvalidateArtistData,
  }
}
