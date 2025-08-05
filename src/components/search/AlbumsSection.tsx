import React from 'react'
import { useTranslation } from 'react-i18next'

import { AlbumCard } from '@/components/ui/AlbumCard'
import { SpotifyAlbum } from '@/types/spotify'

interface AlbumsSectionProps {
  albums: SpotifyAlbum[]
  isLoading?: boolean
}

export const AlbumsSection: React.FC<AlbumsSectionProps> = ({
  albums,
  isLoading = false,
}) => {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          {t('search:albums', 'Álbuns')}
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

  if (albums.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">
        {t('search:albums', 'Álbuns')}
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {albums
          .filter((album) => album && album.id) // Filter out null/undefined items
          .map((album) => (
            <AlbumCard
              key={album.id}
              album={album}
              onClick={() => {
                // TODO: Implement album navigation
                console.log('Navigate to album:', album.id)
              }}
            />
          ))}
      </div>
    </div>
  )
} 