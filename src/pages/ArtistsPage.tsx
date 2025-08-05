import { TrendingUp } from 'lucide-react'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { ArtistCard, ListFilter } from '@/components/ui'
import { usePopularArtists } from '@/hooks/usePopularArtists'

export const ArtistsPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [nameFilter, setNameFilter] = useState('')

  const { artists: popularArtists, isLoading: isPopularLoading } =
    usePopularArtists({
      limit: 20,
    })

  // Filter artists by name
  const filteredArtists = useMemo(() => {
    if (!nameFilter.trim()) return popularArtists

    return popularArtists.filter((artist) =>
      artist.name.toLowerCase().includes(nameFilter.toLowerCase()),
    )
  }, [popularArtists, nameFilter])

  const handleArtistClick = (artistId: string) => {
    navigate(`/artist/${artistId}`)
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            {t('artists:popularArtists', 'Artistas Populares')}
          </h1>
          <p className="text-muted-foreground">
            {t(
              'artists:description',
              'Descubra os artistas mais populares do momento',
            )}
          </p>
        </div>

        {/* Popular Artists Section */}
        <section className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                {t('artists:trendingArtists', 'Artistas em Alta')}
              </h2>
            </div>

            {/* Filter */}
            <ListFilter
              placeholder={t(
                'artists:filterByName',
                'Filtrar por nome do artista...',
              )}
              onFilterChange={setNameFilter}
              className="w-full max-w-sm"
            />
          </div>

          {isPopularLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 bg-muted rounded-full mb-3 mx-auto"></div>
                  <div className="h-4 bg-muted rounded w-3/4 mb-1 mx-auto"></div>
                  <div className="h-3 bg-muted rounded w-1/2 mx-auto"></div>
                </div>
              ))}
            </div>
          ) : filteredArtists.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {filteredArtists.map((artist) => (
                <div
                  key={artist.id}
                  onClick={() => handleArtistClick(artist.id)}
                >
                  <ArtistCard artist={artist} />
                </div>
              ))}
            </div>
          ) : nameFilter.trim() ? (
            <div className="text-center py-6 sm:py-8">
              <p className="text-sm sm:text-base text-muted-foreground">
                {t(
                  'artists:noArtistsFound',
                  'Nenhum artista encontrado para "{filter}".',
                  { filter: nameFilter },
                )}
              </p>
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8">
              <p className="text-sm sm:text-base text-muted-foreground">
                {t(
                  'artists:noArtistsAvailable',
                  'Nenhum artista disponível no momento.',
                )}
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
