import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { ArtistCard } from '@/components/ui/ArtistCard'
import { GridSkeleton } from '@/components/ui/GridSkeleton'
import { usePopularArtistsImagePreload } from '@/hooks/useImagePreload'
import { usePopularArtists } from '@/hooks/usePopularArtists'

export const ArtistsPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { artists, isLoading, error, refetch } = usePopularArtists({
    limit: 24,
  })

  // 🚀 Preload de imagens críticas para melhorar LCP
  usePopularArtistsImagePreload(artists)

  // 🚀 Otimização: useCallback para evitar re-renders desnecessários
  const handleArtistClick = useCallback(
    (artistId: string) => {
      navigate(`/artist/${artistId}`)
    },
    [navigate],
  )

  // 🚀 Otimização: useMemo para computar artistas prioritários apenas quando necessário
  const artistsWithPriority = useMemo(() => {
    return artists.map((artist, index) => ({
      ...artist,
      priority: index < 6, // Primeiros 6 têm prioridade alta
    }))
  }, [artists])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-3 sm:p-4 lg:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            {t('artists:popularArtists', 'Artistas populares')}
          </h1>
          <GridSkeleton count={24} shape="circle" />
        </div>
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
          {artistsWithPriority.map((artist) => (
            <div key={artist.id} className="w-full aspect-square">
              <ArtistCard
                artist={artist}
                onClick={() => handleArtistClick(artist.id)}
                priority={artist.priority}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
