import React from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { SpotifySearchType } from '@/types/spotify'

// Tipos suportados pela API do Spotify conforme documentação
export type SearchCategory = 'all' | SpotifySearchType

interface SearchFiltersProps {
  selectedCategories: SearchCategory[]
  onCategoriesChange: (categories: SearchCategory[]) => void
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  selectedCategories,
  onCategoriesChange,
}) => {
  const { t } = useTranslation()

  const handleCategorySelect = (category: SearchCategory) => {
    // Radio behavior: select only one category at a time
    onCategoriesChange([category])
  }

  const categoryOptions = [
    { value: 'all' as const, label: 'Tudo' },
    { value: SpotifySearchType.ALBUM, label: t('search:albums', 'Álbuns') },
    { value: SpotifySearchType.ARTIST, label: t('search:artists', 'Artistas') },
    { value: SpotifySearchType.PLAYLIST, label: t('search:playlists', 'Playlists') },
    { value: SpotifySearchType.TRACK, label: t('search:tracks', 'Músicas') },
    { value: SpotifySearchType.SHOW, label: t('search:shows', 'Podcasts e programas') },
    { value: SpotifySearchType.EPISODE, label: t('search:episodes', 'Episódios') },
    { value: SpotifySearchType.AUDIOBOOK, label: t('search:audiobooks', 'Audiobooks') },
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {categoryOptions.map((option) => {
        const isSelected = selectedCategories.includes(option.value)
        
        return (
          <Button
            key={option.value}
            variant={isSelected ? 'default' : 'secondary'}
            size="sm"
            onClick={() => handleCategorySelect(option.value)}
            className={`px-4 py-2 rounded-full transition-all duration-200 font-medium ${
              isSelected
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {option.label}
          </Button>
        )
      })}
    </div>
  )
} 