import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
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
  const queryClient = useQueryClient()

  // Query para verificar autenticação
  const { data: isAuthenticated = false } = useQuery({
    queryKey: ['spotifyAuth'],
    queryFn: () => {
      const token = localStorage.getItem('spotify_token')
      if (token) {
        spotifyRepository.setAccessToken(token)
        return true
      }
      return false
    },
    staleTime: Infinity, // Não revalidar automaticamente
  })

  const login = useCallback(() => {
    window.location.href = spotifyRepository.getAuthUrl()
  }, [])

  const logout = useCallback(() => {
    spotifyRepository.logout()
    localStorage.removeItem('spotify_token')

    // Invalidar todas as queries relacionadas ao Spotify
    queryClient.invalidateQueries({ queryKey: ['spotifyAuth'] })
    queryClient.invalidateQueries({ queryKey: ['searchArtists'] })
    queryClient.invalidateQueries({ queryKey: ['artist'] })
    queryClient.invalidateQueries({ queryKey: ['artistTopTracks'] })
    queryClient.invalidateQueries({ queryKey: ['artistAlbums'] })

    navigate('/')
  }, [navigate, queryClient])

  const handleCallback = useCallback(
    (url: string) => {
      const token = spotifyRepository.extractTokenFromUrl(url)
      if (token) {
        spotifyRepository.setAccessToken(token)
        localStorage.setItem('spotify_token', token)

        // Atualizar a query de autenticação
        queryClient.setQueryData(['spotifyAuth'], true)
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
