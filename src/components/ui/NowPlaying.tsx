import { Heart, Pause,Play } from 'lucide-react'
import React from 'react'

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
  if (!track) {
    return null
  }

  return (
    <div className="now-playing-bar">
      <div className="now-playing-content">
        <div className="now-playing-info">
          <img
            src={track.albumArt || '/placeholder-album.jpg'}
            alt={track.name}
            className="now-playing-artwork"
          />
          <div className="now-playing-text">
            <div className="now-playing-title">{track.name}</div>
            <div className="now-playing-artist">{track.artist}</div>
          </div>
        </div>
        
        <div className="now-playing-controls">
          <button
            className="now-playing-button"
            onClick={onLike}
            aria-label="Curtir música"
          >
            <Heart size={20} />
          </button>
          <button
            className="now-playing-button play-button"
            onClick={onPlayPause}
            aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
        </div>
      </div>
    </div>
  )
} 