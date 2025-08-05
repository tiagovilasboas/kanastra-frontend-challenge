import { Filter } from 'lucide-react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { AlbumCard } from '@/components/ui'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SpotifyAlbum } from '@/schemas/spotify'

interface ArtistAlbumsProps {
  albums: SpotifyAlbum[]
  isLoading: boolean
  error: string | null
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  onPageChange: (page: number) => void
}

export const ArtistAlbums: React.FC<ArtistAlbumsProps> = ({
  albums,
  isLoading,
  error,
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
}) => {
  const { t } = useTranslation()
  const [albumFilter, setAlbumFilter] = useState('')

  const handleAlbumFilter = (query: string) => {
    setAlbumFilter(query)
  }

  const filteredAlbums = albums.filter((album) =>
    album.name.toLowerCase().includes(albumFilter.toLowerCase()),
  )

  if (isLoading) {
    return (
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">
            {t('artist:albums')}
          </h2>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t('artist:filterAlbums')}
              className="w-48 sm:w-64 pl-10 bg-muted/50 border-0 focus:bg-background"
              disabled
            />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-square bg-muted rounded-lg mb-3"></div>
              <div className="h-4 bg-muted rounded w-3/4 mb-1"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">
          {t('artist:albums')}
        </h2>
        <p className="text-destructive">{t('artist:errorLoadingAlbums')}</p>
      </section>
    )
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-foreground">
            {t('artist:albums')}
          </h2>
          <p className="text-xs text-muted-foreground">
            {t('artist:albumsSortedByDate')}
          </p>
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t('artist:filterAlbums')}
            value={albumFilter}
            onChange={(e) => handleAlbumFilter(e.target.value)}
            className="w-48 sm:w-64 pl-10 bg-muted/50 border-0 focus:bg-background"
          />
        </div>
      </div>

      {filteredAlbums.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 sm:gap-6">
            {filteredAlbums.map((album) => (
              <div
                key={album.id}
                onClick={() => {
                  if (album.external_urls?.spotify) {
                    window.open(
                      album.external_urls.spotify,
                      '_blank',
                      'noopener,noreferrer',
                    )
                  }
                }}
                className="group cursor-pointer"
              >
                <AlbumCard album={album} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {(hasNextPage || hasPreviousPage) && (
            <div className="flex justify-center items-center gap-4 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={!hasPreviousPage}
              >
                {t('common:previous')}
              </Button>
              <span className="text-sm text-muted-foreground">
                {t('common:page')} {currentPage} {t('common:of')} {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={!hasNextPage}
              >
                {t('common:next')}
              </Button>
            </div>
          )}
        </>
      ) : (
        <p className="text-muted-foreground">
          {albumFilter
            ? t('artist:noAlbumsFound', { filter: albumFilter })
            : t('artist:noAlbums')}
        </p>
      )}
    </section>
  )
}
