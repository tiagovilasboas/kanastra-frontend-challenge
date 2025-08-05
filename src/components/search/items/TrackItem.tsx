import React from 'react'

import { SpotifyIcon } from '@/components/ui/SpotifyIcon'

// Track Item Component
interface TrackItemProps {
  track: any
  onClick?: () => void
}

export const TrackItem: React.FC<TrackItemProps> = ({ track, onClick }) => {
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex items-center gap-3 p-2 rounded-md hover:bg-accent/50 transition-colors cursor-pointer" onClick={onClick}>
      <div className="w-12 h-12 flex-shrink-0">
        {track.album?.images?.[0] ? (
          <img
            src={track.album.images[0].url}
            alt={track.name}
            className="w-full h-full object-cover rounded"
          />
        ) : (
          <div className="w-full h-full bg-muted rounded flex items-center justify-center">
            <SpotifyIcon color="green" size={16} />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-foreground truncate">{track.name}</h4>
        <p className="text-sm text-muted-foreground truncate">
          {track.artists?.map((artist: any) => artist?.name || 'Artista desconhecido').join(', ') || 'Artista desconhecido'}
        </p>
      </div>
      <div className="text-sm text-muted-foreground">
        {formatDuration(track.duration_ms)}
      </div>
    </div>
  )
} 