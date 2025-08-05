import React from 'react'
import { useTranslation } from 'react-i18next'

import { ShowItem } from '../items/ShowItem'
import { GridLayout } from '../layouts/GridLayout'
import { SectionWrapper } from '../layouts/SectionWrapper'

// Top Shows Section
interface TopShowsSectionProps {
  shows: any[]
  onClick?: (show: any) => void
}

export const TopShowsSection: React.FC<TopShowsSectionProps> = ({ shows, onClick }) => {
  const { t } = useTranslation()

  const handleShowClick = (show: any) => {
    if (onClick) {
      onClick(show)
    } else {
      // TODO: Implement default navigation
      console.log('Navigate to show:', show.id)
    }
  }

  return (
    <SectionWrapper title={t('search:shows', 'Podcasts e programas')}>
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