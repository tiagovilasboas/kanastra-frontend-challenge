import { Clock } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { SpotifyTrack } from '@/types/spotify'

import { TrackListItem } from './TrackListItem'

interface TrackListProps {
  tracks: SpotifyTrack[]
  onTrackClick?: (track: SpotifyTrack) => void
  className?: string
}

export const TrackList: React.FC<TrackListProps> = ({
  tracks,
  onTrackClick,
  className = '',
}) => {
  const { t } = useTranslation()

  const handleTrackClick = (track: SpotifyTrack) => {
    if (onTrackClick) {
      onTrackClick(track)
    }
  }

  return (
    <div className={`space-y-0.5 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-4 p-2 text-sm font-medium text-muted-foreground border-b border-border">
        <div className="w-8 text-center">{t('ui:numberSign', '#')}</div>
        <div className="w-10"></div> {/* Space for album art */}
        <div className="flex-1 min-w-0">{t('search:trackTitle', 'Title')}</div>
        <div className="hidden md:block flex-1 min-w-0">
          {t('search:album', 'Album')}
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
        </div>
      </div>

      {/* Track List */}
      <div className="space-y-0.5">
        {tracks
          .filter((track) => track && track.id) // Filter out null/undefined items
          .map((track, index) => (
            <TrackListItem
              key={track.id}
              track={track}
              index={index}
              onClick={() => handleTrackClick(track)}
              isLiked={false} // TODO: Implement liked tracks functionality
            />
          ))}
      </div>
    </div>
  )
}
