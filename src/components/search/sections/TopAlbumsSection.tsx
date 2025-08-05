import React from 'react'
import { useTranslation } from 'react-i18next'

import { AlbumItem } from '../items/AlbumItem'
import { GridLayout } from '../layouts/GridLayout'
import { SectionWrapper } from '../layouts/SectionWrapper'

// Top Albums Section
interface TopAlbumsSectionProps {
  albums: any[]
  onClick?: (album: any) => void
}

export const TopAlbumsSection: React.FC<TopAlbumsSectionProps> = ({ albums, onClick }) => {
  const { t } = useTranslation()

  const handleAlbumClick = (album: any) => {
    if (onClick) {
      onClick(album)
    } else {
      // TODO: Implement default navigation
      console.log('Navigate to album:', album.id)
    }
  }

  return (
    <SectionWrapper title={t('search:albums', 'Álbuns')}>
      <GridLayout cols={4}>
        {albums.map((album) => (
          <AlbumItem 
            key={album.id} 
            album={album} 
            onClick={() => handleAlbumClick(album)}
          />
        ))}
      </GridLayout>
    </SectionWrapper>
  )
} 