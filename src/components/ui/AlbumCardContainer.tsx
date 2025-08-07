import React from 'react'

import { useNavigationHandlers } from '@/hooks/useNavigationHandlers'
import { SpotifyMapper } from '@/mappers/spotify'
import { SpotifyAlbum } from '@/types/spotify'

import { AlbumCard } from './AlbumCard'

interface AlbumCardContainerProps {
  album: SpotifyAlbum
}

/**
 * Container para AlbumCard que injeta handlers de navegação.
 * Mantém o componente AlbumCard puramente apresentacional.
 */
export const AlbumCardContainer: React.FC<AlbumCardContainerProps> = ({
  album,
}) => {
  const { handleAlbumClick } = useNavigationHandlers()

  const handleClick = () => {
    const albumDTO = SpotifyMapper.toAlbumDTO(album)
    handleAlbumClick(albumDTO.id)
  }

  return <AlbumCard album={album} onClick={handleClick} />
}
