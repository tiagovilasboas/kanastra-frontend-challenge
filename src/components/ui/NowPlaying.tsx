import { Heart, Pause, Play } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { ImagePlaceholder } from './ImagePlaceholder'

interface NowPlayingProps {
  track?: {
    name: string
    artist: string
    albumArt?: string
  }
  isPlaying?: boolean
  onPlayPause?: () => void
  onLike?: () => void
}

export const NowPlaying: React.FC<NowPlayingProps> = ({
  track,
  isPlaying = false,
  onPlayPause,
  onLike,
}) => {
  const { t } = useTranslation()
  if (!track) {
    return null
  }

  return (
    <div className="now-playing-bar">
      <div className="now-playing-content">
        <div className="now-playing-info">
          {track.albumArt ? (
            <img
              src={track.albumArt}
              alt={track.name}
              className="now-playing-artwork"
            />
          ) : (
            <ImagePlaceholder
              className="now-playing-artwork compact"
              width={40}
              height={40}
            />
          )}
          <div className="now-playing-text">
            <div className="now-playing-title">{track.name}</div>
            <div className="now-playing-artist">{track.artist}</div>
          </div>
        </div>

        <div className="now-playing-controls">
          <button
            className="now-playing-button"
            onClick={onLike}
            aria-label={t('ui:likeSong', 'Curtir música')}
          >
            <Heart size={20} />
          </button>
          <button
            className="now-playing-button play-button"
            onClick={onPlayPause}
            aria-label={
              isPlaying ? t('ui:pause', 'Pausar') : t('ui:play', 'Reproduzir')
            }
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
        </div>
      </div>
    </div>
  )
}
