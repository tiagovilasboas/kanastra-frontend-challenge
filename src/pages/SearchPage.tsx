import { AlertCircle, Disc, Music, Search, Users } from 'lucide-react'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { AlbumCard } from '@/components/ui/AlbumCard'
import { ArtistCard } from '@/components/ui/ArtistCard'
import { Card, CardContent } from '@/components/ui/card'
import { SearchTypeSelector } from '@/components/ui/SearchTypeSelector'
import { TrackCard } from '@/components/ui/TrackCard'
import { useSpotifySearch } from '@/hooks/useSpotifySearch'
import { useSearchStore } from '@/stores/searchStore'
import { SpotifyAlbum, SpotifyArtist, SpotifyTrack } from '@/types/spotify'

// Helper function to check if array has items
const hasItems = (arr: unknown[]): boolean => arr && arr.length > 0

export const SearchPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { searchQuery } = useSearchStore()

  const { searchResults, isLoading, error, search } = useSpotifySearch()

  // Trigger search when query changes
  useEffect(() => {
    if (searchQuery && searchQuery.trim()) {
      search(searchQuery)
    }
  }, [searchQuery, search])

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
  const safeArtists = Array.isArray(searchResults?.artists)
    ? searchResults.artists
    : []
  const safeAlbums = Array.isArray(searchResults?.albums)
    ? searchResults.albums
    : []
  const safeTracks = Array.isArray(searchResults?.tracks)
    ? searchResults.tracks
    : []

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
            selectedTypes={['artist']}
            onTypesChange={() => {
              // TODO: Implement filter functionality
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

            {isLoading ? (
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
                        <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 bg-muted rounded-full mb-3 mx-auto"></div>
                        <div className="h-4 bg-muted rounded w-3/4 mb-1 mx-auto"></div>
                        <div className="h-3 bg-muted rounded w-1/2 mx-auto"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : error ? (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                    <p className="text-destructive mb-2">
                      {t('search:errorMessage')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {error.message}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : totalResults > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {t('search:totalResults', { count: totalResults })}
                  </p>
                </div>

                {/* Artists Section */}
                {hasItems(safeArtists) && (
                  <section className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      {t('search:artists')}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 sm:gap-6">
                      {safeArtists.map((artist: SpotifyArtist) => (
                        <div
                          key={artist.id}
                          onClick={() => handleArtistClick(artist.id)}
                          className="group cursor-pointer"
                        >
                          <ArtistCard artist={artist} />
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Albums Section */}
                {hasItems(safeAlbums) && (
                  <section className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Disc className="w-5 h-5" />
                      {t('search:albums')}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 sm:gap-6">
                      {safeAlbums.map((album: SpotifyAlbum) => (
                        <div
                          key={album.id}
                          onClick={() => handleAlbumClick(album)}
                          className="group cursor-pointer"
                        >
                          <AlbumCard album={album} />
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Tracks Section */}
                {hasItems(safeTracks) && (
                  <section className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Music className="w-5 h-5" />
                      {t('search:tracks')}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {safeTracks.map((track: SpotifyTrack) => (
                        <div
                          key={track.id}
                          onClick={() => handleTrackClick(track)}
                          className="group cursor-pointer"
                        >
                          <TrackCard track={track} />
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </>
            ) : searchQuery && !isLoading ? (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {t('search:noResultsTitle')}
                    </h3>
                    <p className="text-muted-foreground">
                      {t('search:noResultsMessage', { term: searchQuery })}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {t('search:startSearchingTitle')}
                </h3>
                <p className="text-muted-foreground">
                  {t('search:startSearchingMessage')}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
