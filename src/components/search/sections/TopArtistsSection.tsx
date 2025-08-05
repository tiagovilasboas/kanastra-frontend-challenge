import React from 'react'
import { useTranslation } from 'react-i18next'

import { ArtistItem } from '../items/ArtistItem'
import { GridLayout } from '../layouts/GridLayout'
import { SectionWrapper } from '../layouts/SectionWrapper'

// Top Artists Section
interface TopArtistsSectionProps {
  artists: any[]
  onClick?: (artist: any) => void
}

export const TopArtistsSection: React.FC<TopArtistsSectionProps> = ({ artists, onClick }) => {
  const { t } = useTranslation()

  const handleArtistClick = (artist: any) => {
    if (onClick) {
      onClick(artist)
    } else {
      // TODO: Implement default navigation
      console.log('Navigate to artist:', artist.id)
    }
  }

  return (
    <SectionWrapper title={t('search:artists', 'Artistas')}>
      <GridLayout cols={3}>
        {artists.map((artist) => (
          <ArtistItem 
            key={artist.id} 
            artist={artist} 
            onClick={() => handleArtistClick(artist)}
          />
        ))}
      </GridLayout>
    </SectionWrapper>
  )
} 