import React from 'react'

import { useNavigationHandlers } from '@/hooks/useNavigationHandlers'
import { SpotifyMapper } from '@/mappers/spotify'
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
    const artistDTO = SpotifyMapper.toArtistDTO(artist)
    handleArtistClick(artistDTO.id)
  }

  return <ArtistCard artist={artist} onClick={handleClick} />
}
