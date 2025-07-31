import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { spotifyRepository } from '@/repositories'
import { RepositoryResponse } from '@/repositories/base/BaseRepository'
import {
  AlbumParams,
  SearchParams,
  SpotifyArtistAlbumsResponse,
  SpotifyArtistTopTracksResponse,
  SpotifySearchResponse,
} from '@/repositories/spotify/types'
import { SpotifyArtist } from '@/types/spotify'

export const useSpotify = () => {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [searchResults, setSearchResults] = useState<RepositoryResponse<SpotifySearchResponse>>({
    data: { artists: { items: [], total: 0, limit: 20, offset: 0, next: null, previous: null } },
    loading: false,
  })
  const [currentArtist, setCurrentArtist] = useState<RepositoryResponse<SpotifyArtist>>({
    data: {} as SpotifyArtist,
    loading: false,
  })
  const [artistTopTracks, setArtistTopTracks] = useState<RepositoryResponse<SpotifyArtistTopTracksResponse>>({
    data: { tracks: [] },
    loading: false,
  })
  const [artistAlbums, setArtistAlbums] = useState<RepositoryResponse<SpotifyArtistAlbumsResponse>>({
    data: { items: [], total: 0, limit: 20, offset: 0, next: null, previous: null },
    loading: false,
  })

  // Verificar autenticação na inicialização
  useEffect(() => {
    const token = spotifyRepository.getAccessToken()
    setIsAuthenticated(!!token)
  }, [])

  // Login
  const login = useCallback(() => {
    const authUrl = spotifyRepository.getAuthUrl()
    window.location.href = authUrl
  }, [])

  // Logout
  const logout = useCallback(() => {
    spotifyRepository.logout()
    setIsAuthenticated(false)
    navigate('/')
  }, [navigate])

  // Processar callback de autenticação
  const processAuthCallback = useCallback((url: string) => {
    const token = spotifyRepository.extractTokenFromUrl(url)
    if (token) {
      spotifyRepository.setAccessToken(token)
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
      const response = await spotifyRepository.searchArtists(params.query, params)
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
      const response = await spotifyRepository.getArtist(artistId)
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
      const response = await spotifyRepository.getArtistTopTracks(artistId, market)
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
  const getArtistAlbums = useCallback(async (artistId: string, params: AlbumParams = {}) => {
    setArtistAlbums(prev => ({ ...prev, loading: true, error: undefined }))
    
    try {
      const response = await spotifyRepository.getArtistAlbums(artistId, params)
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

  // Limpar resultados da busca
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
    // State
    isAuthenticated,
    searchResults,
    currentArtist,
    artistTopTracks,
    artistAlbums,
    
    // Actions
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
