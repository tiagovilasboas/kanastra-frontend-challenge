import React from 'react'
import { useTranslation } from 'react-i18next'

import { SpotifyTrack } from '@/types/spotify'

import { TrackItem } from '../items/TrackItem'
import { ListLayout } from '../layouts/ListLayout'
import { SectionWrapper } from '../layouts/SectionWrapper'

// Artist Top Tracks Section
interface ArtistTopTracksSectionProps {
  tracks: SpotifyTrack[]
  isLoading?: boolean
  error?: string | null
  onTrackClick?: (track: SpotifyTrack) => void
}

export const ArtistTopTracksSection: React.FC<ArtistTopTracksSectionProps> = ({ 
  tracks, 
  isLoading = false,
  error = null,
  onTrackClick 
}) => {
  const { t } = useTranslation()

  const handleTrackClick = (track: SpotifyTrack) => {
    if (onTrackClick) {
      onTrackClick(track)
    } else {
      // Default behavior: open in Spotify
      if (track.external_urls?.spotify) {
        window.open(
          track.external_urls.spotify,
          '_blank',
          'noopener,noreferrer',
        )
      }
    }
  }

  if (isLoading) {
    return (
      <SectionWrapper title={t('artist:topTracks', 'Músicas populares')}>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex items-center gap-3 p-2 rounded-md">
                <div className="w-12 h-12 bg-muted rounded flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="h-4 bg-muted rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <div className="h-4 bg-muted rounded w-8"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>
    )
  }

  if (error) {
    return (
      <SectionWrapper title={t('artist:topTracks', 'Músicas populares')}>
        <p className="text-destructive">{t('artist:errorLoadingTracks', 'Erro ao carregar músicas')}</p>
      </SectionWrapper>
    )
  }

  if (tracks.length === 0) {
    return (
      <SectionWrapper title={t('artist:topTracks', 'Músicas populares')}>
        <p className="text-muted-foreground">{t('artist:noTracks', 'Nenhuma música encontrada')}</p>
      </SectionWrapper>
    )
  }

  return (
    <SectionWrapper title={t('artist:topTracks', 'Músicas populares')}>
      <ListLayout>
        {tracks.slice(0, 5).map((track) => (
          <TrackItem 
            key={track.id} 
            track={track} 
            onClick={() => handleTrackClick(track)}
          />
        ))}
      </ListLayout>
    </SectionWrapper>
  )
} 