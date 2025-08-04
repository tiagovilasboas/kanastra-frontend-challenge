import { Disc3, Loader2, Music, Search, Users } from 'lucide-react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { AlbumCard, ArtistCard } from '@/components/ui'
import { GenreCard, TrackCard } from '@/components/ui'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card'
import { Pagination } from '@/components/ui/Pagination'
import { SearchFilters, SearchFilterType } from '@/components/ui/SearchFilters'
import { useSpotifySearch } from '@/hooks/useSpotifySearch'
import { useSearchStore } from '@/stores/searchStore'
import { logger } from '@/utils/logger'

export const SearchPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { searchQuery } = useSearchStore()
  const [activeFilter, setActiveFilter] = useState<SearchFilterType>('all')

  const {
    searchResults,
    artists,
    tracks,
    albums,
    genres,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    totalResults,
    // Album pagination
    albumsPage,
    albumsTotalPages,
    albumsPerPage,
    loadAlbumsPage,
  } = useSpotifySearch()

  const handleArtistClick = (artistId: string) => {
    navigate(`/artist/${artistId}`)
  }

  const handleGenreClick = (genre: string) => {
    // For now, just search for the genre
    // In the future, this could navigate to a genre page
    logger.debug('Genre clicked', { genre })
  }

  const handleFilterChange = (filter: SearchFilterType) => {
    setActiveFilter(filter)
  }

  const handleAlbumsPageChange = (page: number) => {
    loadAlbumsPage(page)
  }

  // Determine which sections to show based on active filter
  const shouldShowArtists = activeFilter === 'all' || activeFilter === 'artists'
  const shouldShowTracks = activeFilter === 'all' || activeFilter === 'tracks'
  const shouldShowAlbums = activeFilter === 'all' || activeFilter === 'albums'

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Search className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">
              {t('search:title')}
            </h1>
          </div>
          <p className="text-muted-foreground">{t('search:description')}</p>
        </div>

        {/* Search Results */}
        {searchQuery ? (
          <div className="space-y-8">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-xl font-semibold text-foreground">
                {t('search:resultsForTerm', {
                  term: searchQuery,
                  defaultValue: 'Results for "{term}"',
                })}
              </h2>
            </div>

            {/* Filters */}
            {(artists.length > 0 || tracks.length > 0 || albums.length > 0) && (
              <SearchFilters
                activeFilter={activeFilter}
                onFilterChange={handleFilterChange}
                hasArtists={artists.length > 0}
                hasTracks={tracks.length > 0}
                hasAlbums={albums.length > 0}
              />
            )}

            {isLoading ? (
              <div className="space-y-8">
                {/* Artists Loading */}
                {shouldShowArtists && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      {t('search:artists')}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                      {Array.from({ length: 10 }).map((_, index) => (
                        <div key={index} className="animate-pulse">
                          <div className="aspect-square bg-muted rounded-lg mb-3"></div>
                          <div className="h-4 bg-muted rounded w-3/4 mb-1"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tracks Loading */}
                {shouldShowTracks && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Music className="w-5 h-5" />
                      {t('search:tracks', 'Tracks')}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                      {Array.from({ length: 10 }).map((_, index) => (
                        <div key={index} className="animate-pulse">
                          <div className="aspect-square bg-muted rounded-lg mb-3"></div>
                          <div className="h-4 bg-muted rounded w-3/4 mb-1"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Albums Loading */}
                {shouldShowAlbums && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Disc3 className="w-5 h-5" />
                      {t('search:albums', 'Albums')}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                      {Array.from({ length: 10 }).map((_, index) => (
                        <div key={index} className="animate-pulse">
                          <div className="aspect-square bg-muted rounded-lg mb-3"></div>
                          <div className="h-4 bg-muted rounded w-3/4 mb-1"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Genres Loading */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Disc3 className="w-5 h-5" />
                    {t('search:genres')}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div key={index} className="animate-pulse">
                        <div className="aspect-square bg-muted rounded-lg mb-3"></div>
                        <div className="h-4 bg-muted rounded w-3/4 mb-1"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : error ? (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-destructive mb-2">
                      {t('search:errorMessage')}
                    </p>
                    <p className="text-sm text-muted-foreground">{error}</p>
                  </div>
                </CardContent>
              </Card>
            ) : artists.length > 0 ||
              tracks.length > 0 ||
              albums.length > 0 ||
              genres.length > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {t('search:totalResults', { count: totalResults })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t('search:showingResults', {
                      showing: searchResults.length,
                      total: totalResults,
                    })}
                  </p>
                </div>

                {/* Artists Section */}
                {shouldShowArtists && artists.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      {t('search:artistsWithCount', {
                        count: artists.length,
                        defaultValue: 'Artists ({count})',
                      })}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                      {artists.map((artist) => (
                        <div
                          key={artist.id}
                          onClick={() => handleArtistClick(artist.id)}
                        >
                          <ArtistCard artist={artist} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tracks Section */}
                {shouldShowTracks && tracks.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Music className="w-5 h-5" />
                      {t('search:tracksWithCount', {
                        count: tracks.length,
                        defaultValue: 'Tracks ({count})',
                      })}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                      {tracks.map((track) => (
                        <TrackCard key={track.id} track={track} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Albums Section */}
                {shouldShowAlbums && albums.length > 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <Disc3 className="w-5 h-5" />
                        {t('search:albumsWithCount', {
                          count: albums.length,
                          defaultValue: 'Albums ({count})',
                        })}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {t('search:pageInfo', {
                          page: albumsPage,
                          totalPages: albumsTotalPages,
                          perPage: albumsPerPage,
                          defaultValue:
                            'Page {page} of {totalPages} ({perPage} per page)',
                        })}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                      {albums.map((album) => (
                        <AlbumCard key={album.id} album={album} />
                      ))}
                    </div>
                    {/* Albums Pagination */}
                    {albumsTotalPages > 1 && (
                      <div className="flex justify-center pt-4">
                        <Pagination
                          currentPage={albumsPage}
                          totalPages={albumsTotalPages}
                          onPageChange={handleAlbumsPageChange}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Genres Section */}
                {genres.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Disc3 className="w-5 h-5" />
                      {t('search:genresWithCount', {
                        count: genres.length,
                        defaultValue: 'Genres ({count})',
                      })}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                      {genres.map((genre) => (
                        <div
                          key={genre}
                          onClick={() => handleGenreClick(genre)}
                        >
                          <GenreCard genre={genre} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Load More Button for Artists and Tracks */}
                {hasMore && (shouldShowArtists || shouldShowTracks) && (
                  <div className="flex justify-center pt-6">
                    <Button
                      onClick={loadMore}
                      disabled={isLoadingMore}
                      className="px-8"
                    >
                      {isLoadingMore ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {t('search:loadingMore', 'Loading...')}
                        </>
                      ) : (
                        t('search:loadMore')
                      )}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-2">
                      {t('search:noResultsTitle', 'No results found')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t('search:noResultsMessage', {
                        term: searchQuery,
                        defaultValue:
                          'No results found for "{term}". Try a different search term.',
                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <CardTitle className="mb-2">
                  {t('search:welcomeTitle', 'Start searching')}
                </CardTitle>
                <CardDescription>{t('search:welcomeMessage')}</CardDescription>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
