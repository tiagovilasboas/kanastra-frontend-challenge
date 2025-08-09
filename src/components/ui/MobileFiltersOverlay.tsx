import { X } from 'lucide-react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export interface SearchTab {
  id: string
  label: string
  isActive?: boolean
}

export interface SearchFilters {
  artistName?: string
  albumName?: string
  genre?: string
  yearFrom?: number
  yearTo?: number
}

export interface MobileFiltersOverlayProps {
  isOpen: boolean
  onClose: () => void
  // Filtros de tipo (Tudo, Artistas, Álbuns, etc.)
  tabs?: SearchTab[]
  onTabChange?: (tabId: string) => void
  // Filtros avançados
  filters?: SearchFilters
  onFiltersChange?: (filters: SearchFilters) => void
  onClearFilters?: () => void
  // Tipo de filtro a mostrar
  mode: 'tabs' | 'advanced' | 'both'
  title?: string
}

export function MobileFiltersOverlay({
  isOpen,
  onClose,
  tabs = [],
  onTabChange,
  filters = {},
  onFiltersChange,
  onClearFilters,
  mode = 'tabs',
  title,
}: MobileFiltersOverlayProps) {
  const { t } = useTranslation()

  // Fechar com ESC e controlar scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const handleFilterChange = (
    key: string,
    value: string | number | undefined,
  ) => {
    if (onFiltersChange) {
      onFiltersChange({
        ...filters,
        [key]: value,
      })
    }
  }

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined && value !== '' && value !== 0,
  )

  const clearAllFilters = () => {
    if (onClearFilters) {
      onClearFilters()
    }
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Overlay Content */}
      <div className="relative z-10 bg-background h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">
            {title || t('search:filters', 'Filtros')}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Filtros de Tipo */}
          {(mode === 'tabs' || mode === 'both') && tabs.length > 0 && (
            <div className="p-4 border-b border-border">
              <h3 className="text-sm font-medium mb-3 text-muted-foreground">
                {t('search:searchType', 'Tipo de busca')}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      onTabChange?.(tab.id)
                      onClose()
                    }}
                    className={`p-3 rounded-lg transition-all duration-200 font-medium text-sm text-left ${
                      tab.isActive
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Filtros Avançados */}
          {(mode === 'advanced' || mode === 'both') && (
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {t('search:advancedFilters', 'Filtros avançados')}
                </h3>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <X className="w-4 h-4 mr-1" />
                    {t('search:clearFilters', 'Limpar')}
                  </Button>
                )}
              </div>

              {/* Filtro por nome do artista */}
              <div className="space-y-2">
                <Label htmlFor="mobile-artistName">
                  {t('search:artistName', 'Nome do Artista')}
                </Label>
                <Input
                  id="mobile-artistName"
                  placeholder={t(
                    'search:artistNamePlaceholder',
                    'Ex: The Beatles',
                  )}
                  value={filters.artistName || ''}
                  onChange={(e) =>
                    handleFilterChange(
                      'artistName',
                      e.target.value || undefined,
                    )
                  }
                  className="h-10"
                />
              </div>

              {/* Filtro por nome do álbum */}
              <div className="space-y-2">
                <Label htmlFor="mobile-albumName">
                  {t('search:albumName', 'Nome do Álbum')}
                </Label>
                <Input
                  id="mobile-albumName"
                  placeholder={t(
                    'search:albumNamePlaceholder',
                    'Ex: Abbey Road',
                  )}
                  value={filters.albumName || ''}
                  onChange={(e) =>
                    handleFilterChange('albumName', e.target.value || undefined)
                  }
                  className="h-10"
                />
              </div>

              {/* Filtro por gênero */}
              <div className="space-y-2">
                <Label htmlFor="mobile-genre">
                  {t('search:genre', 'Gênero')}
                </Label>
                <Select
                  value={filters.genre || ''}
                  onValueChange={(value) =>
                    handleFilterChange('genre', value || undefined)
                  }
                >
                  <SelectTrigger className="h-10">
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

              {/* Filtros por ano */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>{t('search:yearFrom', 'Ano de')}</Label>
                  <Select
                    value={filters.yearFrom?.toString() || ''}
                    onValueChange={(value) =>
                      handleFilterChange(
                        'yearFrom',
                        value ? parseInt(value) : undefined,
                      )
                    }
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue
                        placeholder={t('search:selectYear', 'Selecionar')}
                      />
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
                  <Label>{t('search:yearTo', 'Ano até')}</Label>
                  <Select
                    value={filters.yearTo?.toString() || ''}
                    onValueChange={(value) =>
                      handleFilterChange(
                        'yearTo',
                        value ? parseInt(value) : undefined,
                      )
                    }
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue
                        placeholder={t('search:selectYear', 'Selecionar')}
                      />
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
            </div>
          )}
        </div>

        {/* Footer com botão de aplicar */}
        <div className="p-4 border-t border-border">
          <Button onClick={onClose} className="w-full h-12" size="lg">
            {t('search:applyFilters', 'Aplicar Filtros')}
          </Button>
        </div>
      </div>
    </div>
  )
}
