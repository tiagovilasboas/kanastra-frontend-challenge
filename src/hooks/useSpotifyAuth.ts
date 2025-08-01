import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  CACHE_TIMES,
  queryKeys,
  RETRY_CONFIGS,
  STALE_TIMES,
} from '@/config/react-query'
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

  // Query para verificar autenticação
  const { data: isAuthenticated = false } = useQuery({
    queryKey: queryKeys.auth.status(),
    queryFn: () => {
      const token = localStorage.getItem('spotify_token')
      if (token) {
        spotifyRepository.setAccessToken(token)
        return true
      }
      return false
    },
    staleTime: STALE_TIMES.STATIC, // Não revalidar automaticamente
    gcTime: CACHE_TIMES.INFINITE, // Manter em memória indefinidamente
    retry: RETRY_CONFIGS.NONE.retry,
  })

  const login = useCallback(() => {
    window.location.href = spotifyRepository.getAuthUrl()
  }, [])

  const logout = useCallback(() => {
    spotifyRepository.logout()
    localStorage.removeItem('spotify_token')

    // Invalidar todas as queries relacionadas ao Spotify
    queryClient.invalidateQueries({ queryKey: queryKeys.auth.all })
    queryClient.invalidateQueries({ queryKey: queryKeys.search.all })
    queryClient.invalidateQueries({ queryKey: queryKeys.artists.all })

    navigate('/')
  }, [navigate, queryClient])

  const handleCallback = useCallback(
    (url: string) => {
      const token = spotifyRepository.extractTokenFromUrl(url)
      if (token) {
        spotifyRepository.setAccessToken(token)
        localStorage.setItem('spotify_token', token)

        // Atualizar a query de autenticação
        queryClient.setQueryData(queryKeys.auth.status(), true)
      }
    },
    [queryClient],
  )

  return {
    isAuthenticated,
    login,
    logout,
    handleCallback,
  }
}
