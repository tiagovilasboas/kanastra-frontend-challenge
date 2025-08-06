import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import { queryKeys } from '@/config/react-query'
import { spotifyRepository } from '@/repositories'
import { useAppStore } from '@/stores/appStore'
import { logger } from '@/utils/logger'

interface UseSpotifyAuthReturn {
  isAuthenticated: boolean
  isLoading: boolean
  login: () => void
  logout: () => void
  handleCallback: (url: string) => void
  handleAuthError: () => Promise<void>
  checkAuthError: (error: unknown) => boolean
  hasValidToken: () => boolean
}

export function useSpotifyAuth(): UseSpotifyAuthReturn {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { isAuthenticated, isLoading, setAuthenticated, setLoading, setError } =
    useAppStore()
  // Simple localStorage helpers
  const getItem = useCallback((key: string) => {
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  }, [])

  const setItem = useCallback((key: string, value: string) => {
    try {
      localStorage.setItem(key, value)
    } catch {
      // Ignore localStorage errors
    }
  }, [])

  const removeItem = useCallback((key: string) => {
    try {
      localStorage.removeItem(key)
    } catch {
      // Ignore localStorage errors
    }
  }, [])

  const login = useCallback(async () => {
    try {
      const authUrl = await spotifyRepository.getAuthUrl()
      // Use a more controlled approach instead of window.location.href
      const link = document.createElement('a')
      link.href = authUrl
      link.click()
    } catch (error) {
      logger.error('Error generating auth URL', error)
    }
  }, [])

  const logout = useCallback(() => {
    logger.debug('Logging out user')
    spotifyRepository.logout()
    setAuthenticated(false)
    removeItem('spotify_token')

    // Invalidate all Spotify-related queries
    queryClient.invalidateQueries({ queryKey: queryKeys.search.all })
    queryClient.invalidateQueries({ queryKey: queryKeys.artists.all })

    navigate('/', { replace: true })
  }, [navigate, queryClient, setAuthenticated, removeItem])

  const handleCallback = useCallback(
    async (url: string) => {
      try {
        logger.debug('Handling callback URL')
        const { code } = spotifyRepository.extractCodeFromUrl(url)
        if (code) {
          const token = await spotifyRepository.exchangeCodeForToken(code)
          spotifyRepository.setAccessToken(token)
          setItem('spotify_token', token)
          setAuthenticated(true)

          logger.debug('Authentication successful via callback')
        }
      } catch (error) {
        logger.error('Error exchanging code for token', error)
        setAuthenticated(false)
        setError(
          error instanceof Error ? error.message : 'Authentication failed',
        )
      }
    },
    [setAuthenticated, setError, setItem],
  )

  const handleAuthError = useCallback(async () => {
    logger.debug('Handling authentication error')
    setLoading(true)

    try {
      const authUrl = await spotifyRepository.getAuthUrl()
      spotifyRepository.logout()
      setAuthenticated(false)
      removeItem('spotify_token')

      // Use a more controlled approach instead of window.location.href
      const link = document.createElement('a')
      link.href = authUrl
      link.click()
    } catch (error) {
      logger.error('Failed to handle auth error', error)
      setLoading(false)
    }
  }, [setLoading, setAuthenticated, removeItem])

  const checkAuthError = useCallback(
    (error: unknown) => {
      if (error instanceof Error && error.name === 'AUTH_REQUIRED') {
        logger.debug('Authentication error detected, redirecting to auth')
        handleAuthError()
        return true
      }
      return false
    },
    [handleAuthError],
  )

  const hasValidToken = useCallback(() => {
    const token = getItem('spotify_token')
    return !!token
  }, [getItem])

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
    handleCallback,
    handleAuthError,
    checkAuthError,
    hasValidToken,
  }
}
