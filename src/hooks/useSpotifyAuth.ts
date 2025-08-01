import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { spotifyRepository } from '@/repositories'

interface UseSpotifyAuthReturn {
  isAuthenticated: boolean
  login: () => void
  logout: () => void
  handleCallback: (url: string) => void
}

export function useSpotifyAuth(): UseSpotifyAuthReturn {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

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
    setIsAuthenticated(false)
    navigate('/')
  }, [navigate])

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
