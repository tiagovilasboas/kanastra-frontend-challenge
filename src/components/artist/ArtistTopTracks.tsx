import { Play } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

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
      <div className="space-y-1">
        {tracks.slice(0, 5).map((track, index) => (
          <Card
            key={track.id}
            className="group hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={() => {
              if (track.external_urls?.spotify) {
                window.open(
                  track.external_urls.spotify,
                  '_blank',
                  'noopener,noreferrer',
                )
              }
            }}
          >
            <CardContent className="px-4">
              <div className="flex items-center gap-2">
                {track.external_urls?.spotify && (
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="h-6 w-6 p-0 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <a
                      href={track.external_urls.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Play className="w-3 h-3" />
                    </a>
                  </Button>
                )}
                <span className="text-xs text-muted-foreground w-3">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <p className="font-medium text-xs leading-tight">
                    {track.name}
                  </p>
                  <p className="text-xs text-muted-foreground leading-tight">
                    {formatDuration(track.duration_ms)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
