import React from 'react'

import { Card, CardContent } from './card'

interface BestResultCardProps {
  imageUrl: string
  title: string
  subtitle: string
  type: string
  onClick?: () => void
  className?: string
}

export const BestResultCard: React.FC<BestResultCardProps> = ({
  imageUrl,
  title,
  subtitle,
  type,
  onClick,
  className = '',
}) => {
  return (
    <Card
      className={`cursor-pointer hover:bg-accent/50 transition-colors h-full ${className}`}
      onClick={onClick}
    >
      <CardContent className="p-0 h-full">
        <div className="flex h-full">
          {/* Image */}
          <div className="w-48 h-48 shrink-0">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover rounded-l-lg"
            />
          </div>

          {/* Content */}
          <div className="flex-1 p-6 flex flex-col justify-center">
            <div className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                {type}
              </span>
              <h3 className="text-2xl font-bold text-foreground line-clamp-2">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
