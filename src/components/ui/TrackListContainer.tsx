import React from 'react'

import { useNavigationHandlers } from '@/hooks/useNavigationHandlers'
import { SpotifyTrack } from '@/types/spotify'

import { TrackList } from './TrackList'

interface TrackListContainerProps {
  tracks: SpotifyTrack[]
  className?: string
}

/**
 * Container para TrackList que injeta handlers de navegação.
 * Mantém o componente TrackList puramente apresentacional.
 */
export const TrackListContainer: React.FC<TrackListContainerProps> = ({
  tracks,
  className,
}) => {
  const { handleSpotifyClick } = useNavigationHandlers()

  const handleTrackClick = (track: SpotifyTrack) => {
    if (track.external_urls?.spotify) {
      handleSpotifyClick(track.external_urls.spotify)
    }
  }

  return (
    <TrackList
      tracks={tracks}
      onTrackClick={handleTrackClick}
      className={className}
    />
  )
}
