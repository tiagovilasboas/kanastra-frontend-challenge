import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { logger } from '@/utils/logger'

/**
 * Hook centralizado para todos os handlers de navegação da aplicação.
 * Remove lógica de navegação dos componentes UI, mantendo-os puramente apresentacionais.
 */
export function useNavigationHandlers() {
  const navigate = useNavigate()
  const location = useLocation()

  /**
   * Navega para página de artista
   */
  const handleArtistClick = useCallback(
    (artistId: string) => {
      logger.debug('🎯 Navigation: Artist click', { artistId })
      navigate(`/artist/${artistId}`, {
        state: { from: location.pathname + location.search },
      })
    },
    [navigate, location.pathname, location.search],
  )

  /**
   * Navega para página de álbum
   */
  const handleAlbumClick = useCallback(
    (albumId: string) => {
      logger.debug('🎯 Navigation: Album click', { albumId })
      navigate(`/album/${albumId}`, {
        state: { from: location.pathname + location.search },
      })
    },
    [navigate, location.pathname, location.search],
  )

  /**
   * Abre URL do Spotify em nova aba
   */
  const handleSpotifyClick = useCallback((spotifyUrl: string) => {
    logger.debug('🎯 Navigation: Spotify click', { spotifyUrl })
    window.open(spotifyUrl, '_blank', 'noopener,noreferrer')
  }, [])

  /**
   * Navega para seção específica de busca
   */
  const handleSectionClick = useCallback(
    (type: string, searchQuery: string, market: string = 'BR') => {
      logger.debug('🎯 Navigation: Section click', {
        type,
        searchQuery,
        market,
      })
      const queryParams = new URLSearchParams({
        q: searchQuery,
        market,
      })
      navigate(`/search/${type}?${queryParams.toString()}`)
    },
    [navigate],
  )

  /**
   * Navega para página de busca com query
   */
  const handleSearchNavigation = useCallback(
    (searchQuery: string, market: string = 'BR') => {
      logger.debug('🎯 Navigation: Search navigation', { searchQuery, market })
      const queryParams = new URLSearchParams({
        q: searchQuery,
        market,
      })
      navigate(`/search?${queryParams.toString()}`)
    },
    [navigate],
  )

  /**
   * Navega para página inicial
   */
  const handleHomeClick = useCallback(() => {
    logger.debug('🎯 Navigation: Home click')
    navigate('/')
  }, [navigate])

  return {
    handleArtistClick,
    handleAlbumClick,
    handleSpotifyClick,
    handleSectionClick,
    handleSearchNavigation,
    handleHomeClick,
  }
}
