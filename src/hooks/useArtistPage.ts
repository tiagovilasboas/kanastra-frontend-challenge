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
  } = useArtistDetails(artistId)

  const {
    tracks: topTracks,
    isLoading: isLoadingTracks,
    error: tracksError,
  } = useArtistTopTracks(artistId)

  const {
    albums,
    totalPages,
    isLoading: isLoadingAlbums,
    error: albumsError,
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

  return {
    artist,
    topTracks,
    albums,
    currentPage,
    totalPages,
    isLoadingArtist,
    isLoadingTracks,
    isLoadingAlbums,
    artistError,
    tracksError,
    albumsError,
    handlePageChange,
    handleBackToHome,
  }
}
