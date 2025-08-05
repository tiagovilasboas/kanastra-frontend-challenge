import React from 'react'
import { useTranslation } from 'react-i18next'

import { AudiobookCard } from '@/components/ui'
import { SpotifyAudiobook } from '@/types/spotify'

interface AudiobooksSectionProps {
  audiobooks: SpotifyAudiobook[]
  isLoading?: boolean
}

export const AudiobooksSection: React.FC<AudiobooksSectionProps> = ({
  audiobooks,
  isLoading = false,
}) => {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          {t('search:audiobooks', 'Audiobooks')}
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="aspect-square animate-pulse rounded-lg bg-muted"
            />
          ))}
        </div>
      </div>
    )
  }

  if (audiobooks.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">
        {t('search:audiobooks', 'Audiobooks')}
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {audiobooks
          .filter((audiobook) => audiobook && audiobook.id) // Filter out null/undefined items
          .map((audiobook) => (
            <AudiobookCard
              key={audiobook.id}
              audiobook={audiobook}
              onClick={() => {
                // TODO: Implement audiobook navigation
                console.log('Navigate to audiobook:', audiobook.id)
              }}
            />
          ))}
      </div>
    </div>
  )
} 