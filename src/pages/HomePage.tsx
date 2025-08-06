import { Music, TrendingUp } from 'lucide-react'
import React, { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { ArtistCard } from '@/components/ui/ArtistCard'
import { usePopularArtists } from '@/hooks/usePopularArtists'
import { useSearchStore } from '@/stores/searchStore'

export const HomePage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { clearSearch } = useSearchStore()

  const { artists: popularArtists, isLoading: isPopularLoading } =
    usePopularArtists({
      limit: 10,
    })

  // Clear search on mount - using useCallback to avoid side effects
  const clearSearchOnMount = useCallback(() => {
    clearSearch()
  }, [clearSearch])

  // Use useEffect only for this specific case where we need to clear search on mount
  useEffect(() => {
    clearSearchOnMount()
  }, [clearSearchOnMount])

  const handleArtistClick = (artistId: string) => {
    navigate(`/artist/${artistId}`)
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-4 sm:space-y-6">
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-foreground">
              {t('home:welcome', 'Welcome to Spotify Explorer')}
            </h1>
            <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              {t(
                'home:description',
                'Discover artists, explore their music, and find your next favorite track.',
              )}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 sm:gap-4">
            <Music className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            <span className="text-sm sm:text-lg text-muted-foreground">
              {t('home:poweredBySpotify', 'Powered by Spotify Web API')}
            </span>
          </div>
        </section>

        {/* Popular Artists Section */}
        <section className="space-y-4 sm:space-y-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              {t('home:popularArtists', 'Popular Artists')}
            </h2>
          </div>

          {isPopularLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 bg-muted rounded-full mb-3 mx-auto"></div>
                  <div className="h-4 bg-muted rounded w-3/4 mb-1 mx-auto"></div>
                  <div className="h-3 bg-muted rounded w-1/2 mx-auto"></div>
                </div>
              ))}
            </div>
          ) : popularArtists.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {popularArtists.map((artist) => (
                <div
                  key={artist.id}
                  onClick={() => handleArtistClick(artist.id)}
                >
                  <ArtistCard artist={artist} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8">
              <p className="text-sm sm:text-base text-muted-foreground">
                {t(
                  'home:noPopularArtists',
                  'No popular artists available at the moment.',
                )}
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
