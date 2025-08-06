import { Filter, X } from 'lucide-react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface SearchFiltersProps {
  filters: {
    artistName?: string
    albumName?: string
    genre?: string
    yearFrom?: number
    yearTo?: number
  }
  onFiltersChange: (filters: {
    artistName?: string
    albumName?: string
    genre?: string
    yearFrom?: number
    yearTo?: number
  }) => void
  onClearFilters: () => void
  className?: string
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  className = '',
}) => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const handleFilterChange = (
    key: string,
    value: string | number | undefined,
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    })
  }

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined && value !== '' && value !== 0,
  )

  const clearAllFilters = () => {
    onClearFilters()
    setIsOpen(false)
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i)

  const genres = [
    'rock',
    'pop',
    'hip-hop',
    'jazz',
    'classical',
    'electronic',
    'country',
    'folk',
    'r&b',
    'reggae',
    'blues',
    'metal',
    'punk',
    'indie',
    'alternative',
    'dance',
    'latin',
    'world',
    'soundtrack',
    'comedy',
    'children',
    'new-age',
    'religious',
  ]

  return (
    <div
      className={`flex items-center gap-2 ${className}`}
      data-testid="search-filters"
    >
      {/* Botão de filtros */}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant={hasActiveFilters ? 'default' : 'outline'}
            size="sm"
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            {t('search:filters', 'Filtros')}
            {hasActiveFilters && (
              <div className="h-2 w-2 rounded-full bg-white" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80 p-4" align="start">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">
                {t('search:searchFilters', 'Filtros de Busca')}
              </h3>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="h-6 px-2 text-xs"
                >
                  <X className="h-3 w-3 mr-1" />
                  {t('search:clearAll', 'Limpar')}
                </Button>
              )}
            </div>

            {/* Filtro por nome do artista */}
            <div className="space-y-2">
              <Label htmlFor="artistName">
                {t('search:artistName', 'Nome do Artista')}
              </Label>
              <Input
                id="artistName"
                placeholder={t('search:artistNamePlaceholder', 'Ex: Beatles')}
                value={filters.artistName || ''}
                onChange={(e) =>
                  handleFilterChange('artistName', e.target.value || undefined)
                }
                className="h-8"
              />
            </div>

            {/* Filtro por nome do álbum */}
            <div className="space-y-2">
              <Label htmlFor="albumName">
                {t('search:albumName', 'Nome do Álbum')}
              </Label>
              <Input
                id="albumName"
                placeholder={t('search:albumNamePlaceholder', 'Ex: Abbey Road')}
                value={filters.albumName || ''}
                onChange={(e) =>
                  handleFilterChange('albumName', e.target.value || undefined)
                }
                className="h-8"
              />
            </div>

            {/* Filtro por gênero */}
            <div className="space-y-2">
              <Label htmlFor="genre">{t('search:genre', 'Gênero')}</Label>
              <Select
                value={filters.genre || ''}
                onValueChange={(value) =>
                  handleFilterChange('genre', value || undefined)
                }
              >
                <SelectTrigger className="h-8">
                  <SelectValue
                    placeholder={t('search:selectGenre', 'Selecionar gênero')}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">
                    {t('search:allGenres', 'Todos os gêneros')}
                  </SelectItem>
                  {genres.map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      {t(`genres:${genre}`, genre)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtro por ano */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="yearFrom">
                  {t('search:yearFrom', 'Ano de')}
                </Label>
                <Select
                  value={filters.yearFrom?.toString() || ''}
                  onValueChange={(value) =>
                    handleFilterChange(
                      'yearFrom',
                      value ? parseInt(value) : undefined,
                    )
                  }
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder={t('search:selectYear', 'Ano')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">
                      {t('search:anyYear', 'Qualquer ano')}
                    </SelectItem>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearTo">{t('search:yearTo', 'Ano até')}</Label>
                <Select
                  value={filters.yearTo?.toString() || ''}
                  onValueChange={(value) =>
                    handleFilterChange(
                      'yearTo',
                      value ? parseInt(value) : undefined,
                    )
                  }
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder={t('search:selectYear', 'Ano')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">
                      {t('search:anyYear', 'Qualquer ano')}
                    </SelectItem>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Botões de ação */}
            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => setIsOpen(false)}
                className="flex-1"
                size="sm"
              >
                {t('search:applyFilters', 'Aplicar')}
              </Button>
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearAllFilters} size="sm">
                  {t('search:clear', 'Limpar')}
                </Button>
              )}
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Indicador de filtros ativos */}
      {hasActiveFilters && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>{t('search:activeFilters', 'Filtros ativos')}</span>
        </div>
      )}
    </div>
  )
}
