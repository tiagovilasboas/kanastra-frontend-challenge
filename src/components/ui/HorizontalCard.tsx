import React from 'react'

import { ImagePlaceholder } from './ImagePlaceholder'

interface HorizontalCardProps {
  id: string
  title: string
  subtitle?: string
  image?: string
  onClick?: () => void
  spotifyUrl?: string
  className?: string
  showDetails?: boolean
  releaseDate?: string
  trackCount?: number
  albumType?: string
}

export const HorizontalCard: React.FC<HorizontalCardProps> = ({
  title,
  subtitle,
  image,
  onClick,
  spotifyUrl,
  className = '',
}) => {
  const handleClick = () => {
    if (spotifyUrl) {
      window.open(spotifyUrl, '_blank', 'noopener,noreferrer')
    } else {
      onClick?.()
    }
  }

  return (
    <div
      className={`horizontal-card ${className}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
    >
      <div className="horizontal-card-image">
        {image ? (
          <img src={image} alt={title} className="horizontal-card-img" />
        ) : (
          <ImagePlaceholder className="horizontal-card-img" />
        )}
      </div>
      <div className="horizontal-card-content">
        <h3 className="horizontal-card-title">{title}</h3>
        {subtitle && <p className="horizontal-card-subtitle">{subtitle}</p>}
      </div>
    </div>
  )
}
