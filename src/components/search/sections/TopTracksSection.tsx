import React from 'react'
import { useTranslation } from 'react-i18next'

import { TrackItem } from '../items/TrackItem'
import { ListLayout } from '../layouts/ListLayout'
import { SectionWrapper } from '../layouts/SectionWrapper'

// Top Tracks Section
interface TopTracksSectionProps {
  tracks: any[]
  onClick?: (track: any) => void
}

export const TopTracksSection: React.FC<TopTracksSectionProps> = ({ tracks, onClick }) => {
  const { t } = useTranslation()

  const handleTrackClick = (track: any) => {
    if (onClick) {
      onClick(track)
    } else {
      // TODO: Implement default navigation
      console.log('Navigate to track:', track.id)
    }
  }

  return (
    <SectionWrapper title={t('search:tracks', 'Músicas')}>
      <ListLayout>
        {tracks.map((track) => (
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