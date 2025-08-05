import React from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from './button'

interface SearchTypeSelectorProps {
  selectedTypes: ('artist' | 'album' | 'track')[]
  onTypesChange: (types: ('artist' | 'album' | 'track')[]) => void
}

export const SearchTypeSelector: React.FC<SearchTypeSelectorProps> = ({
  selectedTypes,
  onTypesChange,
}) => {
  const { t } = useTranslation()

  const handleTypeSelect = (type: 'artist' | 'album' | 'track') => {
    // Checkbox behavior: toggle the selected type
    if (selectedTypes.includes(type)) {
      // Remove type if already selected (but ensure at least one remains)
      if (selectedTypes.length > 1) {
        onTypesChange(selectedTypes.filter((t) => t !== type))
      }
    } else {
      // Add type if not selected
      onTypesChange([...selectedTypes, type])
    }
  }

  const typeOptions = [
    { value: 'artist' as const, label: t('search:artists', 'Artists') },
    { value: 'album' as const, label: t('search:albums', 'Albums') },
    { value: 'track' as const, label: t('search:tracks', 'Tracks') },
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {typeOptions.map((option) => {
        const isSelected = selectedTypes.includes(option.value)
        return (
          <Button
            key={option.value}
            variant={isSelected ? 'default' : 'secondary'}
            size="sm"
            onClick={() => handleTypeSelect(option.value)}
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
