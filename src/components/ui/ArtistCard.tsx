import React from 'react'
import { useTranslation } from 'react-i18next'

import { SpotifyArtist } from '@/types/spotify'

import { Badge } from './badge'
import { Card, CardContent } from './card'

interface ArtistCardProps {
  artist: SpotifyArtist
  onClick?: () => void
  className?: string
}

export const ArtistCard: React.FC<ArtistCardProps> = ({ 
  artist, 
  onClick, 
  className = '' 
}) => {
  const { t } = useTranslation()
  
  const artistImage = artist.images && artist.images.length > 0 
    ? artist.images[0].url 
    : 'https://via.placeholder.com/300x300/1DB954/ffffff?text=?'

  return (
    <Card 
      className={`group cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-accent/50 ${className}`}
      onClick={onClick}
    >
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
          {/* Artist Image */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-gradient-to-br from-gray-600 to-gray-800">
            <img
              src={artistImage}
              alt={artist.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
              }}
            />
          </div>
          
          {/* Artist Info */}
          <div className="space-y-1">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm sm:text-base line-clamp-2">
              {artist.name}
            </h3>
            <Badge variant="secondary" className="text-xs">
              {t('artist:type', 'Artist')}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 