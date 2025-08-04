import React from 'react'
import { useTranslation } from 'react-i18next'

import { useToast } from '@/hooks/useToast'
import { SpotifyArtist } from '@/schemas/spotify'

import { ArtistCard } from './ArtistCard'

interface PopularArtistsSectionProps {
  artists: SpotifyArtist[]
  isLoading: boolean
  error: Error | null
  onArtistClick: (artistId: string) => void
  className?: string
}

export const PopularArtistsSection: React.FC<PopularArtistsSectionProps> = ({
  artists,
  isLoading,
  error,
  onArtistClick,
  className = '',
}) => {
  const { t } = useTranslation()
  const { showError } = useToast()

  if (isLoading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            {t('home:trendingArtists', 'Artistas em Alta')}
          </h2>
          <p className="text-gray-400">
            {t(
              'home:trendingDescription',
              'Descubra os artistas mais populares no momento',
            )}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
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

  if (error) {
    showError('home:trendingError')
    return null
  }

  if (!artists || artists.length === 0) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            {t('home:trendingArtists', 'Artistas em Alta')}
          </h2>
          <p className="text-gray-400">
            {t(
              'home:trendingDescription',
              'Descubra os artistas mais populares no momento',
            )}
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-gray-400 text-lg">
              {t(
                'home:noArtistsAvailable',
                'Nenhum artista disponível no momento',
              )}
            </p>
            <p className="text-gray-500 text-sm mt-2">
              {t('home:tryAgainLater', 'Tente novamente mais tarde')}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`p-6 ${className}`}>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">
          {t('home:trendingArtists', 'Artistas em Alta')}
        </h2>
        <p className="text-gray-400">
          {t(
            'home:trendingDescription',
            'Descubra os artistas mais populares no momento',
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {artists.map((artist) => (
          <ArtistCard
            key={artist.id}
            artist={artist}
            onClick={() => onArtistClick(artist.id)}
            showFollowers={true}
            showGenres={true}
          />
        ))}
      </div>
    </div>
  )
}
