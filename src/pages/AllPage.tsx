import {
  BookOpen,
  Disc3,
  Mic,
  Music,
  Play,
  SearchIcon,
  User,
} from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

// Import segmented components
import {
  TopAlbumsSection,
  TopArtistsSection,
  TopAudiobooksSection,
  TopEpisodesSection,
  TopPlaylistsSection,
  TopShowsSection,
  TopTracksSection,
} from '@/components/search/sections'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useSpotifySearch } from '@/hooks/useSpotifySearch'
import { useSearchStore } from '@/stores/searchStore'

export const AllPage: React.FC = () => {
  const { t } = useTranslation()
  const { searchQuery } = useSearchStore()

  const { searchState, results, loadMore } = useSpotifySearch()

  // Calculate total results from all categories
  const totalResults =
    results.artists.total +
    results.albums.total +
    results.tracks.total +
    results.playlists.total +
    results.shows.total +
    results.episodes.total +
    results.audiobooks.total

  // Get the best result (highest popularity or most relevant)
  const getBestResult = () => {
    const allResults = [
      ...results.artists.items.map((item) => ({
        ...item,
        type: 'artist' as const,
      })),
      ...results.albums.items.map((item) => ({
        ...item,
        type: 'album' as const,
      })),
      ...results.tracks.items.map((item) => ({
        ...item,
        type: 'track' as const,
      })),
      ...results.playlists.items.map((item) => ({
        ...item,
        type: 'playlist' as const,
      })),
      ...results.shows.items.map((item) => ({
        ...item,
        type: 'show' as const,
      })),
      ...results.episodes.items.map((item) => ({
        ...item,
        type: 'episode' as const,
      })),
      ...results.audiobooks.items.map((item) => ({
        ...item,
        type: 'audiobook' as const,
      })),
    ]

    // Sort by popularity or relevance
    return allResults.sort((a, b) => {
      const aPopularity = 'popularity' in a ? a.popularity || 0 : 0
      const bPopularity = 'popularity' in b ? b.popularity || 0 : 0
      return bPopularity - aPopularity
    })[0]
  }

  const bestResult = getBestResult()

  if (!searchQuery.trim()) {
    return <WelcomeState />
  }

  if (searchState.isLoading) {
    return <LoadingState />
  }

  if (searchState.error) {
    return <ErrorState error={searchState.error} />
  }

  if (totalResults === 0) {
    return <NoResultsState searchQuery={searchQuery} />
  }

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Results Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SearchIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {t('search:showingResults', 'Mostrando {{count}} resultados', {
                count: totalResults,
              })}
            </span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Best Result */}
          <div className="lg:col-span-1">
            {bestResult && <BestResultCard result={bestResult} />}
          </div>

          {/* Right Column - Top Results by Category */}
          <div className="lg:col-span-2 space-y-6">
            {/* Top Tracks */}
            {results.tracks.items.length > 0 && (
              <TopTracksSection tracks={results.tracks.items.slice(0, 4)} />
            )}

            {/* Top Artists */}
            {results.artists.items.length > 0 && (
              <TopArtistsSection artists={results.artists.items.slice(0, 6)} />
            )}

            {/* Top Albums */}
            {results.albums.items.length > 0 && (
              <TopAlbumsSection albums={results.albums.items.slice(0, 4)} />
            )}

            {/* Top Playlists */}
            {results.playlists.items.length > 0 && (
              <TopPlaylistsSection
                playlists={results.playlists.items.slice(0, 4)}
              />
            )}

            {/* Top Shows */}
            {results.shows.items.length > 0 && (
              <TopShowsSection shows={results.shows.items.slice(0, 4)} />
            )}

            {/* Top Episodes */}
            {results.episodes.items.length > 0 && (
              <TopEpisodesSection
                episodes={results.episodes.items.slice(0, 4)}
              />
            )}

            {/* Top Audiobooks */}
            {results.audiobooks.items.length > 0 && (
              <TopAudiobooksSection
                audiobooks={results.audiobooks.items.slice(0, 4)}
              />
            )}
          </div>
        </div>

        {/* Load More Button */}
        {searchState.hasMore && (
          <div className="flex justify-center pt-6">
            <Button
              onClick={loadMore}
              disabled={searchState.isLoadingMore}
              variant="outline"
              className="min-w-[120px]"
            >
              {searchState.isLoadingMore ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {t('search:loadingMore', 'Carregando...')}
                </>
              ) : (
                t('search:loadMore', 'Carregar mais')
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

// Best Result Card Component
const BestResultCard: React.FC<{ result: Record<string, unknown> }> = ({
  result,
}) => {
  const { t } = useTranslation()

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'artist':
        return <User className="h-4 w-4" />
      case 'album':
        return <Disc3 className="h-4 w-4" />
      case 'track':
        return <Music className="h-4 w-4" />
      case 'playlist':
        return <Music className="h-4 w-4" />
      case 'show':
        return <Mic className="h-4 w-4" />
      case 'episode':
        return <Play className="h-4 w-4" />
      case 'audiobook':
        return <BookOpen className="h-4 w-4" />
      default:
        return <Music className="h-4 w-4" />
    }
  }

  const getResultType = (type: string) => {
    switch (type) {
      case 'artist':
        return t('search:artist', 'Artista')
      case 'album':
        return t('search:album', 'Álbum')
      case 'track':
        return t('search:track', 'Música')
      case 'playlist':
        return t('search:playlist', 'Playlist')
      case 'show':
        return t('search:show', 'Podcast')
      case 'episode':
        return t('search:episode', 'Episódio')
      case 'audiobook':
        return t('search:audiobook', 'Audiobook')
      default:
        return t('search:result', 'Resultado')
    }
  }

  const handleClick = () => {
    // TODO: Implement navigation based on result type
    console.log('Navigate to:', result.type, result.id)
  }

  return (
    <Card
      className="overflow-hidden hover:bg-accent/50 transition-colors cursor-pointer"
      onClick={handleClick}
    >
      <CardContent className="p-0">
        <div className="aspect-square relative">
          {result.images && Array.isArray(result.images) && result.images[0] ? (
            <img
              src={(result.images[0] as { url: string }).url}
              alt={String(result.name || '')}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              {getResultIcon(result.type as string)}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
              {getResultIcon(result.type as string)}
              <span>{getResultType(result.type as string)}</span>
            </div>
            <h3 className="text-white font-semibold text-lg line-clamp-2">
              {result.name as string}
            </h3>
            {/* Temporarily commented out due to TypeScript issues
            {result.artists && Array.isArray(result.artists) && (
              <p className="text-white/80 text-sm mt-1">
                Artist names would be displayed here
              </p>
            )}
            */}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Welcome State Component
const WelcomeState: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12">
          <SearchIcon className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {t('search:welcomeTitle', 'O que você quer ouvir hoje?')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t(
              'search:welcomeDescription',
              'Procure por artistas, álbuns, músicas, playlists e muito mais.',
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

// Loading State Component
const LoadingState: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4" />
          <p className="text-lg text-muted-foreground">
            {t('search:searching', 'Procurando...')}
          </p>
        </div>
      </div>
    </div>
  )
}

// Error State Component
const ErrorState: React.FC<{ error: string }> = ({ error }) => {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="flex items-center gap-3 p-6">
            <div className="h-5 w-5 rounded-full bg-destructive" />
            <div>
              <h3 className="font-semibold text-destructive">
                {t('search:errorTitle', 'Erro na busca')}
              </h3>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// No Results State Component
const NoResultsState: React.FC<{ searchQuery: string }> = ({ searchQuery }) => {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12">
          <SearchIcon className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-xl font-bold text-foreground mb-2">
            {t('search:noResultsTitle', 'Nenhum resultado encontrado')}
          </h1>
          <p className="text-muted-foreground">
            {t(
              'search:noResultsDescription',
              'Não encontramos resultados para "{{query}}". Tente com outras palavras-chave.',
              {
                query: searchQuery,
              },
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
