import React from 'react'
import { useTranslation } from 'react-i18next'

import { PlaylistItem } from '../items/PlaylistItem'
import { GridLayout } from '../layouts/GridLayout'
import { SectionWrapper } from '../layouts/SectionWrapper'

// Top Playlists Section
interface TopPlaylistsSectionProps {
  playlists: any[]
  onClick?: (playlist: any) => void
}

export const TopPlaylistsSection: React.FC<TopPlaylistsSectionProps> = ({ playlists, onClick }) => {
  const { t } = useTranslation()

  const handlePlaylistClick = (playlist: any) => {
    if (onClick) {
      onClick(playlist)
    } else {
      // TODO: Implement default navigation
      console.log('Navigate to playlist:', playlist.id)
    }
  }

  return (
    <SectionWrapper title={t('search:playlists', 'Playlists')}>
      <GridLayout cols={4}>
        {playlists.map((playlist) => (
          <PlaylistItem 
            key={playlist.id} 
            playlist={playlist} 
            onClick={() => handlePlaylistClick(playlist)}
          />
        ))}
      </GridLayout>
    </SectionWrapper>
  )
} 