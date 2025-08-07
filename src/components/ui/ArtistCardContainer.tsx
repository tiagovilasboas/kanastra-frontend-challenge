import React from 'react'

import { useNavigationHandlers } from '@/hooks/useNavigationHandlers'
import { SpotifyArtist } from '@/types/spotify'

import { ArtistCard } from './ArtistCard'

interface ArtistCardContainerProps {
  artist: SpotifyArtist
}

/**
 * Container para ArtistCard que injeta handlers de navegação.
 * Mantém o componente ArtistCard puramente apresentacional.
 */
export const ArtistCardContainer: React.FC<ArtistCardContainerProps> = ({
  artist,
}) => {
  const { handleArtistClick } = useNavigationHandlers()

  const handleClick = () => {
    handleArtistClick(artist.id)
  }

  return <ArtistCard artist={artist} onClick={handleClick} />
}
