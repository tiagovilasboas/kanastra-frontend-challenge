import { useEffect, useState } from 'react'

import { spotifyRepository } from '@/repositories'
import { logger } from '@/utils/logger'

export function useSpotifyInit() {
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initializeSpotify = async () => {
      try {
        logger.debug('Initializing Spotify with client token')
        
        // Get client token for public API access
        await spotifyRepository.getClientToken()
        
        logger.debug('Spotify initialized successfully')
        setIsInitialized(true)
        setError(null)
      } catch (err) {
        logger.error('Failed to initialize Spotify', err)
        setError(err instanceof Error ? err.message : 'Failed to initialize Spotify')
        setIsInitialized(false)
      }
    }

    initializeSpotify()
  }, [])

  return { isInitialized, error }
} 