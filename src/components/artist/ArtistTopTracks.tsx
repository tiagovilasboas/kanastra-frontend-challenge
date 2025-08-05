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
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-3 bg-muted rounded"></div>
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
