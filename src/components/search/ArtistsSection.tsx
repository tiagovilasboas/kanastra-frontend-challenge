import React from 'react'
import { useTranslation } from 'react-i18next'

import { ArtistCardContainer } from '@/components/ui/ArtistCardContainer'
import { SpotifyArtist } from '@/types/spotify'

interface ArtistsSectionProps {
  artists: SpotifyArtist[]
  isLoading?: boolean
  onSectionClick?: () => void
  total?: number
}

export const ArtistsSection: React.FC<ArtistsSectionProps> = ({
  artists,
  isLoading = false,
  onSectionClick,
  total = 0,
}) => {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          {t('search:artists', 'Artistas')}
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="aspect-square animate-pulse rounded-lg bg-muted"
            />
          ))}
        </div>
      </div>
    )
  }

  if (artists.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        {onSectionClick ? (
          <button
            onClick={onSectionClick}
            className="text-2xl font-bold text-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            aria-label={t('search:viewAllArtists', 'Ver todos os Artistas')}
            aria-pressed="false"
          >
            {t('search:artists', 'Artistas')}
          </button>
        ) : (
          <h2 className="text-2xl font-bold text-foreground">
            {t('search:artists', 'Artistas')}
          </h2>
        )}
        <div className="flex items-center gap-2">
          {!onSectionClick && total > artists.length && (
            <span className="text-sm text-muted-foreground">
              {t('search:showingResults', 'Mostrando {{count}} de {{total}}', {
                count: artists.length,
                total,
              })}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {artists
          .filter((artist) => artist && artist.id) // Filter out null/undefined items
          .map((artist) => (
            <ArtistCardContainer key={artist.id} artist={artist} />
          ))}
      </div>
    </div>
  )
}
