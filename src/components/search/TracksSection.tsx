import React from 'react'
import { useTranslation } from 'react-i18next'

import { TrackList } from '@/components/ui/TrackList'
import { SpotifyTrack } from '@/types/spotify'

interface TracksSectionProps {
  tracks: SpotifyTrack[]
  isLoading?: boolean
  onSectionClick?: () => void
  total?: number
}

export const TracksSection: React.FC<TracksSectionProps> = ({
  tracks,
  isLoading = false,
  onSectionClick,
  total = 0,
}) => {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          {t('search:tracks', 'Músicas')}
        </h2>
        <div className="space-y-1">
          {/* Header skeleton */}
          <div className="flex items-center gap-4 p-3 text-sm font-medium text-muted-foreground border-b border-border">
            <div className="w-8 text-center">{t('ui:numberSign', '#')}</div>
            <div className="w-10"></div>
            <div className="flex-1 min-w-0">
              {t('search:trackTitle', 'Title')}
            </div>
            <div className="hidden md:block flex-1 min-w-0">
              {t('search:album', 'Album')}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-muted rounded"></div>
            </div>
          </div>

          {/* Track items skeleton */}
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex items-center gap-4 p-3 rounded-lg">
                <div className="w-8 text-center">
                  <div className="h-4 bg-muted rounded w-4 mx-auto"></div>
                </div>
                <div className="w-10 h-10 bg-muted rounded flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="h-4 bg-muted rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
                <div className="hidden md:block flex-1 min-w-0">
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 bg-muted rounded w-8"></div>
                </div>
              </div>
            </div>
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
      <div className="flex items-center justify-between">
        {onSectionClick ? (
          <button
            onClick={onSectionClick}
            className="text-2xl font-bold text-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            aria-label={t('search:viewAllTracks', 'Ver todas as Músicas')}
            aria-pressed="false"
          >
            {t('search:tracks', 'Músicas')}
          </button>
        ) : (
          <h2 className="text-2xl font-bold text-foreground">
            {t('search:tracks', 'Músicas')}
          </h2>
        )}
        <div className="flex items-center gap-2">
          {total > tracks.length && (
            <span className="text-sm text-muted-foreground">
              {t('search:showingResults', 'Mostrando {{count}} de {{total}}', {
                count: tracks.length,
                total,
              })}
            </span>
          )}
        </div>
      </div>

      <TrackList
        tracks={tracks.filter((track) => track && track.id)}
        onTrackClick={(track) => {
          if (track.external_urls?.spotify) {
            window.open(
              track.external_urls.spotify,
              '_blank',
              'noopener,noreferrer',
            )
          }
        }}
      />
    </div>
  )
}
