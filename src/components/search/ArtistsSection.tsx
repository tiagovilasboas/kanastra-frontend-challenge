import React from 'react'
import { useTranslation } from 'react-i18next'

import { ArtistCard } from '@/components/ui/ArtistCard'
import { SpotifyArtist } from '@/types/spotify'

interface ArtistsSectionProps {
  artists: SpotifyArtist[]
  isLoading?: boolean
}

export const ArtistsSection: React.FC<ArtistsSectionProps> = ({
  artists,
  isLoading = false,
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
      <h2 className="text-2xl font-bold text-foreground">
        {t('search:artists', 'Artistas')}
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {artists
          .filter((artist) => artist && artist.id) // Filter out null/undefined items
          .map((artist) => (
            <ArtistCard
              key={artist.id}
              artist={artist}
              onClick={() => {
                // TODO: Implement artist navigation
              }}
            />
          ))}
      </div>
    </div>
  )
} 