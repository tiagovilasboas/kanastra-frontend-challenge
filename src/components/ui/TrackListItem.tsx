import { Check, Play } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { SpotifyIcon } from '@/components/ui/SpotifyIcon'
import { SpotifyTrack } from '@/types/spotify'

interface TrackListItemProps {
  track: SpotifyTrack
  index: number
  onClick?: () => void
  isLiked?: boolean
}

export const TrackListItem: React.FC<TrackListItemProps> = ({
  track,
  index,
  onClick,
  isLiked = false,
}) => {
  const { t } = useTranslation()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (track.external_urls?.spotify) {
      window.open(track.external_urls.spotify, '_blank', 'noopener,noreferrer')
    }
  }

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const trackImage =
    track.album.images && track.album.images.length > 0
      ? track.album.images[0].url
      : undefined

  return (
    <div
      className="group flex items-center gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
      onClick={handleClick}
    >
      {/* Track Number */}
      <div className="w-8 text-center text-sm text-muted-foreground group-hover:text-foreground transition-colors">
        {index + 1}
      </div>

      {/* Album Art */}
      <div className="relative w-10 h-10 rounded overflow-hidden bg-muted flex-shrink-0">
        {trackImage ? (
          <img
            src={trackImage}
            alt={track.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <SpotifyIcon color="green" size={20} />
          </div>
        )}
        {/* Play button overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <Play className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* Track Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-foreground text-sm line-clamp-1 group-hover:text-primary transition-colors">
            {track.name}
          </h3>
          {track.explicit && (
            <span className="text-xs bg-muted-foreground/20 text-muted-foreground px-1 rounded">
              {t('audio:explicit', 'E')}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-1">
          {track.artists
            ?.map(
              (artist) =>
                artist?.name ||
                t('search:unknownArtist', 'Artista desconhecido'),
            )
            .join(', ') || t('search:unknownArtist', 'Artista desconhecido')}
        </p>
      </div>

      {/* Album */}
      <div className="hidden md:block flex-1 min-w-0">
        <p className="text-sm text-muted-foreground line-clamp-1">
          {track.album?.name || t('search:unknownAlbum', 'Álbum desconhecido')}
        </p>
      </div>

      {/* Duration */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {isLiked && <Check className="w-4 h-4 text-green-500" />}
        <span>{formatDuration(track.duration_ms)}</span>
      </div>
    </div>
  )
}
