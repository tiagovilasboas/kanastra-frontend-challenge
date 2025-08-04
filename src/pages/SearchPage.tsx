import { Loader2, Search, Users } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { ArtistCard } from '@/components/ui'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card'
import { useSpotifySearch } from '@/hooks/useSpotifySearch'
import { useSearchStore } from '@/stores/searchStore'
import { hasItems } from '@/utils/arrayUtils'

export const SearchPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { searchQuery } = useSearchStore()

  const {
    artists,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    totalResults,
  } = useSpotifySearch()

  const handleArtistClick = (artistId: string) => {
    navigate(`/artist/${artistId}`)
  }

  // Safe array check
  const safeArtists = Array.isArray(artists) ? artists : []

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

            {isLoading ? (
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
            ) : hasItems(safeArtists) ? (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {t('search:totalResults', { count: totalResults })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t('search:showingResults', {
                      showing: safeArtists.length,
                      total: totalResults,
                    })}
                  </p>
                </div>

                {/* Artists Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    {t('search:artistsWithCount', {
                      count: safeArtists.length,
                      defaultValue: 'Artists ({count})',
                    })}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                    {safeArtists.map((artist) => (
                      <div
                        key={artist.id}
                        onClick={() => handleArtistClick(artist.id)}
                      >
                        <ArtistCard artist={artist} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Load More Button */}
                {hasMore && (
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
