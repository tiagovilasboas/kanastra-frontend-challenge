import React from 'react'
import { useTranslation } from 'react-i18next'

import { ArtistCard } from '@/components/ui/ArtistCard'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { usePopularArtists } from '@/hooks/usePopularArtists'

export const ArtistsPage: React.FC = () => {
  const { t } = useTranslation()
  const { artists, isLoading, error, refetch } = usePopularArtists({
    limit: 24,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4 text-center">
        <p className="text-destructive text-lg font-medium">
          {t('artists:errorLoading', 'Erro ao carregar artistas populares.')}
        </p>
        <button
          onClick={refetch}
          className="bg-primary text-primary-foreground px-4 py-2 rounded font-semibold"
        >
          {t('ui:tryAgain', 'Tentar novamente')}
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          {t('artists:popularArtists', 'Artistas populares')}
        </h1>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {artists.map((artist) => (
            <ArtistCard
              key={artist.id}
              artist={artist}
              onClick={() => {
                window.location.href = `/artist/${artist.id}`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
