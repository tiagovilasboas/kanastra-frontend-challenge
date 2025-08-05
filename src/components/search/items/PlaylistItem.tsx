import React from 'react'

import { SpotifyIcon } from '@/components/ui/SpotifyIcon'

import { BaseItem } from './BaseItem'

// Playlist Item Component
interface PlaylistItemProps {
  playlist: any
  onClick?: () => void
}

export const PlaylistItem: React.FC<PlaylistItemProps> = ({ playlist, onClick }) => {
  const subtitle = `De ${playlist.owner?.display_name || 'Proprietário desconhecido'}`
  
  return (
    <BaseItem
      image={playlist.images?.[0]?.url}
      title={playlist.name}
      subtitle={subtitle}
      icon={<SpotifyIcon color="green" size={32} />}
      onClick={onClick}
    />
  )
} 