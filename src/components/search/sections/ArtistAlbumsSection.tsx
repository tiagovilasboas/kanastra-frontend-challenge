import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { AlbumCard } from '@/components/ui/AlbumCard'
import { SpotifyAlbum } from '@/types/spotify'

interface ArtistAlbumsSectionProps {
  albums: SpotifyAlbum[]
  isLoading?: boolean
  total?: number
  showLoadMore?: boolean
}

export const ArtistAlbumsSection: React.FC<ArtistAlbumsSectionProps> = ({
  albums,
  isLoading = false,
  total = 0,
  showLoadMore = false,
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleAlbumClick = (albumId: string) => {
    navigate(`/album/${albumId}`)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          {t('artist:albums', 'Álbuns')}
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
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          {t('artist:albums', 'Álbuns')}
        </h2>
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {t('artist:noAlbums', 'Nenhum álbum encontrado')}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">
          {t('artist:albums', 'Álbuns')}
        </h2>
        <div className="flex items-center gap-2">
          {showLoadMore && total > 0 && (
            <span className="text-sm text-muted-foreground">
              {t('search:showingResults', 'Mostrando {{count}} de {{total}}', {
                count: albums.length,
                total,
              })}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {albums
          .filter((album) => album && album.id) // Filter out null/undefined items
          .map((album) => (
            <AlbumCard
              key={album.id}
              album={album}
              onClick={() => handleAlbumClick(album.id)}
            />
          ))}
      </div>
    </div>
  )
}
