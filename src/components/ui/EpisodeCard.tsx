import React from 'react'
import { useTranslation } from 'react-i18next'

interface EpisodeCardProps {
  episode: {
    id: string
    name: string
    images?: Array<{ url: string; width?: number; height?: number }>
    show?: { name: string }
    duration_ms: number
    release_date?: string
  }
  onClick?: () => void
  className?: string
}

export const EpisodeCard: React.FC<EpisodeCardProps> = ({
  episode,
  onClick,
  className = '',
}) => {
  const { t } = useTranslation()

  const formatDuration = (durationMs: number): string => {
    const minutes = Math.floor(durationMs / 60000)
    const seconds = Math.floor((durationMs % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const formatReleaseDate = (date: string): string => {
    return new Date(date).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

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
            src={episode.images?.[0]?.url || '/placeholder-episode.png'}
            alt={episode.name}
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
            {episode.name}
          </h3>
          {episode.show?.name && (
            <p className="text-sm text-muted-foreground line-clamp-1">
              {episode.show.name}
            </p>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {episode.release_date && (
              <span>{formatReleaseDate(episode.release_date)}</span>
            )}
            {episode.release_date && <span>{t('ui:dot')}</span>}
            <span>{formatDuration(episode.duration_ms)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
