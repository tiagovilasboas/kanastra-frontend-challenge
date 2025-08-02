import React from 'react'
import { useTranslation } from 'react-i18next'

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
  showDetails = false,
  releaseDate,
  trackCount,
  albumType,
}) => {
  const { t } = useTranslation()
  
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
              {releaseDate} {t('ui:separator', '•')} {t('ui:trackCount', '{{count}} faixa', { count: trackCount })}
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