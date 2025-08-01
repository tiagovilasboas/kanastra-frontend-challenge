import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { queryKeys } from '@/config/react-query'
import { spotifyRepository } from '@/repositories'
import { logger } from '@/utils/logger'

interface UseSpotifyAuthReturn {
  isAuthenticated: boolean
  login: () => void
  logout: () => void
  handleCallback: (url: string) => void
}

export function useSpotifyAuth(): UseSpotifyAuthReturn {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check authentication on mount and when localStorage changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('spotify_token')
      if (token) {
        spotifyRepository.setAccessToken(token)
        setIsAuthenticated(true)
        logger.debug('User authenticated with token')
      } else {
        setIsAuthenticated(false)
        logger.debug('No authentication token found')
      }
    }

    // Check immediately
    checkAuth()

    // Listen for storage changes (in case token is set from another tab/window)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'spotify_token') {
        checkAuth()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const login = useCallback(async () => {
    try {
      logger.debug('Starting login process')
      const authUrl = await spotifyRepository.getAuthUrl()
      logger.debug('Redirecting to auth URL', {
        url: authUrl.substring(0, 100) + '...',
      })
      window.location.href = authUrl
    } catch (error) {
      logger.error('Error generating auth URL', error)
    }
  }, [])

  const logout = useCallback(() => {
    logger.debug('Logging out user')
    spotifyRepository.logout()
    setIsAuthenticated(false)

    // Invalidate all Spotify-related queries
    queryClient.invalidateQueries({ queryKey: queryKeys.search.all })
    queryClient.invalidateQueries({ queryKey: queryKeys.artists.all })

    navigate('/', { replace: true })
  }, [navigate, queryClient])

  const handleCallback = useCallback(async (url: string) => {
    try {
      logger.debug('Handling callback URL')
      const { code, state } = spotifyRepository.extractCodeFromUrl(url)
      if (code) {
        const token = await spotifyRepository.exchangeCodeForToken(
          code,
          state || undefined,
        )
        spotifyRepository.setAccessToken(token)
        localStorage.setItem('spotify_token', token)
        setIsAuthenticated(true)
        logger.debug('Authentication successful via callback')
      }
    } catch (error) {
      logger.error('Error exchanging code for token', error)
      setIsAuthenticated(false)
    }
  }, [])

  return {
    isAuthenticated,
    login,
    logout,
    handleCallback,
  }
}
