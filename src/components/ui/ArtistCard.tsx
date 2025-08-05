import { User } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { SpotifyArtist } from '@/types/spotify'

interface ArtistCardProps {
  artist: SpotifyArtist
  onClick?: () => void
  className?: string
}

export const ArtistCard: React.FC<ArtistCardProps> = ({
  artist,
  onClick,
  className = '',
}) => {
  const { t } = useTranslation()

  const artistImage =
    artist.images && artist.images.length > 0 ? artist.images[0].url : undefined

  return (
    <div
      className={`group cursor-pointer transition-all duration-300 hover:scale-105 ${className}`}
      onClick={onClick}
    >
      <div className="flex flex-col items-center text-center space-y-3 p-4 rounded-lg hover:bg-accent/50 transition-colors">
        {/* Artist Image */}
        <div className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full overflow-hidden bg-gradient-to-br from-gray-600 to-gray-800 shadow-lg">
          {artistImage ? (
            <img
              src={artistImage}
              alt={artist.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-600 to-gray-800">
              <User className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-gray-400" />
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

        {/* Artist Info */}
        <div className="space-y-1 min-w-0 w-full">
          <h3 className="font-bold text-foreground group-hover:text-primary transition-colors text-sm sm:text-base line-clamp-2">
            {artist.name}
          </h3>
          <p className="text-xs text-muted-foreground font-medium">
            {t('artist:type', 'Artist')}
          </p>
        </div>
      </div>
    </div>
  )
}
