import React, { useState } from 'react'
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
import { useNavigationHistory } from '@/hooks/useNavigationHistory'

export const ArtistPage: React.FC = () => {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const { goBack } = useNavigationHistory()

  const [isRefreshing, setIsRefreshing] = useState(false)

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
    handlePageChange,
    handleRefresh,
  } = useArtistPage(id || '')

  const handleRefreshWithSkeleton = async () => {
    setIsRefreshing(true)
    try {
      await handleRefresh()
    } finally {
      setIsRefreshing(false)
    }
  }

  if (!id) {
    return <div>{t('artist:artistNotFound', 'Artist ID not found')}</div>
  }

  // Loading state
  if (isLoadingArtist || isRefreshing) {
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
            <Button onClick={goBack}>{t('common:back')}</Button>
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
            <Button onClick={goBack}>{t('common:back')}</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Artist Header - Using artist-specific component */}
        <ArtistHeader
          artist={artist}
          isLoading={isLoadingArtist}
          onRefresh={handleRefreshWithSkeleton}
        />

        <Separator />

        {/* Top Tracks - Using artist-specific component */}
        <ArtistTopTracks
          tracks={topTracks}
          isLoading={isLoadingTracks}
          error={tracksError}
        />

        <Separator />

        {/* Albums - Using artist-specific component */}
        <ArtistAlbums
          albums={albums}
          isLoading={isLoadingAlbums}
          error={null}
          currentPage={currentPage}
          totalPages={totalPages}
          hasNextPage={currentPage < totalPages}
          hasPreviousPage={currentPage > 1}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  )
}
