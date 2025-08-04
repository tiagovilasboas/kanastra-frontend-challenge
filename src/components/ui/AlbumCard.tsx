import { Disc3 } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Card, CardContent } from '@/components/ui/card'
import { SpotifyAlbum } from '@/types/spotify'

interface AlbumCardProps {
  album: SpotifyAlbum
  onClick?: () => void
}

export const AlbumCard: React.FC<AlbumCardProps> = ({ album, onClick }) => {
  const { t } = useTranslation()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (album.external_urls?.spotify) {
      window.open(album.external_urls.spotify, '_blank', 'noopener,noreferrer')
    }
  }

  const formatReleaseDate = (date: string, precision: string) => {
    if (precision === 'year') {
      return date
    }
    if (precision === 'month') {
      return new Date(date + '-01').toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
      })
    }
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <Card
      className="hover:bg-muted/50 transition-colors cursor-pointer"
      onClick={handleClick}
    >
      <CardContent className="p-3 sm:p-4">
        <div className="space-y-2">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
            {album.images && album.images.length > 0 ? (
              <img
                src={album.images[0].url}
                alt={album.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <Disc3 className="w-8 h-8 text-muted-foreground" />
              </div>
            )}
          </div>

          <div className="space-y-1">
            <h3 className="font-semibold text-foreground text-sm sm:text-base line-clamp-1">
              {album.name}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {album.artists.map((artist) => artist.name).join(', ')}
            </p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {formatReleaseDate(
                  album.release_date,
                  album.release_date_precision,
                )}
              </span>
              <span>
                {album.total_tracks} {t('common:tracks', 'tracks')}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="capitalize">{album.album_type}</span>
              {album.popularity && (
                <span>
                  {t('common:popularity', 'Popularity')}
                  {t('common:colon', ': ')}
                  {album.popularity}
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
