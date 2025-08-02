import React from 'react'

interface HorizontalCardProps {
  id: string
  title: string
  subtitle?: string
  image?: string
  onClick?: () => void
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
  className = '',
  showDetails = false,
  releaseDate,
  trackCount,
  albumType,
}) => {
  return (
    <div
      className={`horizontal-card ${className}`}
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
      <div className="horizontal-card-image">
        <img
          src={image || '/placeholder-album.jpg'}
          alt={title}
          className="horizontal-card-img"
        />
      </div>
      <div className="horizontal-card-content">
        <h3 className="horizontal-card-title">{title}</h3>
        {subtitle && <p className="horizontal-card-subtitle">{subtitle}</p>}
        
        {showDetails && releaseDate && trackCount && (
          <div className="horizontal-card-details">
            <span className="horizontal-card-date">
              {releaseDate} • {trackCount} {trackCount === 1 ? 'faixa' : 'faixas'}
            </span>
            {albumType && (
              <span className="horizontal-card-type">{albumType}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 