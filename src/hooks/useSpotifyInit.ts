import { useEffect, useState } from 'react'

import { spotifyRepository } from '@/repositories'
import { logger } from '@/utils/logger'

export function useSpotifyInit() {
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function initializeSpotify() {
      try {
        logger.debug('Initializing Spotify...')

        // Try to get client token, but don't fail the entire app if it fails
        try {
          await spotifyRepository.getClientToken()
          logger.debug('Spotify initialized with client token')
        } catch (tokenError) {
          logger.warn(
            'Failed to get client token, app will work with user authentication only',
            tokenError,
          )
          // Don't set error here, just log the warning
        }

        setIsInitialized(true)
        setError(null)
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to initialize Spotify'
        logger.error('Failed to initialize Spotify', err)
        setError(errorMessage)
        setIsInitialized(true) // Still mark as initialized to not block the app
      }
    }

    initializeSpotify()
  }, [])

  return { isInitialized, error }
}
