import React from 'react'
import { useTranslation } from 'react-i18next'

import { PlaceholderImage } from './PlaceholderImage'

interface ArtistCardProps {
  artist: {
    id: string
    name: string
    images?: Array<{ url: string; width?: number; height?: number }>
    followers?: { total: number }
  }
  onClick?: () => void
  className?: string
}

export const ArtistCard: React.FC<ArtistCardProps> = ({
  artist,
  onClick,
  className = '',
}) => {
  const { t } = useTranslation()
  return (
    <div
      className={`group cursor-pointer ${className}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.()
        }
      }}
    >
      <div className="space-y-3">
        {/* Circular Image */}
        <div className="relative aspect-square w-full">
          {artist.images && artist.images[0] ? (
            <img
              src={artist.images[0].url}
              alt={artist.name}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <PlaceholderImage type="artist" className="rounded-full" />
          )}
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-full transition-colors duration-200 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg">
                <svg
                  className="w-6 h-6 text-primary-foreground ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-1 text-center">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {artist.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t('search:artist', 'Artista')}
          </p>
        </div>
      </div>
    </div>
  )
}
