import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useArtistAlbums } from './useArtistAlbums'
import { useArtistDetails } from './useArtistDetails'
import { useArtistTopTracks } from './useArtistTopTracks'

export function useArtistPage(artistId: string | undefined) {
  const navigate = useNavigate()
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
    hasNextPage,
    hasPreviousPage,
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

  return {
    artist,
    topTracks,
    albums,
    currentPage,
    totalPages,
    totalItems,
    hasNextPage,
    hasPreviousPage,
    isLoadingArtist,
    isLoadingTracks,
    isLoadingAlbums,
    artistError,
    tracksError,
    albumsError,
    handlePageChange,
    handleBackToHome,
    handleRefresh,
  }
}
