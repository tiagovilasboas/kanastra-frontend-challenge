import { Disc3 } from 'lucide-react'
import React from 'react'

import { SpotifyAlbum } from '@/types/spotify'

import { BaseItem } from './BaseItem'

// Album Item Component
interface AlbumItemProps {
  album: SpotifyAlbum
  onClick?: () => void
}

export const AlbumItem: React.FC<AlbumItemProps> = ({ album, onClick }) => {
  const subtitle =
    album.artists
      ?.map((artist) => artist?.name || 'Artista desconhecido')
      .join(', ') || 'Artista desconhecido'

  return (
    <BaseItem
      image={album.images?.[0]?.url}
      title={album.name}
      subtitle={subtitle}
      icon={<Disc3 className="h-8 w-8" />}
      onClick={onClick}
    />
  )
}
