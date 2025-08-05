import React from 'react'
import { useTranslation } from 'react-i18next'

import { Badge } from './badge'
import { Card, CardContent } from './card'
import { SpotifyIcon } from './SpotifyIcon'

interface GenreCardProps {
  genre: string
  onClick?: () => void
  className?: string
}

export const GenreCard: React.FC<GenreCardProps> = ({
  genre,
  onClick,
  className = '',
}) => {
  const { t } = useTranslation()

  return (
    <Card
      className={`group cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-accent/50 ${className}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex flex-col items-center text-center space-y-3">
          {/* Genre Icon */}
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
            <SpotifyIcon color="white" size={32} />
          </div>

          {/* Genre Info */}
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm sm:text-base">
              {genre}
            </h3>
            <Badge variant="secondary" className="text-xs">
              {t('search:genre', 'Genre')}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
