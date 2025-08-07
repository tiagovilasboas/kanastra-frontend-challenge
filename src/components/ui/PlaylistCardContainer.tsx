import React from 'react'

import { useNavigationHandlers } from '@/hooks/useNavigationHandlers'
import { SpotifyMapper } from '@/mappers/spotify'
import { SpotifyPlaylist } from '@/types/spotify'

import { PlaylistCard } from './PlaylistCard'

interface PlaylistCardContainerProps {
  playlist: SpotifyPlaylist
}

/**
 * Container para PlaylistCard que injeta handlers de navegação.
 * Mantém o componente PlaylistCard puramente apresentacional.
 */
export const PlaylistCardContainer: React.FC<PlaylistCardContainerProps> = ({
  playlist,
}) => {
  const { handleSpotifyClick } = useNavigationHandlers()

  const handleClick = () => {
    const playlistDTO = SpotifyMapper.toPlaylistDTO(playlist)
    if (playlistDTO.spotifyUrl) {
      handleSpotifyClick(playlistDTO.spotifyUrl)
    }
  }

  return <PlaylistCard playlist={playlist} onClick={handleClick} />
}
