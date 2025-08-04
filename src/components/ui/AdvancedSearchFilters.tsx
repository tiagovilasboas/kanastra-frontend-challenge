import { Filter, X } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { SEARCH_FILTER_OPTIONS, SearchFilters } from '@/types/search'

import { Button } from './button'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Checkbox } from './checkbox'
import { Input } from './input'
import { Label } from './label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select'
import { Separator } from './separator'
import { Slider } from './slider'

interface AdvancedSearchFiltersProps {
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
  isOpen: boolean
  onToggle: () => void
}

export const AdvancedSearchFilters: React.FC<AdvancedSearchFiltersProps> = ({
  filters,
  onFiltersChange,
  isOpen,
  onToggle,
}) => {
  const { t } = useTranslation()

  const updateFilters = (updates: Partial<SearchFilters>) => {
    onFiltersChange({ ...filters, ...updates })
  }

  const clearFilters = () => {
    onFiltersChange({
      types: ['artist'],
      genres: [],
      yearFrom: undefined,
      yearTo: undefined,
      popularityFrom: undefined,
      popularityTo: undefined,
      market: undefined,
      includeExplicit: false,
      includeExternal: false,
    })
  }

  const toggleType = (type: 'artist' | 'album' | 'track') => {
    const newTypes = filters.types.includes(type)
      ? filters.types.filter((t) => t !== type)
      : [...filters.types, type]

    // Ensure at least one type is selected
    if (newTypes.length > 0) {
      updateFilters({ types: newTypes })
    }
  }

  const toggleGenre = (genre: string) => {
    const newGenres = filters.genres?.includes(genre)
      ? filters.genres.filter((g) => g !== genre)
      : [...(filters.genres || []), genre]

    updateFilters({ genres: newGenres })
  }

  const activeFiltersCount = [
    filters.types.length > 1 ? 1 : 0,
    filters.genres?.length || 0,
    filters.yearFrom || filters.yearTo ? 1 : 0,
    filters.popularityFrom || filters.popularityTo ? 1 : 0,
    filters.market ? 1 : 0,
    filters.includeExplicit ? 1 : 0,
    filters.includeExternal ? 1 : 0,
  ].reduce((sum, count) => sum + count, 0)

  return (
    <div className="space-y-4">
      {/* Toggle Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={onToggle}
        className="flex items-center gap-2"
      >
        <Filter className="w-4 h-4" />
        {t('search:advancedFilters', 'Filtros Avançados')}
        {activeFiltersCount > 0 && (
          <span className="ml-1 rounded-full bg-primary text-primary-foreground px-2 py-0.5 text-xs">
            {activeFiltersCount}
          </span>
        )}
      </Button>

      {/* Filters Panel */}
      {isOpen && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {t('search:advancedFilters', 'Filtros Avançados')}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search Types */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                {t('search:searchTypes', 'Tipos de Busca')}
              </Label>
              <div className="flex flex-wrap gap-2">
                {SEARCH_FILTER_OPTIONS.types.map((type) => (
                  <div key={type.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`type-${type.value}`}
                      checked={filters.types.includes(
                        type.value as 'artist' | 'album' | 'track',
                      )}
                      onCheckedChange={() =>
                        toggleType(type.value as 'artist' | 'album' | 'track')
                      }
                    />
                    <Label
                      htmlFor={`type-${type.value}`}
                      className="text-sm cursor-pointer"
                    >
                      {type.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Genres */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                {t('search:genres', 'Gêneros')}
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {SEARCH_FILTER_OPTIONS.genres.map((genre) => (
                  <div key={genre} className="flex items-center space-x-2">
                    <Checkbox
                      id={`genre-${genre}`}
                      checked={filters.genres?.includes(genre) || false}
                      onCheckedChange={() => toggleGenre(genre)}
                    />
                    <Label
                      htmlFor={`genre-${genre}`}
                      className="text-sm cursor-pointer capitalize"
                    >
                      {genre}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Year Range */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                {t('search:yearRange', 'Ano de Lançamento')}
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="De"
                  value={filters.yearFrom || ''}
                  onChange={(e) =>
                    updateFilters({
                      yearFrom: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                  className="w-20"
                  min="1900"
                  max="2030"
                />
                <span className="text-muted-foreground">
                  {t('search:rangeSeparator', '-')}
                </span>
                <Input
                  type="number"
                  placeholder="Até"
                  value={filters.yearTo || ''}
                  onChange={(e) =>
                    updateFilters({
                      yearTo: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                  className="w-20"
                  min="1900"
                  max="2030"
                />
              </div>
            </div>

            <Separator />

            {/* Popularity Range */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                {t('search:popularityRange', 'Popularidade')}
              </Label>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{t('search:popularityMin', '0')}</span>
                  <span>{t('search:popularityMax', '100')}</span>
                </div>
                <Slider
                  value={[
                    filters.popularityFrom || 0,
                    filters.popularityTo || 100,
                  ]}
                  onValueChange={([from, to]) =>
                    updateFilters({
                      popularityFrom: from,
                      popularityTo: to,
                    })
                  }
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs">
                  <span>{filters.popularityFrom || 0}</span>
                  <span>{filters.popularityTo || 100}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Market */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                {t('search:market', 'Mercado')}
              </Label>
              <Select
                value={filters.market || ''}
                onValueChange={(value) =>
                  updateFilters({ market: value || undefined })
                }
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t('search:selectMarket', 'Selecionar mercado')}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">
                    {t('search:allMarkets', 'Todos os mercados')}
                  </SelectItem>
                  {SEARCH_FILTER_OPTIONS.markets.map((market) => (
                    <SelectItem key={market.value} value={market.value}>
                      {market.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Content Filters */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                {t('search:contentFilters', 'Filtros de Conteúdo')}
              </Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-explicit"
                    checked={filters.includeExplicit || false}
                    onCheckedChange={(checked) =>
                      updateFilters({ includeExplicit: checked === true })
                    }
                  />
                  <Label
                    htmlFor="include-explicit"
                    className="text-sm cursor-pointer"
                  >
                    {t('search:includeExplicit', 'Incluir conteúdo explícito')}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-external"
                    checked={filters.includeExternal || false}
                    onCheckedChange={(checked) =>
                      updateFilters({ includeExternal: checked === true })
                    }
                  />
                  <Label
                    htmlFor="include-external"
                    className="text-sm cursor-pointer"
                  >
                    {t('search:includeExternal', 'Incluir dados externos')}
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
