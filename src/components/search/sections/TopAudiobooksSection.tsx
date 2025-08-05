import React from 'react'
import { useTranslation } from 'react-i18next'

import { AudiobookItem } from '../items/AudiobookItem'
import { GridLayout } from '../layouts/GridLayout'
import { SectionWrapper } from '../layouts/SectionWrapper'

// Top Audiobooks Section
interface TopAudiobooksSectionProps {
  audiobooks: any[]
  onClick?: (audiobook: any) => void
}

export const TopAudiobooksSection: React.FC<TopAudiobooksSectionProps> = ({ audiobooks, onClick }) => {
  const { t } = useTranslation()

  const handleAudiobookClick = (audiobook: any) => {
    if (onClick) {
      onClick(audiobook)
    } else {
      // TODO: Implement default navigation
      console.log('Navigate to audiobook:', audiobook.id)
    }
  }

  return (
    <SectionWrapper title={t('search:audiobooks', 'Audiobooks')}>
      <GridLayout cols={4}>
        {audiobooks.map((audiobook) => (
          <AudiobookItem 
            key={audiobook.id} 
            audiobook={audiobook} 
            onClick={() => handleAudiobookClick(audiobook)}
          />
        ))}
      </GridLayout>
    </SectionWrapper>
  )
} 