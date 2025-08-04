import { useQuery } from '@tanstack/react-query'

import { cache } from '@/config/cache'
import { queryKeys } from '@/config/react-query'
import { spotifyRepository } from '@/repositories'
import { AudioFeatures } from '@/repositories/spotify/SpotifySearchService'

interface UseAudioFeaturesParams {
  trackId: string
  enabled?: boolean
}

interface UseAudioFeaturesReturn {
  audioFeatures: AudioFeatures | null
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

export function useAudioFeatures({
  trackId,
  enabled = true,
}: UseAudioFeaturesParams): UseAudioFeaturesReturn {
  const {
    data: audioFeatures,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.audioFeatures.byTrackId(trackId),
    queryFn: async () => {
      return await spotifyRepository.getAudioFeatures(trackId)
    },
    enabled: enabled && !!trackId,
    staleTime: cache.stale.OCCASIONAL,
    gcTime: cache.times.MEDIUM,
  })

  return {
    audioFeatures: audioFeatures || null,
    isLoading,
    error: error as Error | null,
    refetch,
  }
}

interface UseMultipleAudioFeaturesParams {
  trackIds: string[]
  enabled?: boolean
}

interface UseMultipleAudioFeaturesReturn {
  audioFeatures: AudioFeatures[]
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

export function useMultipleAudioFeatures({
  trackIds,
  enabled = true,
}: UseMultipleAudioFeaturesParams): UseMultipleAudioFeaturesReturn {
  const {
    data: audioFeatures,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.audioFeatures.multiple(trackIds),
    queryFn: async () => {
      return await spotifyRepository.getMultipleAudioFeatures(trackIds)
    },
    enabled: enabled && trackIds.length > 0,
    staleTime: cache.stale.OCCASIONAL,
    gcTime: cache.times.MEDIUM,
  })

  return {
    audioFeatures: audioFeatures || [],
    isLoading,
    error: error as Error | null,
    refetch,
  }
} 