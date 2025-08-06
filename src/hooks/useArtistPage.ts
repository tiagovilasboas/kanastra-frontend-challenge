import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useState } from 'react'

import { spotifyRepository } from '@/repositories'
import { logger } from '@/utils/logger'

export function useArtistPage(artistId: string) {
  const queryClient = useQueryClient()
  const [currentPage, setCurrentPage] = useState(1)
  const [albumsPerPage] = useState(20) // Fixo em 20 por página

  // Query para dados do artista
  const {
    data: artist,
    isLoading: isLoadingArtist,
    error: artistError,
  } = useQuery({
    queryKey: ['artist', 'details', artistId],
    queryFn: async () => {
      if (!artistId) {
        throw new Error('Artist ID is required')
      }
      return await spotifyRepository.getArtistDetails(artistId)
    },
    enabled: !!artistId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 2,
  })

  // Query para top tracks do artista
  const {
    data: topTracks,
    isLoading: isLoadingTracks,
    error: tracksError,
  } = useQuery({
    queryKey: ['artist', 'topTracks', artistId],
    queryFn: async () => {
      if (!artistId) {
        throw new Error('Artist ID is required')
      }
      return await spotifyRepository.getArtistTopTracks(artistId, 'BR')
    },
    enabled: !!artistId,
    staleTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
  })

  // Query para álbuns do artista com paginação manual
  const {
    data: albumsResponse,
    isLoading: isLoadingAlbums,
    error: albumsError,
  } = useQuery({
    queryKey: ['artist', 'albums', artistId, currentPage, albumsPerPage],
    queryFn: async () => {
      if (!artistId) {
        throw new Error('Artist ID is required')
      }
      const offset = (currentPage - 1) * albumsPerPage
      return await spotifyRepository.getArtistAlbums(
        artistId,
        ['album', 'single'],
        albumsPerPage,
        offset,
      )
    },
    enabled: !!artistId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 2,
  })

  // Query para total de álbuns (para calcular páginas)
  const { data: totalAlbumsResponse } = useQuery({
    queryKey: ['artist', 'albums-total', artistId],
    queryFn: async () => {
      if (!artistId) {
        throw new Error('Artist ID is required')
      }
      // Busca com limite alto para obter o total
      return await spotifyRepository.getArtistAlbums(
        artistId,
        ['album', 'single'],
        50, // Limite alto para obter total aproximado
        0,
      )
    },
    enabled: !!artistId,
    staleTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
  })

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const handleRefresh = useCallback(async () => {
    try {
      // Invalidate and refetch all queries
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['artist', 'details', artistId],
        }),
        queryClient.invalidateQueries({
          queryKey: ['artist', 'topTracks', artistId],
        }),
        queryClient.invalidateQueries({
          queryKey: ['artist', 'albums', artistId],
        }),
        queryClient.invalidateQueries({
          queryKey: ['artist', 'albums-total', artistId],
        }),
      ])
    } catch (error) {
      logger.error('Failed to refresh artist data', error)
    }
  }, [artistId, queryClient])

  // Cálculos de paginação
  const albums = albumsResponse || []
  const totalAlbums = totalAlbumsResponse?.length || 0
  const totalPages = Math.ceil(totalAlbums / albumsPerPage)
  const hasNextPage = currentPage < totalPages
  const hasPreviousPage = currentPage > 1

  return {
    artist: artist || null,
    topTracks: topTracks || [],
    albums,
    currentPage,
    totalPages,
    totalItems: totalAlbums,
    hasNextPage,
    hasPreviousPage,
    isLoadingArtist,
    isLoadingTracks,
    isLoadingAlbums,
    artistError: artistError ? String(artistError) : null,
    tracksError: tracksError ? String(tracksError) : null,
    albumsError: albumsError ? String(albumsError) : null,
    handlePageChange,
    handleRefresh,
  }
}
