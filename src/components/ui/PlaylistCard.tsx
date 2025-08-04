import React from 'react'

import { Card, CardContent } from './card'

interface PlaylistCardProps {
  item: {
    id: string
    title: string
    subtitle?: string
    description?: string
    image: string
    type: 'playlist' | 'album' | 'blend'
  }
  onClick?: () => void
  className?: string
}

export const PlaylistCard: React.FC<PlaylistCardProps> = ({ 
  item, 
  onClick, 
  className = '' 
}) => {
  return (
    <Card 
      className={`group cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-accent/50 ${className}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Image */}
          <div className="relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-gray-600 to-gray-800">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
              }}
            />
          </div>
          
          {/* Info */}
          <div className="space-y-1">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {item.title}
            </h3>
            {item.subtitle && (
              <p className="text-sm text-muted-foreground line-clamp-1">
                {item.subtitle}
              </p>
            )}
            {item.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {item.description}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 