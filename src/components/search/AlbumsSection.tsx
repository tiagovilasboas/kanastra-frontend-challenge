import React from 'react'
import { useTranslation } from 'react-i18next'

import { AlbumCard } from '@/components/ui/AlbumCard'
import { Pagination } from '@/components/ui/Pagination'
import { SpotifyAlbum } from '@/types/spotify'

interface AlbumsSectionProps {
  albums: SpotifyAlbum[]
  isLoading?: boolean
  onSectionClick?: () => void
  total?: number
  // Paginação manual
  currentPage?: number
  totalPages?: number
  onPageChange?: (page: number) => void
  showPagination?: boolean
}

export const AlbumsSection: React.FC<AlbumsSectionProps> = ({
  albums,
  isLoading = false,
  onSectionClick,
  total = 0,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  showPagination = false,
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
      <div className="flex items-center justify-between">
        {onSectionClick ? (
          <button
            onClick={onSectionClick}
            className="text-2xl font-bold text-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            aria-label={t('search:viewAllAlbums', 'Ver todos os Álbuns')}
            aria-pressed="false"
          >
            {t('search:albums', 'Álbuns')}
          </button>
        ) : (
          <h2 className="text-2xl font-bold text-foreground">
            {t('search:albums', 'Álbuns')}
          </h2>
        )}
        <div className="flex items-center gap-2">
          {total > albums.length && (
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
              onClick={() => {
                // TODO: Implement album navigation
              }}
            />
          ))}
      </div>

      {/* Paginação manual */}
      {showPagination && onPageChange && totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  )
}
