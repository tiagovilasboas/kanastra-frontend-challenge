import React from 'react'

import { useNavigationHandlers } from '@/hooks/useNavigationHandlers'
import { SpotifyEpisode } from '@/types/spotify'

import { EpisodeCard } from './EpisodeCard'

interface EpisodeCardContainerProps {
  episode: SpotifyEpisode
}

/**
 * Container para EpisodeCard que injeta handlers de navegação.
 * Mantém o componente EpisodeCard puramente apresentacional.
 */
export const EpisodeCardContainer: React.FC<EpisodeCardContainerProps> = ({
  episode,
}) => {
  const { handleSpotifyClick } = useNavigationHandlers()

  const handleClick = () => {
    if (episode.external_urls?.spotify) {
      handleSpotifyClick(episode.external_urls.spotify)
    }
  }

  return <EpisodeCard episode={episode} onClick={handleClick} />
}
