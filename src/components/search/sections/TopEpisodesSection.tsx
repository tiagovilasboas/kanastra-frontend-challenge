import React from 'react'
import { useTranslation } from 'react-i18next'

import { EpisodeItem } from '../items/EpisodeItem'
import { GridLayout } from '../layouts/GridLayout'
import { SectionWrapper } from '../layouts/SectionWrapper'

// Top Episodes Section
interface TopEpisodesSectionProps {
  episodes: any[]
  onClick?: (episode: any) => void
}

export const TopEpisodesSection: React.FC<TopEpisodesSectionProps> = ({ episodes, onClick }) => {
  const { t } = useTranslation()

  const handleEpisodeClick = (episode: any) => {
    if (onClick) {
      onClick(episode)
    } else {
      // TODO: Implement default navigation
      console.log('Navigate to episode:', episode.id)
    }
  }

  return (
    <SectionWrapper title={t('search:episodes', 'Episódios')}>
      <GridLayout cols={4}>
        {episodes.map((episode) => (
          <EpisodeItem 
            key={episode.id} 
            episode={episode} 
            onClick={() => handleEpisodeClick(episode)}
          />
        ))}
      </GridLayout>
    </SectionWrapper>
  )
} 