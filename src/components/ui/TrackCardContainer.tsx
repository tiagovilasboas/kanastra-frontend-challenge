import React from 'react'

import { useNavigationHandlers } from '@/hooks/useNavigationHandlers'
import { SpotifyMapper } from '@/mappers/spotify'
import { SpotifyTrack } from '@/types/spotify'

import { TrackCard } from './TrackCard'

interface TrackCardContainerProps {
  track: SpotifyTrack
}

/**
 * Container para TrackCard que injeta handlers de navegação.
 * Mantém o componente TrackCard puramente apresentacional.
 */
export const TrackCardContainer: React.FC<TrackCardContainerProps> = ({
  track,
}) => {
  const { handleSpotifyClick } = useNavigationHandlers()

  const handleClick = () => {
    const trackDTO = SpotifyMapper.toTrackDTO(track)
    if (trackDTO.spotifyUrl) {
      handleSpotifyClick(trackDTO.spotifyUrl)
    }
  }

  return <TrackCard track={track} onClick={handleClick} />
}
