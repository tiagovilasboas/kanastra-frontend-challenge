import React from 'react'
import { useTranslation } from 'react-i18next'

import { TrackList } from '@/components/ui/TrackList'
import { SpotifyTrack } from '@/types/spotify'

interface TracksSectionProps {
  tracks: SpotifyTrack[]
  isLoading?: boolean
}

export const TracksSection: React.FC<TracksSectionProps> = ({
  tracks,
  isLoading = false,
}) => {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          {t('search:tracks', 'Músicas')}
        </h2>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-16 animate-pulse rounded-lg bg-muted"
            />
          ))}
        </div>
      </div>
    )
  }

  if (tracks.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">
        {t('search:tracks', 'Músicas')}
      </h2>
      <TrackList
        tracks={tracks}
        onTrackClick={(track) => {
          // TODO: Implement track navigation
          console.log('Navigate to track:', track.id)
        }}
      />
    </div>
  )
} 