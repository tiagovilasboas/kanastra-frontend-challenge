import React from 'react'
import { useTranslation } from 'react-i18next'

import { PlaylistCard } from '@/components/ui'
import { SpotifyPlaylist } from '@/types/spotify'

interface PlaylistsSectionProps {
  playlists: SpotifyPlaylist[]
  isLoading?: boolean
  onSectionClick?: () => void
  total?: number
}

export const PlaylistsSection: React.FC<PlaylistsSectionProps> = ({
  playlists,
  isLoading = false,
  onSectionClick,
  total = 0,
}) => {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          {t('search:playlists', 'Playlists')}
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

  if (playlists.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        {onSectionClick ? (
          <button
            onClick={onSectionClick}
            className="text-2xl font-bold text-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            aria-label={t('search:viewAllPlaylists', 'Ver todas as Playlists')}
            aria-pressed="false"
          >
            {t('search:playlists', 'Playlists')}
          </button>
        ) : (
          <h2 className="text-2xl font-bold text-foreground">
            {t('search:playlists', 'Playlists')}
          </h2>
        )}
        <div className="flex items-center gap-2">
          {!onSectionClick && total > playlists.length && (
            <span className="text-sm text-muted-foreground">
              {t('search:showingResults', 'Mostrando {{count}} de {{total}}', {
                count: playlists.length,
                total,
              })}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {playlists
          .filter((playlist) => playlist && playlist.id) // Filter out null/undefined items
          .map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              playlist={playlist}
              onClick={() => {
                if (playlist.external_urls?.spotify) {
                  window.open(
                    playlist.external_urls.spotify,
                    '_blank',
                    'noopener,noreferrer',
                  )
                }
              }}
            />
          ))}
      </div>
    </div>
  )
}
