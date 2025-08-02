import React from 'react'
import { useTranslation } from 'react-i18next'

import { SpotifyArtist } from '@/schemas/spotify'

import { ArtistCard } from './ArtistCard'
import { LoadingSkeleton } from './LoadingSkeleton'

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

  if (isLoading) {
    return (
      <div className={`popular-artists-section ${className}`}>
        <div className="popular-artists-header">
          <h2 className="popular-artists-title">
            {t('home:trendingArtists', 'Artistas em Alta')}
          </h2>
          <p className="popular-artists-description">
            {t('home:trendingDescription', 'Descubra os artistas mais populares no momento')}
          </p>
        </div>
        <LoadingSkeleton variant="search-results" count={6} />
      </div>
    )
  }

  if (error) {
    return (
      <div className={`popular-artists-section ${className}`}>
        <div className="popular-artists-header">
          <h2 className="popular-artists-title">
            {t('home:trendingArtists', 'Artistas em Alta')}
          </h2>
        </div>
        <div className="popular-artists-error">
          <p>{t('home:trendingError', 'Não foi possível carregar os artistas populares')}</p>
        </div>
      </div>
    )
  }

  if (!artists || artists.length === 0) {
    return null
  }

  return (
    <div className={`popular-artists-section ${className}`}>
      <div className="popular-artists-header">
        <h2 className="popular-artists-title">
          {t('home:trendingArtists', 'Artistas em Alta')}
        </h2>
        <p className="popular-artists-description">
          {t('home:trendingDescription', 'Descubra os artistas mais populares no momento')}
        </p>
      </div>

      <div className="popular-artists-grid">
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