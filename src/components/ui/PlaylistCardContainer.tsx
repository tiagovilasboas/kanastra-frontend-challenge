import React from 'react'

import { useNavigationHandlers } from '@/hooks/useNavigationHandlers'
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
    if (playlist.external_urls?.spotify) {
      handleSpotifyClick(playlist.external_urls.spotify)
    }
  }

  return <PlaylistCard playlist={playlist} onClick={handleClick} />
}
