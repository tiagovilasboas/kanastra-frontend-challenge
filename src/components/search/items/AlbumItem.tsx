import { Disc3 } from 'lucide-react'
import React from 'react'

import { BaseItem } from './BaseItem'

// Album Item Component
interface AlbumItemProps {
  album: any
  onClick?: () => void
}

export const AlbumItem: React.FC<AlbumItemProps> = ({ album, onClick }) => {
  const subtitle = album.artists?.map((artist: any) => artist?.name || 'Artista desconhecido').join(', ') || 'Artista desconhecido'
  
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