import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { spotifyService } from '@/services/spotifyService'
import {
  SpotifyArtist,
  SpotifySearchResponse,
  SpotifyArtistTopTracksResponse,
  SpotifyArtistAlbumsResponse,
  SearchParams,
  ApiResponse,
} from '@/types/spotify'

export const useSpotify = () => {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [searchResults, setSearchResults] = useState<ApiResponse<SpotifySearchResponse>>({
    data: { artists: { items: [], total: 0, limit: 20, offset: 0, next: null, previous: null } },
    loading: false,
  })
  const [currentArtist, setCurrentArtist] = useState<ApiResponse<SpotifyArtist>>({
    data: {} as SpotifyArtist,
    loading: false,
  })
  const [artistTopTracks, setArtistTopTracks] = useState<ApiResponse<SpotifyArtistTopTracksResponse>>({
    data: { tracks: [] },
    loading: false,
  })
  const [artistAlbums, setArtistAlbums] = useState<ApiResponse<SpotifyArtistAlbumsResponse>>({
    data: { items: [], total: 0, limit: 20, offset: 0, next: null, previous: null },
    loading: false,
  })

  // Verificar autenticação na inicialização
  useEffect(() => {
    const token = spotifyService.getAccessToken()
    setIsAuthenticated(!!token)
  }, [])

  // Login
  const login = useCallback(() => {
    const authUrl = spotifyService.getAuthUrl()
    window.location.href = authUrl
  }, [])

  // Logout
  const logout = useCallback(() => {
    spotifyService.logout()
    setIsAuthenticated(false)
    navigate('/')
  }, [navigate])

  // Processar callback de autenticação
  const processAuthCallback = useCallback((url: string) => {
    const token = spotifyService.extractTokenFromUrl(url)
    if (token) {
      spotifyService.setAccessToken(token)
      setIsAuthenticated(true)
      // Salvar token no localStorage
      localStorage.setItem('spotify_token', token)
      navigate('/')
    }
  }, [navigate])

  // Buscar artistas
  const searchArtists = useCallback(async (params: SearchParams) => {
    setSearchResults(prev => ({ ...prev, loading: true, error: undefined }))
    
    try {
      const response = await spotifyService.searchArtists(params)
      setSearchResults({
        data: response,
        loading: false,
      })
    } catch (error) {
      setSearchResults(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      }))
    }
  }, [])

  // Obter detalhes do artista
  const getArtist = useCallback(async (artistId: string) => {
    setCurrentArtist(prev => ({ ...prev, loading: true, error: undefined }))
    
    try {
      const response = await spotifyService.getArtist(artistId)
      setCurrentArtist({
        data: response,
        loading: false,
      })
    } catch (error) {
      setCurrentArtist(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      }))
    }
  }, [])

  // Obter top tracks do artista
  const getArtistTopTracks = useCallback(async (artistId: string, market: string = 'BR') => {
    setArtistTopTracks(prev => ({ ...prev, loading: true, error: undefined }))
    
    try {
      const response = await spotifyService.getArtistTopTracks(artistId, market)
      setArtistTopTracks({
        data: response,
        loading: false,
      })
    } catch (error) {
      setArtistTopTracks(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      }))
    }
  }, [])

  // Obter álbuns do artista
  const getArtistAlbums = useCallback(async (
    artistId: string,
    params: { limit?: number; offset?: number; include_groups?: string } = {}
  ) => {
    setArtistAlbums(prev => ({ ...prev, loading: true, error: undefined }))
    
    try {
      const response = await spotifyService.getArtistAlbums(artistId, params)
      setArtistAlbums({
        data: response,
        loading: false,
      })
    } catch (error) {
      setArtistAlbums(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      }))
    }
  }, [])

  // Limpar resultados de busca
  const clearSearch = useCallback(() => {
    setSearchResults({
      data: { artists: { items: [], total: 0, limit: 20, offset: 0, next: null, previous: null } },
      loading: false,
    })
  }, [])

  // Limpar artista atual
  const clearCurrentArtist = useCallback(() => {
    setCurrentArtist({
      data: {} as SpotifyArtist,
      loading: false,
    })
    setArtistTopTracks({
      data: { tracks: [] },
      loading: false,
    })
    setArtistAlbums({
      data: { items: [], total: 0, limit: 20, offset: 0, next: null, previous: null },
      loading: false,
    })
  }, [])

  return {
    // Estado
    isAuthenticated,
    searchResults,
    currentArtist,
    artistTopTracks,
    artistAlbums,
    
    // Ações
    login,
    logout,
    processAuthCallback,
    searchArtists,
    getArtist,
    getArtistTopTracks,
    getArtistAlbums,
    clearSearch,
    clearCurrentArtist,
  }
} 