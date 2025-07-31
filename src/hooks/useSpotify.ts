import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { spotifyRepository } from '@/repositories'
import { SpotifyAlbum, SpotifyArtist, SpotifyTrack } from '@/types/spotify'

interface UseSpotifyReturn {
  // State
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  searchResults: SpotifyArtist[]
  currentArtist: SpotifyArtist | null
  artistTopTracks: SpotifyTrack[]
  artistAlbums: SpotifyAlbum[]
  currentPage: number
  totalPages: number
  albumFilter: string

  // Actions
  login: () => void
  logout: () => void
  handleCallback: (url: string) => void
  searchArtists: (query: string) => Promise<void>
  getArtistDetails: (artistId: string) => Promise<void>
  getArtistTopTracks: (artistId: string) => Promise<void>
  getArtistAlbums: (artistId: string, page?: number) => Promise<void>
  clearSearch: () => void
  clearArtist: () => void
  setCurrentPage: (page: number) => void
  setAlbumFilter: (filter: string) => void
}

export function useSpotify(): UseSpotifyReturn {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchResults, setSearchResults] = useState<SpotifyArtist[]>([])
  const [currentArtist, setCurrentArtist] = useState<SpotifyArtist | null>(null)
  const [artistTopTracks, setArtistTopTracks] = useState<SpotifyTrack[]>([])
  const [artistAlbums, setArtistAlbums] = useState<SpotifyAlbum[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [albumFilter, setAlbumFilter] = useState('')

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
    setSearchResults([])
    setCurrentArtist(null)
    setArtistTopTracks([])
    setArtistAlbums([])
    setError(null)
    navigate('/')
  }, [navigate])

  const handleCallback = useCallback((url: string) => {
    const token = spotifyRepository.extractTokenFromUrl(url)
    if (token) {
      spotifyRepository.setAccessToken(token)
      localStorage.setItem('spotify_token', token)
      setIsAuthenticated(true)
      setError(null)
    }
  }, [])

  const searchArtists = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await spotifyRepository.searchArtists(query)
      setSearchResults(response.artists.items)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar artistas')
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getArtistDetails = useCallback(async (artistId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const artist = await spotifyRepository.getArtist(artistId)
      setCurrentArtist(artist)
      navigate(`/artist/${artistId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar artista')
    } finally {
      setIsLoading(false)
    }
  }, [navigate])

  const getArtistTopTracks = useCallback(async (artistId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await spotifyRepository.getArtistTopTracks(artistId)
      setArtistTopTracks(response.tracks)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar top tracks')
      setArtistTopTracks([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getArtistAlbums = useCallback(async (artistId: string, page = 1) => {
    setIsLoading(true)
    setError(null)

    try {
      const limit = 20
      const offset = (page - 1) * limit
      const response = await spotifyRepository.getArtistAlbums(artistId, {
        limit,
        offset,
      })

      setArtistAlbums(response.items)
      setCurrentPage(page)
      setTotalPages(Math.ceil(response.total / limit))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar álbuns')
      setArtistAlbums([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearSearch = useCallback(() => {
    setSearchResults([])
    setError(null)
  }, [])

  const clearArtist = useCallback(() => {
    setCurrentArtist(null)
    setArtistTopTracks([])
    setArtistAlbums([])
    setCurrentPage(1)
    setTotalPages(0)
    setAlbumFilter('')
    setError(null)
  }, [])

  return {
    isAuthenticated,
    isLoading,
    error,
    searchResults,
    currentArtist,
    artistTopTracks,
    artistAlbums,
    currentPage,
    totalPages,
    albumFilter,
    login,
    logout,
    handleCallback,
    searchArtists,
    getArtistDetails,
    getArtistTopTracks,
    getArtistAlbums,
    clearSearch,
    clearArtist,
    setCurrentPage,
    setAlbumFilter,
  }
}
