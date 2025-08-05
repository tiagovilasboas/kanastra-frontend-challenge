import { Play } from 'lucide-react'
import React from 'react'

import { BaseItem } from './BaseItem'

// Episode Item Component
interface EpisodeItemProps {
  episode: any
  onClick?: () => void
}

export const EpisodeItem: React.FC<EpisodeItemProps> = ({ episode, onClick }) => {
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    return `${minutes} min`
  }

  const subtitle = `${episode.show?.name || 'Show desconhecido'} • ${formatDuration(episode.duration_ms)}`
  
  return (
    <BaseItem
      image={episode.images?.[0]?.url}
      title={episode.name}
      subtitle={subtitle}
      icon={<Play className="h-8 w-8" />}
      onClick={onClick}
    />
  )
} 