import { useQuery } from '@tanstack/react-query'

import { spotifyRepository } from '@/repositories'
import { logger } from '@/utils/logger'

export function useSpotifyInit() {
  const { error, isLoading } = useQuery({
    queryKey: ['spotify-init'],
    queryFn: async () => {
      try {
        // Try to get client token, but don't fail the entire app if it fails
        try {
          await spotifyRepository.getClientToken()
        } catch (tokenError) {
          logger.warn(
            'Failed to get client token, app will work with user authentication only',
            tokenError,
          )
          // Don't throw error here, just log the warning
        }

        return { success: true }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to initialize Spotify'
        logger.error('Failed to initialize Spotify', err)
        throw new Error(errorMessage)
      }
    },
    staleTime: Infinity, // Only initialize once
    gcTime: Infinity, // Keep in cache forever
    retry: 1, // Retry once on failure
  })

  return {
    isInitialized: !isLoading,
    error: error?.message || null,
  }
}
