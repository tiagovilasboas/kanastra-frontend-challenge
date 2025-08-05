import { Disc3 } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { SpotifyAlbum } from '@/types/spotify'

interface AlbumCardProps {
  album: SpotifyAlbum
  onClick?: () => void
}

export const AlbumCard: React.FC<AlbumCardProps> = ({ album, onClick }) => {
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

  const { t } = useTranslation()

  return (
    <div
      className="group cursor-pointer transition-all duration-300 hover:scale-105"
      onClick={handleClick}
    >
      <div className="space-y-3 p-4 rounded-lg hover:bg-accent/50 transition-colors">
        {/* Album Cover */}
        <div className="relative aspect-square rounded-lg overflow-hidden bg-muted shadow-lg">
          {album.images && album.images.length > 0 ? (
            <img
              src={album.images[0].url}
              alt={album.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <Disc3 className="w-12 h-12 text-muted-foreground" />
            </div>
          )}

          {/* Play button overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            <div className="w-12 h-12 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center shadow-lg">
              <svg
                className="w-6 h-6 text-white ml-0.5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Album Info */}
        <div className="space-y-1 min-w-0">
          <h3 className="font-bold text-foreground group-hover:text-primary transition-colors text-sm sm:text-base line-clamp-2">
            {album.name}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {formatReleaseDate(
              album.release_date,
              album.release_date_precision,
            )}{' '}
            {t('ui:dot', '•')}{' '}
            {album.artists.map((artist) => artist.name).join(', ')}
          </p>
        </div>
      </div>
    </div>
  )
}
