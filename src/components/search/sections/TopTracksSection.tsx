import React from 'react'
import { useTranslation } from 'react-i18next'

import { SpotifyTrack } from '@/types/spotify'

import { TrackItem } from '../items/TrackItem'
import { GridLayout } from '../layouts/GridLayout'
import { SectionWrapper } from '../layouts/SectionWrapper'

// Top Tracks Section
interface TopTracksSectionProps {
  tracks: SpotifyTrack[]
  onClick?: (track: SpotifyTrack) => void
}

export const TopTracksSection: React.FC<TopTracksSectionProps> = ({
  tracks,
  onClick,
}) => {
  const { t } = useTranslation()

  const handleTrackClick = (track: SpotifyTrack) => {
    if (onClick) {
      onClick(track)
    } else {
      // TODO: Implement default navigation
      console.log('Navigate to track:', track.id)
    }
  }

  return (
    <SectionWrapper title={t('search:tracks')}>
      <GridLayout cols={1}>
        {tracks.map((track) => (
          <TrackItem
            key={track.id}
            track={track}
            onClick={() => handleTrackClick(track)}
          />
        ))}
      </GridLayout>
    </SectionWrapper>
  )
}
