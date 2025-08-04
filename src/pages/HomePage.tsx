import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { SEOHead, StructuredData } from '@/components/SEO'
import { ArtistCard } from '@/components/ui/ArtistCard'
import { MusicIcon } from '@/components/ui/MusicIcon'
import { PopularArtistsSection } from '@/components/ui/PopularArtistsSection'
import { usePopularArtists } from '@/hooks/usePopularArtists'
import { useSpotifySearch } from '@/hooks/useSpotifySearch'

export function HomePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const {
    artists: popularArtists,
    isLoading: popularArtistsLoading,
    error: popularArtistsError,
  } = usePopularArtists()

  const {
    searchResults,
    isLoading: searchLoading,
    searchQuery,
    debouncedQuery,
    hasMore,
    loadMore,
  } = useSpotifySearch()

  const handleArtistClick = (artistId: string) => {
    navigate(`/artist/${artistId}`)
  }

  // Show loading skeleton when searching (only for home section)
  if ((searchLoading || (searchQuery && !debouncedQuery)) && searchQuery) {
    return (
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg p-4 flex flex-col gap-4 min-h-[200px] transition-transform hover:transform hover:-translate-y-1"
            >
              {/* Image skeleton */}
              <div className="w-full h-32 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%] animate-pulse rounded-md"></div>

              {/* Content skeleton */}
              <div className="flex flex-col gap-3 flex-1">
                {/* Name skeleton */}
                <div className="h-5 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%] animate-pulse rounded w-4/5"></div>

                {/* Meta skeleton */}
                <div className="flex flex-col gap-2 mt-auto">
                  <div className="h-4 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%] animate-pulse rounded w-3/5"></div>
                  <div className="h-3 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%] animate-pulse rounded w-2/5"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Show search results
  if (searchQuery && searchResults.length > 0) {
    return (
      <div className="flex-1 p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            {t('search:resultsTitle', 'Resultados da busca')}
          </h2>
          <p className="text-gray-400">
            {t('search:resultsSubtitle', 'Encontrados {{count}} artistas', {
              count: searchResults.length,
            })}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {searchResults.map((artist) => (
            <ArtistCard
              key={artist.id}
              artist={artist}
              onClick={() => handleArtistClick(artist.id)}
              showFollowers={true}
              showGenres={true}
            />
          ))}
        </div>

        {hasMore && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={loadMore}
              disabled={searchLoading}
              className="bg-[#1DB954] text-black font-semibold px-8 py-3 rounded-lg hover:bg-[#1ed760] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {searchLoading
                ? t('search:loadingMore', 'Carregando...')
                : t('search:loadMore', 'Carregar mais')}
            </button>
          </div>
        )}
      </div>
    )
  }

  // Show no results
  if (searchQuery && searchResults.length === 0 && !searchLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <MusicIcon size={64} className="text-gray-400 mb-4 mx-auto" />
          <h2 className="text-xl font-bold text-white mb-2">
            {t('search:noResultsTitle', 'Nenhum artista encontrado')}
          </h2>
          <p className="text-gray-400">
            {t('search:noResultsMessage', 'Tente buscar por outro termo')}
          </p>
        </div>
      </div>
    )
  }

  // Show popular artists (default view)
  return (
    <>
      <SEOHead
        title={t('seo:homeTitle', 'Spotify Artist Explorer')}
        description={t(
          'seo:homeDescription',
          'Descubra artistas incríveis no Spotify',
        )}
      />
      <StructuredData
        type="website"
        title={t('seo:homeTitle', 'Spotify Artist Explorer')}
        description={t(
          'seo:homeDescription',
          'Descubra artistas incríveis no Spotify',
        )}
        url={window.location.href}
        image="/og-image.jpg"
      />

      <div className="flex-1">
        <PopularArtistsSection
          artists={popularArtists}
          isLoading={popularArtistsLoading}
          error={popularArtistsError}
          onArtistClick={handleArtistClick}
        />
      </div>
    </>
  )
}
