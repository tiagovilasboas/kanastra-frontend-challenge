import React from 'react'
import { useTranslation } from 'react-i18next'

import { TrackList } from '@/components/ui'
import { SpotifyTrack } from '@/types/spotify'

interface ArtistTopTracksProps {
  tracks: SpotifyTrack[]
  isLoading: boolean
  error: string | null
}

export const ArtistTopTracks: React.FC<ArtistTopTracksProps> = ({
  tracks,
  isLoading,
  error,
}) => {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">
          {t('artist:topTracks')}
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
          {Array.from({ length: 5 }).map((_, index) => (
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
      </section>
    )
  }

  if (error) {
    return (
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">
          {t('artist:topTracks')}
        </h2>
        <p className="text-destructive">{t('artist:errorLoadingTracks')}</p>
      </section>
    )
  }

  if (tracks.length === 0) {
    return (
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">
          {t('artist:topTracks')}
        </h2>
        <p className="text-muted-foreground">{t('artist:noTracks')}</p>
      </section>
    )
  }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">
        {t('artist:topTracks')}
      </h2>
      <TrackList
        tracks={tracks.slice(0, 5)}
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
    </section>
  )
}
