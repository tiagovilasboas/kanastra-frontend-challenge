import React from 'react'
import { useTranslation } from 'react-i18next'

import { ShowCard } from '@/components/ui'
import { SpotifyShow } from '@/types/spotify'

interface ShowsSectionProps {
  shows: SpotifyShow[]
  isLoading?: boolean
  onSectionClick?: () => void
  total?: number
}

export const ShowsSection: React.FC<ShowsSectionProps> = ({
  shows,
  isLoading = false,
  onSectionClick,
  total = 0,
}) => {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          {t('search:shows', 'Podcasts e programas')}
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="aspect-square animate-pulse rounded-lg bg-muted"
            />
          ))}
        </div>
      </div>
    )
  }

  if (shows.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onSectionClick}
          className="text-2xl font-bold text-foreground hover:text-primary transition-colors"
          aria-label={t('search:shows', 'Podcasts e programas')}
          aria-pressed={false}
        >
          {t('search:shows', 'Podcasts e programas')}
        </button>
        <div className="flex items-center gap-2">
          {total > shows.length && (
            <span className="text-sm text-muted-foreground">
              {t('search:showingResults', 'Mostrando {{count}} de {{total}}', {
                count: shows.length,
                total,
              })}
            </span>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {shows
          .filter((show) => show && show.id) // Filter out null/undefined items
          .map((show) => (
            <ShowCard
              key={show.id}
              show={show}
              onClick={() => {
                // TODO: Implement show navigation
                console.log('Navigate to show:', show.id)
              }}
            />
          ))}
      </div>
    </div>
  )
}
