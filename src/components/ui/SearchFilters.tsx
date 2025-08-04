import React from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'

export type SearchFilterType = 'all' | 'artists' | 'tracks' | 'albums'

interface SearchFiltersProps {
  activeFilter: SearchFilterType
  onFilterChange: (filter: SearchFilterType) => void
  hasArtists: boolean
  hasTracks: boolean
  hasAlbums: boolean
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  activeFilter,
  onFilterChange,
  hasArtists,
  hasTracks,
  hasAlbums,
}) => {
  const { t } = useTranslation()

  const filters = [
    {
      key: 'all' as const,
      label: t('search:filters.all', 'All'),
      count: (hasArtists ? 1 : 0) + (hasTracks ? 1 : 0) + (hasAlbums ? 1 : 0),
    },
    {
      key: 'artists' as const,
      label: t('search:filters.artists', 'Artists'),
      count: hasArtists ? 1 : 0,
    },
    {
      key: 'tracks' as const,
      label: t('search:filters.tracks', 'Tracks'),
      count: hasTracks ? 1 : 0,
    },
    {
      key: 'albums' as const,
      label: t('search:filters.albums', 'Albums'),
      count: hasAlbums ? 1 : 0,
    },
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <Button
          key={filter.key}
          variant={activeFilter === filter.key ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterChange(filter.key)}
          className="rounded-full px-4 py-2 text-sm font-medium transition-colors"
          disabled={filter.count === 0}
        >
          {filter.label}
          {filter.count > 0 && (
            <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">
              {filter.count}
            </span>
          )}
        </Button>
      ))}
    </div>
  )
}
