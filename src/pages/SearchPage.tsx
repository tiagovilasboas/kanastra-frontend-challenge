import { AlertCircle, Loader2, Search } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { SearchFilters, SearchHeader, SearchResults } from '@/components/search'
import { SearchCategory } from '@/components/search/SearchFilters'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card'
import { getDeviceBasedConfig } from '@/config/searchLimits'
import { useSpotifySearch } from '@/hooks/useSpotifySearch'
import { useSearchStore } from '@/stores/searchStore'
import { SpotifySearchType } from '@/types/spotify'

export const SearchPage: React.FC = () => {
  const { searchQuery } = useSearchStore()

  const { searchState, results, loadMore, filters, setFilters } =
    useSpotifySearch()

  // Convert filters.types to SearchCategory format (single selection)
  const getSelectedCategories = (): SearchCategory[] => {
    const allTypes = [
      SpotifySearchType.ARTIST,
      SpotifySearchType.ALBUM,
      SpotifySearchType.TRACK,
      SpotifySearchType.PLAYLIST,
      SpotifySearchType.SHOW,
      SpotifySearchType.EPISODE,
      SpotifySearchType.AUDIOBOOK,
    ]

    // Check if all types are selected
    const hasAllTypes = allTypes.every((type) => filters.types.includes(type))

    if (hasAllTypes) {
      return ['all']
    }

    // Return the first selected type (for single selection)
    return [(filters.types[0] as SearchCategory) || 'all']
  }

  const selectedCategories = getSelectedCategories()

  const handleCategoriesChange = (categories: SearchCategory[]) => {
    // Convert SearchCategory back to filters.types format (single selection)
    const selectedCategory = categories[0] || 'all'
    let types: SpotifySearchType[]

    if (selectedCategory === 'all') {
      types = [
        SpotifySearchType.ARTIST,
        SpotifySearchType.ALBUM,
        SpotifySearchType.TRACK,
        SpotifySearchType.PLAYLIST,
        SpotifySearchType.SHOW,
        SpotifySearchType.EPISODE,
        SpotifySearchType.AUDIOBOOK,
      ]
    } else {
      types = [selectedCategory as SpotifySearchType]
    }

    setFilters({ ...filters, types })
  }

  // Check if there are any results to show
  const hasResults =
    results.artists.items.length > 0 ||
    results.albums.items.length > 0 ||
    results.tracks.items.length > 0 ||
    results.playlists.items.length > 0 ||
    results.shows.items.length > 0 ||
    results.episodes.items.length > 0 ||
    results.audiobooks.items.length > 0

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Header */}
        <SearchHeader searchQuery={searchQuery} />

        {/* Search Filters - Only show when there's a search query */}
        {searchQuery && (
          <SearchFilters
            selectedCategories={selectedCategories}
            onCategoriesChange={handleCategoriesChange}
          />
        )}

        {/* Search Results */}
        {searchQuery ? (
          <div className="space-y-8">
            {searchState.isLoading ? (
              <SearchLoadingState selectedCategories={selectedCategories} />
            ) : searchState.error ? (
              <SearchErrorState error={searchState.error} />
            ) : hasResults ? (
              <>
                <SearchResults selectedCategories={selectedCategories} />
                <LoadMoreButton
                  hasMore={searchState.hasMore}
                  isLoadingMore={searchState.isLoadingMore}
                  selectedCategories={selectedCategories}
                  onLoadMore={loadMore}
                />
              </>
            ) : (
              <NoResultsCard
                searchQuery={searchQuery}
                isLoading={searchState.isLoading}
                hasError={!!searchState.error}
              />
            )}
          </div>
        ) : (
          <WelcomeCard />
        )}
      </div>
    </div>
  )
}

// Loading State Component
const SearchLoadingState: React.FC<{
  selectedCategories: SearchCategory[]
}> = ({ selectedCategories }) => {
  const { t } = useTranslation()
  const selectedCategory = selectedCategories[0] || 'all'

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        <span className="text-lg font-medium text-muted-foreground">
          {t('search:searching', 'Searching')}
          {t('search:space', ' ')}
          {selectedCategory === 'all'
            ? t('search:all', 'All')
            : t(`search:${selectedCategory}`, selectedCategory)}
          {t('search:ellipsis', '...')}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className="aspect-square animate-pulse rounded-lg bg-muted"
          />
        ))}
      </div>
    </div>
  )
}

// Error State Component
const SearchErrorState: React.FC<{ error: string }> = ({ error }) => {
  const { t } = useTranslation()

  return (
    <Card className="border-destructive/50 bg-destructive/5">
      <CardContent className="flex items-center gap-3 p-6">
        <AlertCircle className="h-5 w-5 text-destructive" />
        <div>
          <h3 className="font-semibold text-destructive">
            {t('search:errorTitle', 'Erro na busca')}
          </h3>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </CardContent>
    </Card>
  )
}

// Load More Button Component
const LoadMoreButton: React.FC<{
  hasMore: boolean
  isLoadingMore: boolean
  selectedCategories: SearchCategory[]
  onLoadMore: () => void
}> = ({ hasMore, isLoadingMore, selectedCategories, onLoadMore }) => {
  const { t } = useTranslation()
  const { results } = useSpotifySearch()
  const selectedCategory = selectedCategories[0] || 'all'

  // Calculate total results from selected categories
  const getTotalResults = () => {
    if (selectedCategory === 'all') {
      return (
        results.artists.total +
        results.albums.total +
        results.tracks.total +
        results.playlists.total +
        results.shows.total +
        results.episodes.total +
        results.audiobooks.total
      )
    }

    switch (selectedCategory) {
      case 'artist':
        return results.artists.total
      case 'album':
        return results.albums.total
      case 'track':
        return results.tracks.total
      case 'playlist':
        return results.playlists.total
      case 'show':
        return results.shows.total
      case 'episode':
        return results.episodes.total
      case 'audiobook':
        return results.audiobooks.total
      default:
        return 0
    }
  }

  const totalResults = getTotalResults()
  const hasResults = totalResults > 0
  // Usa a configuração parametrizável de limites com detecção de dispositivo
  const config = getDeviceBasedConfig()
  const limit =
    config[selectedCategory as keyof typeof config] || config.default
  // Não mostra o botão "Carregar mais" quando "tudo" está selecionado
  const shouldShowButton =
    selectedCategory !== 'all' && hasMore && hasResults && totalResults > limit

  if (!shouldShowButton) return null

  return (
    <div className="flex justify-center">
      <Button
        onClick={onLoadMore}
        disabled={isLoadingMore}
        variant="outline"
        className="min-w-[120px]"
      >
        {isLoadingMore ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t('search:loadingMore', 'Loading...')}
          </>
        ) : (
          t('search:loadMore', 'Load more')
        )}
      </Button>
    </div>
  )
}

// No Results Card Component
const NoResultsCard: React.FC<{
  searchQuery: string
  isLoading: boolean
  hasError: boolean
}> = ({ searchQuery, isLoading, hasError }) => {
  const { t } = useTranslation()

  if (isLoading || hasError) return null

  return (
    <Card className="text-center">
      <CardContent className="p-8">
        <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <CardTitle className="text-xl mb-2">
          {t('search:noResultsTitle', 'Nenhum resultado encontrado')}
        </CardTitle>
        <CardDescription>
          {t(
            'search:noResultsDescription',
            'Não encontramos resultados para "{{query}}". Tente com outras palavras-chave.',
            {
              query: searchQuery,
            },
          )}
        </CardDescription>
      </CardContent>
    </Card>
  )
}

// Welcome Card Component
const WelcomeCard: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Card className="text-center">
      <CardContent className="p-8">
        <Search className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <CardTitle className="text-2xl mb-2">
          {t('search:welcomeTitle', 'O que você quer ouvir hoje?')}
        </CardTitle>
        <CardDescription className="text-lg">
          {t(
            'search:welcomeDescription',
            'Procure por artistas, álbuns, músicas, playlists e muito mais.',
          )}
        </CardDescription>
      </CardContent>
    </Card>
  )
}
