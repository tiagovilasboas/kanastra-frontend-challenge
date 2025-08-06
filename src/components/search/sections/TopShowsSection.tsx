import React from 'react'
import { useTranslation } from 'react-i18next'

import { SpotifyShow } from '@/types/spotify'

import { ShowItem } from '../items/ShowItem'
import { GridLayout } from '../layouts/GridLayout'
import { SectionWrapper } from '../layouts/SectionWrapper'

// Top Shows Section
interface TopShowsSectionProps {
  shows: SpotifyShow[]
  onClick?: (show: SpotifyShow) => void
}

export const TopShowsSection: React.FC<TopShowsSectionProps> = ({
  shows,
  onClick,
}) => {
  const { t } = useTranslation()

  const handleShowClick = (show: SpotifyShow) => {
    if (onClick) {
      onClick(show)
    } else {
      // TODO: Implement default navigation
      console.log('Navigate to show:', show.id)
    }
  }

  return (
    <SectionWrapper title={t('search:shows')}>
      <GridLayout cols={4}>
        {shows.map((show) => (
          <ShowItem
            key={show.id}
            show={show}
            onClick={() => handleShowClick(show)}
          />
        ))}
      </GridLayout>
    </SectionWrapper>
  )
}
