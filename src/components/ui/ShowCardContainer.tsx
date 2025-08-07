import React from 'react'

import { useNavigationHandlers } from '@/hooks/useNavigationHandlers'
import { SpotifyShow } from '@/types/spotify'

import { ShowCard } from './ShowCard'

interface ShowCardContainerProps {
  show: SpotifyShow
}

/**
 * Container para ShowCard que injeta handlers de navegação.
 * Mantém o componente ShowCard puramente apresentacional.
 */
export const ShowCardContainer: React.FC<ShowCardContainerProps> = ({
  show,
}) => {
  const { handleSpotifyClick } = useNavigationHandlers()

  const handleClick = () => {
    if (show.external_urls?.spotify) {
      handleSpotifyClick(show.external_urls.spotify)
    }
  }

  return <ShowCard show={show} onClick={handleClick} />
}
