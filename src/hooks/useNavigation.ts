import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  SpotifyAlbum,
  SpotifyArtist,
  SpotifyAudiobook,
  SpotifyEpisode,
  SpotifyPlaylist,
  SpotifyShow,
  SpotifyTrack,
} from '@/types/spotify'

interface UseNavigationReturn {
  navigateToArtist: (artist: SpotifyArtist) => void
  navigateToAlbum: (album: SpotifyAlbum) => void
  navigateToTrack: (track: SpotifyTrack) => void
  navigateToPlaylist: (playlist: SpotifyPlaylist) => void
  navigateToShow: (show: SpotifyShow) => void
  navigateToEpisode: (episode: SpotifyEpisode) => void
  navigateToAudiobook: (audiobook: SpotifyAudiobook) => void
  openSpotifyUrl: (url: string) => void
}

export function useNavigation(): UseNavigationReturn {
  const navigate = useNavigate()

  const navigateToArtist = useCallback(
    (artist: SpotifyArtist) => {
      navigate(`/artist/${artist.id}`)
    },
    [navigate],
  )

  const navigateToAlbum = useCallback(
    (album: SpotifyAlbum) => {
      navigate(`/album/${album.id}`)
    },
    [navigate],
  )

  const navigateToTrack = useCallback(
    (track: SpotifyTrack) => {
      navigate(`/track/${track.id}`)
    },
    [navigate],
  )

  const navigateToPlaylist = useCallback(
    (playlist: SpotifyPlaylist) => {
      navigate(`/playlist/${playlist.id}`)
    },
    [navigate],
  )

  const navigateToShow = useCallback(
    (show: SpotifyShow) => {
      navigate(`/show/${show.id}`)
    },
    [navigate],
  )

  const navigateToEpisode = useCallback(
    (episode: SpotifyEpisode) => {
      navigate(`/episode/${episode.id}`)
    },
    [navigate],
  )

  const navigateToAudiobook = useCallback(
    (audiobook: SpotifyAudiobook) => {
      navigate(`/audiobook/${audiobook.id}`)
    },
    [navigate],
  )

  const openSpotifyUrl = useCallback((url: string) => {
    // Use a more controlled approach instead of window.open
    const link = document.createElement('a')
    link.href = url
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    link.click()
  }, [])

  return {
    navigateToArtist,
    navigateToAlbum,
    navigateToTrack,
    navigateToPlaylist,
    navigateToShow,
    navigateToEpisode,
    navigateToAudiobook,
    openSpotifyUrl,
  }
}
