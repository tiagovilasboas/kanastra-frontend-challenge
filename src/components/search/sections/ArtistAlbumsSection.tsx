import { Filter } from 'lucide-react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SpotifyAlbum } from '@/types/spotify'

import { AlbumItem } from '../items/AlbumItem'
import { GridLayout } from '../layouts/GridLayout'
import { SectionWrapper } from '../layouts/SectionWrapper'

// Artist Albums Section
interface ArtistAlbumsSectionProps {
  albums: SpotifyAlbum[]
  isLoading?: boolean
  error?: string | null
  currentPage?: number
  totalPages?: number
  hasNextPage?: boolean
  hasPreviousPage?: boolean
  onPageChange?: (page: number) => void
  onAlbumClick?: (album: SpotifyAlbum) => void
}

export const ArtistAlbumsSection: React.FC<ArtistAlbumsSectionProps> = ({ 
  albums, 
  isLoading = false,
  error = null,
  currentPage = 1,
  totalPages = 1,
  hasNextPage = false,
  hasPreviousPage = false,
  onPageChange,
  onAlbumClick 
}) => {
  const { t } = useTranslation()
  const [albumFilter, setAlbumFilter] = useState('')

  const handleAlbumFilter = (query: string) => {
    setAlbumFilter(query)
  }

  const handleAlbumClick = (album: SpotifyAlbum) => {
    if (onAlbumClick) {
      onAlbumClick(album)
    } else {
      // Default behavior: open in Spotify
      if (album.external_urls?.spotify) {
        window.open(
          album.external_urls.spotify,
          '_blank',
          'noopener,noreferrer',
        )
      }
    }
  }

  const filteredAlbums = albums.filter((album) =>
    album.name.toLowerCase().includes(albumFilter.toLowerCase()),
  )

  if (isLoading) {
    return (
      <SectionWrapper title={t('artist:albums', 'Álbuns')}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={t('artist:filterAlbums', 'Filtrar álbuns')}
                className="w-48 sm:w-64 pl-10 bg-muted/50 border-0 focus:bg-background"
                disabled
              />
            </div>
          </div>
          <GridLayout cols={5}>
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-square bg-muted rounded-lg mb-3"></div>
                <div className="h-4 bg-muted rounded w-3/4 mb-1"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </GridLayout>
        </div>
      </SectionWrapper>
    )
  }

  if (error) {
    return (
      <SectionWrapper title={t('artist:albums', 'Álbuns')}>
        <p className="text-destructive">{t('artist:errorLoadingAlbums', 'Erro ao carregar álbuns')}</p>
      </SectionWrapper>
    )
  }

  return (
    <SectionWrapper title={t('artist:albums', 'Álbuns')}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              {t('artist:albumsSortedByDate', 'Ordenados por data de lançamento')}
            </p>
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t('artist:filterAlbums', 'Filtrar álbuns')}
              value={albumFilter}
              onChange={(e) => handleAlbumFilter(e.target.value)}
              className="w-48 sm:w-64 pl-10 bg-muted/50 border-0 focus:bg-background"
            />
          </div>
        </div>

        {filteredAlbums.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            {albumFilter 
              ? t('artist:noAlbumsFound', 'Nenhum álbum encontrado com esse filtro')
              : t('artist:noAlbums', 'Nenhum álbum encontrado')
            }
          </p>
        ) : (
          <>
            <GridLayout cols={5}>
              {filteredAlbums.map((album) => (
                <AlbumItem 
                  key={album.id} 
                  album={album} 
                  onClick={() => handleAlbumClick(album)}
                />
              ))}
            </GridLayout>

            {/* Pagination */}
            {onPageChange && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={!hasPreviousPage}
                >
                  {t('common:previous', 'Anterior')}
                </Button>
                
                <span className="text-sm text-muted-foreground">
                  {t('common:pageInfo', 'Página {{current}} de {{total}}', {
                    current: currentPage,
                    total: totalPages,
                  })}
                </span>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={!hasNextPage}
                >
                  {t('common:next', 'Próxima')}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </SectionWrapper>
  )
} 