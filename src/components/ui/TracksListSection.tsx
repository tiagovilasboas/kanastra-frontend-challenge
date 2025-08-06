import { Play } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface Track {
  id: string
  name: string
  artists: Array<{ name: string }>
  album: {
    name: string
    images: Array<{ url: string }>
  }
  duration_ms: number
  hasVideo?: boolean
}

interface TracksListSectionProps {
  tracks: Track[]
  onTrackClick?: (trackId: string) => void
  className?: string
}

export const TracksListSection: React.FC<TracksListSectionProps> = ({
  tracks,
  onTrackClick,
  className = '',
}) => {
  const { t } = useTranslation()
  const formatDuration = (durationMs: number): string => {
    const minutes = Math.floor(durationMs / 60000)
    const seconds = Math.floor((durationMs % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className={`space-y-0.5 ${className}`}>
      {tracks.slice(0, 4).map((track) => (
        <div
          key={track.id}
          className="flex items-center gap-4 p-1 hover:bg-accent/50 rounded-lg cursor-pointer transition-colors"
          onClick={() => onTrackClick?.(track.id)}
        >
          {/* Album Art */}
          <div className="w-12 h-12 shrink-0">
            <img
              src={track.album.images[0]?.url || '/placeholder-album.png'}
              alt={track.album.name}
              className="w-full h-full object-cover rounded"
            />
          </div>

          {/* Track Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground line-clamp-1">
              {track.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {track.hasVideo && (
                <>
                  <Play className="w-3 h-3" />
                  <span>{t('search:videoClip')}</span>
                  <span>{t('ui:dot')}</span>
                </>
              )}
              <span className="line-clamp-1">
                {track.artists.map((artist) => artist.name).join(', ')}
              </span>
            </div>
          </div>

          {/* Duration */}
          <div className="text-sm text-muted-foreground shrink-0">
            {formatDuration(track.duration_ms)}
          </div>
        </div>
      ))}
    </div>
  )
}
