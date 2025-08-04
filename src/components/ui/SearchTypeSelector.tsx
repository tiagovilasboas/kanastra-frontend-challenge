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

  const allTypes: ('artist' | 'album' | 'track')[] = [
    'artist',
    'album',
    'track',
  ]
  const isAllSelected = allTypes.every((type) => selectedTypes.includes(type))

  const handleTypeToggle = (type: 'artist' | 'album' | 'track') => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type]

    // Ensure at least one type is selected
    if (newTypes.length > 0) {
      onTypesChange(newTypes)
    }
  }

  const handleAllToggle = () => {
    if (isAllSelected) {
      // If all are selected, select only the first one
      onTypesChange([allTypes[0]])
    } else {
      // Select all types
      onTypesChange(allTypes)
    }
  }

  const typeOptions = [
    { value: 'artist' as const, label: t('search:artists', 'Artists') },
    { value: 'album' as const, label: t('search:albums', 'Albums') },
    { value: 'track' as const, label: t('search:tracks', 'Tracks') },
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {/* All button */}
      <Button
        variant={isAllSelected ? 'default' : 'secondary'}
        size="sm"
        onClick={handleAllToggle}
        className={`px-4 py-2 rounded-full transition-all duration-200 font-medium ${
          isAllSelected
            ? 'bg-primary text-primary-foreground shadow-md'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        }`}
      >
        {t('search:all', 'All')}
      </Button>

      {/* Individual type buttons */}
      {typeOptions.map((option) => {
        const isSelected = selectedTypes.includes(option.value)
        return (
          <Button
            key={option.value}
            variant={isSelected ? 'default' : 'secondary'}
            size="sm"
            onClick={() => handleTypeToggle(option.value)}
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
