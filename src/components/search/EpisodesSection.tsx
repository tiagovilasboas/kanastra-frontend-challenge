import React from 'react'
import { useTranslation } from 'react-i18next'

import { EpisodeCard } from '@/components/ui'
import { SpotifyEpisode } from '@/types/spotify'

interface EpisodesSectionProps {
  episodes: SpotifyEpisode[]
  isLoading?: boolean
  onSectionClick?: () => void
  total?: number
}

export const EpisodesSection: React.FC<EpisodesSectionProps> = ({
  episodes,
  isLoading = false,
  onSectionClick,
  total = 0,
}) => {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          {t('search:episodes', 'Episódios')}
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

  if (episodes.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onSectionClick}
          className="text-2xl font-bold text-foreground hover:text-primary transition-colors"
          aria-label={t('search:episodes', 'Episódios')}
          aria-pressed={false}
        >
          {t('search:episodes', 'Episódios')}
        </button>
        <div className="flex items-center gap-2">
          {!onSectionClick && total > episodes.length && (
            <span className="text-sm text-muted-foreground">
              {t('search:showingResults', 'Mostrando {{count}} de {{total}}', {
                count: episodes.length,
                total,
              })}
            </span>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {episodes
          .filter((episode) => episode && episode.id) // Filter out null/undefined items
          .map((episode) => (
            <EpisodeCard
              key={episode.id}
              episode={episode}
              onClick={() => {
                if (episode.external_urls?.spotify) {
                  window.open(
                    episode.external_urls.spotify,
                    '_blank',
                    'noopener,noreferrer',
                  )
                }
              }}
            />
          ))}
      </div>
    </div>
  )
}
