import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { queryKeys } from '@/config/react-query'
import { spotifyRepository } from '@/repositories'

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

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('spotify_token')
    if (token) {
      spotifyRepository.setAccessToken(token)
      setIsAuthenticated(true)
    }
  }, [])

  const login = useCallback(() => {
    window.location.href = spotifyRepository.getAuthUrl()
  }, [])

  const logout = useCallback(() => {
    spotifyRepository.logout()
    localStorage.removeItem('spotify_token')
    setIsAuthenticated(false)

    // Invalidate all Spotify-related queries
    queryClient.invalidateQueries({ queryKey: queryKeys.search.all })
    queryClient.invalidateQueries({ queryKey: queryKeys.artists.all })

    navigate('/')
  }, [navigate, queryClient])

  const handleCallback = useCallback((url: string) => {
    const token = spotifyRepository.extractTokenFromUrl(url)
    if (token) {
      spotifyRepository.setAccessToken(token)
      localStorage.setItem('spotify_token', token)
      setIsAuthenticated(true)
    }
  }, [])

  return {
    isAuthenticated,
    login,
    logout,
    handleCallback,
  }
}
