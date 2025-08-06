import React from 'react'
import { useTranslation } from 'react-i18next'

interface ShowCardProps {
  show: {
    id: string
    name: string
    images?: Array<{ url: string; width?: number; height?: number }>
    publisher?: string
    total_episodes?: number
  }
  onClick?: () => void
  className?: string
}

export const ShowCard: React.FC<ShowCardProps> = ({
  show,
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
        {/* Square Image */}
        <div className="relative aspect-square w-full">
          <img
            src={show.images?.[0]?.url || '/placeholder-show.png'}
            alt={show.name}
            className="w-full h-full object-cover rounded-lg shadow-lg group-hover:shadow-xl transition-shadow duration-200"
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg transition-colors duration-200 flex items-center justify-center">
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
        <div className="space-y-1">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {show.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {show.publisher || t('search:unknownPublisher')}
          </p>
          {show.total_episodes && (
            <p className="text-sm text-muted-foreground">
              {t('shows:episodes', { count: show.total_episodes })}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
