import { Disc, Loader2, Music, Search, Users } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import {
  AlbumCard,
  ArtistCard,
  SearchTypeSelector,
  TrackCard,
} from '@/components/ui'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card'
import { useSpotifySearch } from '@/hooks/useSpotifySearch'
import { useSearchStore } from '@/stores/searchStore'
import { SpotifyAlbum, SpotifyTrack } from '@/types/spotify'
import { hasItems } from '@/utils/arrayUtils'

export const SearchPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { searchQuery } = useSearchStore()

  const {
    searchState,
    results,
    segmentedResults,
    loadMore,
    filters,
    setFilters,
  } = useSpotifySearch()

  const handleArtistClick = (artistId: string) => {
    navigate(`/artist/${artistId}`)
  }

  const handleAlbumClick = (album: SpotifyAlbum) => {
    if (album.external_urls?.spotify) {
      window.open(album.external_urls.spotify, '_blank', 'noopener,noreferrer')
    }
  }

  const handleTrackClick = (track: SpotifyTrack) => {
    if (track.external_urls?.spotify) {
      window.open(track.external_urls.spotify, '_blank', 'noopener,noreferrer')
    }
  }

  // Safe array checks
  const safeArtists = Array.isArray(results.artists) ? results.artists : []
  const safeAlbums = Array.isArray(results.albums) ? results.albums : []
  const safeTracks = Array.isArray(results.tracks) ? results.tracks : []

  const totalResults =
    safeArtists.length + safeAlbums.length + safeTracks.length

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Header */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Search className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {t('search:title')}
            </h1>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground">
            {t('search:description')}
          </p>
        </div>

        {/* Search Type Selector - Only show when there's a search query */}
        {searchQuery && (
          <SearchTypeSelector
            selectedTypes={filters.types}
            onTypesChange={(types) => {
              // Ensure at least one type is selected
              if (types.length === 0) {
                setFilters({ ...filters, types: ['artist'] })
              } else {
                setFilters({ ...filters, types })
              }
            }}
          />
        )}

        {/* Search Results */}
        {searchQuery ? (
          <div className="space-y-8">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-xl font-semibold text-foreground">
                {searchQuery
                  ? t('search:resultsForTerm', { term: searchQuery })
                  : t('search:title')}
              </h2>
            </div>

            {searchState.isLoading ? (
              <div className="space-y-8">
                {/* Artists Loading */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    {t('search:artists')}
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

                {/* Albums Loading */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Disc className="w-5 h-5" />
                    {t('search:albums')}
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

                {/* Tracks Loading */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Music className="w-5 h-5" />
                    {t('search:tracks')}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div key={index} className="animate-pulse">
                        <div className="h-16 bg-muted rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : searchState.error ? (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-destructive mb-2">
                      {t('search:errorMessage')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {searchState.error}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : totalResults > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {t('search:totalResults', {
                      count: searchState.totalResults || 0,
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t('search:showingResults', {
                      showing: totalResults || 0,
                      total: searchState.totalResults || 0,
                    })}
                  </p>
                </div>

                {/* Artists Section - Segmented Results */}
                {hasItems(safeArtists) && (
                  <div className="space-y-6">
                    {/* Exact Matches */}
                    {hasItems(segmentedResults.exactMatches) && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                          {segmentedResults.exactMatches.map((artist) => (
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

                    {/* Similar Artists */}
                    {hasItems(segmentedResults.similarArtists) && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                          {segmentedResults.similarArtists.map((artist) => (
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

                    {/* Related Artists */}
                    {hasItems(segmentedResults.relatedArtists) && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                          {segmentedResults.relatedArtists.map((artist) => (
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

                    {/* Other Results */}
                    {hasItems(segmentedResults.otherResults) && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                          {segmentedResults.otherResults.map((artist) => (
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
                  </div>
                )}

                {/* Albums Section */}
                {hasItems(safeAlbums) && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Disc className="w-5 h-5" />
                      {t('search:albumsWithCount', {
                        count: safeAlbums.length,
                        defaultValue: 'Albums ({count})',
                      })}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                      {safeAlbums.map((album) => (
                        <div
                          key={album.id}
                          onClick={() => handleAlbumClick(album)}
                        >
                          <AlbumCard album={album} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tracks Section */}
                {hasItems(safeTracks) && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Music className="w-5 h-5" />
                      {t('search:tracksWithCount', {
                        count: safeTracks.length,
                        defaultValue: 'Tracks ({count})',
                      })}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {safeTracks.map((track) => (
                        <div
                          key={track.id}
                          onClick={() => handleTrackClick(track)}
                        >
                          <TrackCard track={track} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Load More Button - Only show when searching albums or tracks */}
                {searchState.hasMore &&
                  (filters.types.includes('album') ||
                    filters.types.includes('track')) && (
                    <div className="flex justify-center pt-6">
                      <Button
                        onClick={loadMore}
                        disabled={searchState.isLoadingMore}
                        className="px-8"
                      >
                        {searchState.isLoadingMore ? (
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
