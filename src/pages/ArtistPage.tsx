import React from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import {
  ArtistAlbums,
  ArtistHeader,
  ArtistPageSkeleton,
  ArtistTopTracks,
} from '@/components/artist'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useArtistPage } from '@/hooks/useArtistPage'
import { logger } from '@/utils/logger'

export const ArtistPage: React.FC = () => {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()

  const {
    artist,
    topTracks,
    albums,
    currentPage,
    totalPages,
    isLoadingArtist,
    isLoadingTracks,
    isLoadingAlbums,
    artistError,
    tracksError,
    albumsError,
    handlePageChange,
    handleBackToHome,
    handleRefresh,
  } = useArtistPage(id || '')

  if (!id) {
    return <div>{t('artist:artistNotFound', 'Artist ID not found')}</div>
  }

  logger.debug('ArtistPage: Artist ID from params', { id })
  logger.debug('ArtistPage: Artist data', { artist })
  logger.debug('ArtistPage: Loading states', {
    isLoadingArtist,
    isLoadingTracks,
    isLoadingAlbums,
  })
  logger.debug('ArtistPage: Errors', { artistError, tracksError, albumsError })

  // Loading state
  if (isLoadingArtist) {
    return <ArtistPageSkeleton />
  }

  // Error state
  if (artistError) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          <div className="text-center py-8 sm:py-12">
            <p className="text-destructive text-lg mb-4">
              {t('artist:errorLoading')}
            </p>
            <Button onClick={handleBackToHome}>{t('common:backToHome')}</Button>
          </div>
        </div>
      </div>
    )
  }

  // No artist found
  if (!artist) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          <div className="text-center py-8 sm:py-12">
            <p className="text-muted-foreground text-lg mb-4">
              {t('artist:notFound')}
            </p>
            <Button onClick={handleBackToHome}>{t('common:backToHome')}</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Artist Header */}
        <ArtistHeader
          artist={artist}
          isLoading={isLoadingArtist}
          onBackToHome={handleBackToHome}
          onRefresh={handleRefresh}
        />

        <Separator />

        {/* Top Tracks */}
        <ArtistTopTracks
          tracks={topTracks}
          isLoading={isLoadingTracks}
          error={tracksError?.message || null}
        />

        <Separator />

        {/* Albums */}
        <ArtistAlbums
          albums={albums}
          isLoading={isLoadingAlbums}
          error={albumsError?.message || null}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  )
}
