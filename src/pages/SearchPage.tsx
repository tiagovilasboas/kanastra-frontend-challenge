import { AlertCircle, Loader2, Search } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

import {
  AlbumsSection,
  ArtistsSection,
  EpisodesSection,
  PlaylistsSection,
  SearchHeader,
  ShowsSection,
} from '@/components/search'
import {
  BestResultCard,
  SearchResultsLayout,
  TracksListSection,
} from '@/components/ui'
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card'
import { SearchTab } from '@/components/ui/SearchTabs'
import { useSpotifySearch } from '@/hooks/useSpotifySearch'
import { useSearchStore } from '@/stores/searchStore'

export const SearchPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { searchQuery } = useSearchStore()

  const { searchState, results } = useSpotifySearch()

  // Check if there are any results to show
  const hasResults =
    results.artists.items.length > 0 ||
    results.albums.items.length > 0 ||
    results.tracks.items.length > 0 ||
    results.playlists.items.length > 0 ||
    results.shows.items.length > 0 ||
    results.episodes.items.length > 0 ||
    results.audiobooks.items.length > 0

  const handleSectionClick = (type: string) => {
    const queryParams = new URLSearchParams({
      q: searchQuery,
      market: 'BR',
    })
    navigate(`/search/${type}?${queryParams.toString()}`)
  }

  // Tabs configuration
  const tabs: SearchTab[] = [
    { id: 'all', label: t('search:all', 'Tudo'), isActive: true },
    { id: 'playlist', label: t('search:playlists', 'Playlists') },
    { id: 'track', label: t('search:tracks', 'Músicas') },
    { id: 'artist', label: t('search:artists', 'Artistas') },
    { id: 'album', label: t('search:albums', 'Álbuns') },
    { id: 'show', label: t('search:shows', 'Podcasts e programas') },
    { id: 'episode', label: t('search:episodes', 'Episódios') },
  ]

  const handleTabChange = (tabId: string) => {
    if (tabId === 'all') {
      // Stay on current search page
      return
    }

    // Navigate to specific search type page
    const queryParams = new URLSearchParams(searchParams)
    navigate(`/search/${tabId}?${queryParams.toString()}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8 p-3 sm:p-4 lg:p-6">
        {/* Header */}
        <SearchHeader />

        {/* Type Selector and Filters - Only show when there's a search query */}
        {searchQuery && (
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  data-testid="search-type-button"
                  onClick={() => handleTabChange(tab.id)}
                  className={`px-4 py-2 rounded-full transition-all duration-200 font-medium text-sm ${
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

        {/* Search Results */}
        {searchQuery ? (
          <div className="p-4" data-testid="search-results">
            {searchState.isLoading ? (
              <SearchLoadingState />
            ) : searchState.error ? (
              <SearchErrorState error={searchState.error} />
            ) : !searchState.isLoading && hasResults ? (
              <div className="space-y-8">
                {/* Best Result and Tracks Section */}
                <SearchResultsLayout
                  bestResult={(() => {
                    const playlists = results.playlists.items
                    const artists = results.artists.items
                    const albums = results.albums.items

                    if (playlists.length > 0) {
                      const playlist = playlists[0]
                      return (
                        <BestResultCard
                          imageUrl={playlist.images[0]?.url || ''}
                          title={playlist.name}
                          subtitle={`Playlist • ${playlist.owner.display_name}`}
                          type="Playlist"
                          onClick={() => {
                            if (playlist.external_urls?.spotify) {
                              window.open(
                                playlist.external_urls.spotify,
                                '_blank',
                                'noopener,noreferrer',
                              )
                            }
                          }}
                        />
                      )
                    }

                    if (artists.length > 0) {
                      const artist = artists[0]
                      return (
                        <BestResultCard
                          imageUrl={artist.images[0]?.url || ''}
                          title={artist.name}
                          subtitle={t('search:artist', 'Artista')}
                          type={t('search:artist', 'Artista')}
                          onClick={() =>
                            navigate(`/artist/${artist.id}`, {
                              state: {
                                from: location.pathname + location.search,
                              },
                            })
                          }
                        />
                      )
                    }

                    if (albums.length > 0) {
                      const album = albums[0]
                      return (
                        <BestResultCard
                          imageUrl={album.images[0]?.url || ''}
                          title={album.name}
                          subtitle={album.artists.map((a) => a.name).join(', ')}
                          type="Álbum"
                          onClick={() =>
                            navigate(`/album/${album.id}`, {
                              state: {
                                from: location.pathname + location.search,
                              },
                            })
                          }
                        />
                      )
                    }

                    return null
                  })()}
                  tracksSection={
                    results.tracks.items.length > 0 && (
                      <TracksListSection
                        tracks={results.tracks.items}
                        onTrackClick={(trackId) => {
                          const track = results.tracks.items.find(
                            (t) => t.id === trackId,
                          )
                          if (track?.external_urls?.spotify) {
                            window.open(
                              track.external_urls.spotify,
                              '_blank',
                              'noopener,noreferrer',
                            )
                          }
                        }}
                      />
                    )
                  }
                >
                  {/* Artists Section */}
                  {results.artists.items.length > 0 && (
                    <ArtistsSection
                      artists={results.artists.items}
                      onSectionClick={() => handleSectionClick('artist')}
                    />
                  )}

                  {/* Albums Section */}
                  {results.albums.items.length > 0 && (
                    <AlbumsSection
                      albums={results.albums.items}
                      onSectionClick={() => handleSectionClick('album')}
                    />
                  )}

                  {/* Playlists Section */}
                  {results.playlists.items.length > 0 && (
                    <PlaylistsSection
                      playlists={results.playlists.items}
                      onSectionClick={() => handleSectionClick('playlist')}
                    />
                  )}

                  {/* Shows Section */}
                  {results.shows.items.length > 0 && (
                    <ShowsSection
                      shows={results.shows.items}
                      onSectionClick={() => handleSectionClick('show')}
                      total={results.shows.total}
                    />
                  )}

                  {/* Episodes Section */}
                  {results.episodes.items.length > 0 && (
                    <EpisodesSection
                      episodes={results.episodes.items}
                      onSectionClick={() => handleSectionClick('episode')}
                      total={results.episodes.total}
                    />
                  )}
                </SearchResultsLayout>
              </div>
            ) : (
              <NoResultsCard
                searchQuery={searchQuery}
                isLoading={
                  searchState.isLoading || searchQuery.trim().length < 2
                }
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
const SearchLoadingState: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        <span className="text-muted-foreground">
          {t('search:searching', 'Buscando...')}
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
    <div className="p-4">
      <Card className="text-center">
        <CardContent className="p-8">
          <Search className="mx-auto h-16 w-16 animate-pulse text-primary dark:text-muted-foreground mb-4" />
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
    </div>
  )
}
