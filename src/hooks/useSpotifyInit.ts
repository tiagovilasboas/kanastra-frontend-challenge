import { useEffect, useState } from 'react'

import { spotifyRepository } from '@/repositories'
import { logger } from '@/utils/logger'

export function useSpotifyInit() {
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initializeSpotify = async () => {
      try {
        logger.debug('=== SPOTIFY INITIALIZATION STARTED ===')
        logger.debug('Initializing Spotify with client token')
        
        // Get client token for public API access
        await spotifyRepository.getClientToken()
        
        // Check if user token exists and load it
        const userToken = localStorage.getItem('spotify_token')
        if (userToken) {
          logger.debug('Loading user token from localStorage')
          spotifyRepository.setAccessToken(userToken)
        }
        
        logger.debug('Spotify initialized successfully', {
          hasClientToken: true,
          hasUserToken: !!userToken
        })
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