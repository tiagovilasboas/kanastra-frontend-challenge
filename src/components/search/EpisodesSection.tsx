import React from 'react'
import { useTranslation } from 'react-i18next'

import { EpisodeCard } from '@/components/ui'
import { SpotifyEpisode } from '@/types/spotify'

interface EpisodesSectionProps {
  episodes: SpotifyEpisode[]
  isLoading?: boolean
}

export const EpisodesSection: React.FC<EpisodesSectionProps> = ({
  episodes,
  isLoading = false,
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
      <h2 className="text-2xl font-bold text-foreground">
        {t('search:episodes', 'Episódios')}
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {episodes
          .filter((episode) => episode && episode.id) // Filter out null/undefined items
          .map((episode) => (
            <EpisodeCard
              key={episode.id}
              episode={episode}
              onClick={() => {
                // TODO: Implement episode navigation
                console.log('Navigate to episode:', episode.id)
              }}
            />
          ))}
      </div>
    </div>
  )
} 