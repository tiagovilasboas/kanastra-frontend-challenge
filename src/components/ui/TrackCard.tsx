import { Music, Play } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Card, CardContent } from '@/components/ui/card'
import { SpotifyTrack } from '@/types/spotify'

interface TrackCardProps {
  track: SpotifyTrack
  onClick?: () => void
}

export const TrackCard: React.FC<TrackCardProps> = ({ track, onClick }) => {
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

  return (
    <Card
      className="hover:bg-muted/50 transition-colors cursor-pointer group"
      onClick={handleClick}
    >
      <CardContent className="p-3 sm:p-4">
        <div className="space-y-2">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
            {track.album.images && track.album.images.length > 0 ? (
              <img
                src={track.album.images[0].url}
                alt={track.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <Music className="w-8 h-8 text-muted-foreground" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <Play className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="font-semibold text-foreground text-sm sm:text-base line-clamp-1">
              {track.name}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {track.artists
                ?.map(
                  (artist) =>
                    artist?.name ||
                    t('search:unknownArtist', 'Artista desconhecido'),
                )
                .join(', ') ||
                t('search:unknownArtist', 'Artista desconhecido')}
            </p>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {track.album?.name ||
                t('search:unknownAlbum', 'Álbum desconhecido')}
            </p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{formatDuration(track.duration_ms)}</span>
              {track.popularity && (
                <span>
                  {t('common:popularity', 'Popularity')}
                  {t('common:colon', ': ')}
                  {track.popularity}
                  {t('common:percent', '%')}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
