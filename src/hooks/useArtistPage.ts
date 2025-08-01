import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { spotifyRepository } from '@/repositories'
import { useSpotifyStore } from '@/stores/spotifyStore'

export function useArtistPage(artistId: string | undefined) {
  const navigate = useNavigate()
  const {
    currentArtist,
    artistTopTracks,
    artistAlbums,
    currentPage,
    totalPages,
    isLoadingArtist,
    isLoadingTracks,
    isLoadingAlbums,
    setCurrentArtist,
    setArtistTopTracks,
    setArtistAlbums,
    setPagination,
    setLoadingStates,
    clearArtist,
  } = useSpotifyStore()

  const getArtist = useCallback(
    async (id: string) => {
      if (!id) return

      setLoadingStates({ artist: true })
      try {
        const artist = await spotifyRepository.getArtist(id)
        setCurrentArtist(artist)
      } catch (error) {
        console.error('Error fetching artist:', error)
        setCurrentArtist(null)
      } finally {
        setLoadingStates({ artist: false })
      }
    },
    [setCurrentArtist, setLoadingStates],
  )

  const getArtistTopTracks = useCallback(
    async (id: string) => {
      if (!id) return

      setLoadingStates({ tracks: true })
      try {
        const response = await spotifyRepository.getArtistTopTracks(id)
        setArtistTopTracks(response.tracks)
      } catch (error) {
        console.error('Error fetching top tracks:', error)
        setArtistTopTracks([])
      } finally {
        setLoadingStates({ tracks: false })
      }
    },
    [setArtistTopTracks, setLoadingStates],
  )

  const getArtistAlbums = useCallback(
    async (id: string, page = 1, limit = 20) => {
      if (!id) return

      setLoadingStates({ albums: true })
      try {
        const offset = (page - 1) * limit
        const response = await spotifyRepository.getArtistAlbums(id, {
          limit,
          offset,
        })
        setArtistAlbums(response.items)
        setPagination(page, Math.ceil(response.total / limit))
      } catch (error) {
        console.error('Error fetching albums:', error)
        setArtistAlbums([])
      } finally {
        setLoadingStates({ albums: false })
      }
    },
    [setArtistAlbums, setPagination, setLoadingStates],
  )

  const handleBackToHome = useCallback(() => {
    clearArtist()
    navigate('/')
  }, [clearArtist, navigate])

  useEffect(() => {
    if (artistId) {
      getArtist(artistId)
      getArtistTopTracks(artistId)
      getArtistAlbums(artistId, 1)
    }

    return () => {
      clearArtist()
    }
  }, [artistId, getArtist, getArtistTopTracks, getArtistAlbums, clearArtist])

  return {
    artist: currentArtist,
    topTracks: artistTopTracks,
    albums: artistAlbums,
    currentPage,
    totalPages,
    isLoadingArtist,
    isLoadingTracks,
    isLoadingAlbums,
    getArtistAlbums,
    handleBackToHome,
  }
}
