import React from 'react'
import { useTranslation } from 'react-i18next'

import { PlaylistCard } from '@/components/ui'
import { SpotifyPlaylist } from '@/types/spotify'

interface PlaylistsSectionProps {
  playlists: SpotifyPlaylist[]
  isLoading?: boolean
}

export const PlaylistsSection: React.FC<PlaylistsSectionProps> = ({
  playlists,
  isLoading = false,
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
      <h2 className="text-2xl font-bold text-foreground">
        {t('search:playlists', 'Playlists')}
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {playlists
          .filter((playlist) => playlist && playlist.id) // Filter out null/undefined items
          .map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              playlist={playlist}
              onClick={() => {
                // TODO: Implement playlist navigation
                console.log('Navigate to playlist:', playlist.id)
              }}
            />
          ))}
      </div>
    </div>
  )
} 