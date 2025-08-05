import { Disc3 } from 'lucide-react'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { AlbumCard, ListFilter } from '@/components/ui'
import { usePopularAlbums } from '@/hooks/usePopularAlbums'
import { SpotifyAlbum } from '@/types/spotify'

export const AlbumsPage: React.FC = () => {
  const { t } = useTranslation()
  const [nameFilter, setNameFilter] = useState('')

  const { albums: popularAlbums, isLoading: isAlbumsLoading } =
    usePopularAlbums({
      limit: 20,
    })

  // Filter albums by name
  const filteredAlbums = useMemo(() => {
    if (!nameFilter.trim()) return popularAlbums

    return popularAlbums.filter(
      (album) =>
        album.name.toLowerCase().includes(nameFilter.toLowerCase()) ||
        album.artists.some((artist) =>
          artist.name.toLowerCase().includes(nameFilter.toLowerCase()),
        ),
    )
  }, [popularAlbums, nameFilter])

  const handleAlbumClick = (album: SpotifyAlbum) => {
    if (album.external_urls?.spotify) {
      window.open(album.external_urls.spotify, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Disc3 className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">
              {t('albums:title', 'Albums')}
            </h1>
          </div>
          <p className="text-muted-foreground">
            {t(
              'albums:description',
              'Discover and explore albums from your favorite artists',
            )}
          </p>
        </div>

        {/* Albums Section */}
        <section className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              {t('albums:popularAlbums', 'Álbuns Populares')}
            </h2>

            {/* Filter */}
            <ListFilter
              placeholder={t(
                'albums:filterByName',
                'Filtrar por nome do álbum...',
              )}
              onFilterChange={setNameFilter}
              className="w-full max-w-sm"
            />
          </div>

          {isAlbumsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-square bg-muted rounded-lg mb-3"></div>
                  <div className="h-4 bg-muted rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredAlbums.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {filteredAlbums.map((album) => (
                <div key={album.id} onClick={() => handleAlbumClick(album)}>
                  <AlbumCard album={album} />
                </div>
              ))}
            </div>
          ) : nameFilter.trim() ? (
            <div className="text-center py-6 sm:py-8">
              <p className="text-sm sm:text-base text-muted-foreground">
                {t(
                  'albums:noAlbumsFound',
                  'Nenhum álbum encontrado para "{filter}".',
                  { filter: nameFilter },
                )}
              </p>
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8">
              <p className="text-sm sm:text-base text-muted-foreground">
                {t(
                  'albums:noAlbumsAvailable',
                  'Nenhum álbum disponível no momento.',
                )}
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
