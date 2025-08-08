import React from 'react'

import { useNavigationHandlers } from '@/hooks/useNavigationHandlers'
import { SpotifyAudiobook } from '@/types/spotify'

import { AudiobookCard } from './AudiobookCard'

interface AudiobookCardContainerProps {
  audiobook: SpotifyAudiobook
}

/**
 * Container para AudiobookCard que injeta handlers de navegação.
 * Mantém o componente AudiobookCard puramente apresentacional.
 */
export const AudiobookCardContainer: React.FC<AudiobookCardContainerProps> = ({
  audiobook,
}) => {
  const { handleSpotifyClick } = useNavigationHandlers()

  const handleClick = () => {
    if (audiobook.external_urls?.spotify) {
      handleSpotifyClick(audiobook.external_urls.spotify)
    }
  }

  return <AudiobookCard audiobook={audiobook} onClick={handleClick} />
}
