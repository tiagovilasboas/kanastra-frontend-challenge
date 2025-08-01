import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

import { queryKeys } from '@/config/react-query'
import { SpotifyAlbum, SpotifyArtist, SpotifyTrack } from '@/types/spotify'

interface OptimisticUpdateOptions {
  rollbackOnError?: boolean
  updateQueries?: boolean
}

export function useOptimisticUpdates() {
  const queryClient = useQueryClient()

  // Optimistically update artist data
  const optimisticallyUpdateArtist = useCallback(
    (
      artistId: string,
      updates: Partial<SpotifyArtist>,
      options: OptimisticUpdateOptions = {},
    ) => {
      const { rollbackOnError = true, updateQueries = true } = options

      // Store previous data for rollback
      const previousData = queryClient.getQueryData<SpotifyArtist>(
        queryKeys.artists.details(artistId),
      )

      // Optimistically update the cache
      queryClient.setQueryData<SpotifyArtist>(
        queryKeys.artists.details(artistId),
        (oldData) => {
          if (!oldData) return oldData
          return { ...oldData, ...updates }
        },
      )

      // Update related queries if needed
      if (updateQueries) {
        // Update search results that contain this artist
        queryClient.setQueriesData<{ artists: { items: SpotifyArtist[] } }>(
          { queryKey: queryKeys.search.all },
          (oldData) => {
            if (!oldData?.artists?.items) return oldData

            return {
              ...oldData,
              artists: {
                ...oldData.artists,
                items: oldData.artists.items.map((artist) =>
                  artist.id === artistId ? { ...artist, ...updates } : artist,
                ),
              },
            }
          },
        )
      }

      return {
        rollback: () => {
          if (rollbackOnError && previousData) {
            queryClient.setQueryData(
              queryKeys.artists.details(artistId),
              previousData,
            )
          }
        },
      }
    },
    [queryClient],
  )

  // Optimistically update album data
  const optimisticallyUpdateAlbum = useCallback(
    (
      artistId: string,
      albumId: string,
      updates: Partial<SpotifyAlbum>,
      options: OptimisticUpdateOptions = {},
    ) => {
      const { rollbackOnError = true } = options

      // Store previous data for rollback
      const previousData = queryClient.getQueryData<{
        albums: SpotifyAlbum[]
        total: number
        totalPages: number
      }>(queryKeys.artists.albums(artistId, 1, 20))

      // Optimistically update the cache
      queryClient.setQueriesData<{
        albums: SpotifyAlbum[]
        total: number
        totalPages: number
      }>({ queryKey: queryKeys.artists.albums(artistId, 1, 20) }, (oldData) => {
        if (!oldData?.albums) return oldData

        return {
          ...oldData,
          albums: oldData.albums.map((album) =>
            album.id === albumId ? { ...album, ...updates } : album,
          ),
        }
      })

      return {
        rollback: () => {
          if (rollbackOnError && previousData) {
            queryClient.setQueryData(
              queryKeys.artists.albums(artistId, 1, 20),
              previousData,
            )
          }
        },
      }
    },
    [queryClient],
  )

  // Optimistically update track data
  const optimisticallyUpdateTrack = useCallback(
    (
      artistId: string,
      trackId: string,
      updates: Partial<SpotifyTrack>,
      options: OptimisticUpdateOptions = {},
    ) => {
      const { rollbackOnError = true } = options

      // Store previous data for rollback
      const previousData = queryClient.getQueryData<SpotifyTrack[]>(
        queryKeys.artists.topTracks(artistId),
      )

      // Optimistically update the cache
      queryClient.setQueryData<SpotifyTrack[]>(
        queryKeys.artists.topTracks(artistId),
        (oldData) => {
          if (!oldData) return oldData

          return oldData.map((track) =>
            track.id === trackId ? { ...track, ...updates } : track,
          )
        },
      )

      return {
        rollback: () => {
          if (rollbackOnError && previousData) {
            queryClient.setQueryData(
              queryKeys.artists.topTracks(artistId),
              previousData,
            )
          }
        },
      }
    },
    [queryClient],
  )

  // Optimistically add new album to artist's albums
  const optimisticallyAddAlbum = useCallback(
    (
      artistId: string,
      newAlbum: SpotifyAlbum,
      options: OptimisticUpdateOptions = {},
    ) => {
      const { rollbackOnError = true } = options

      // Store previous data for rollback
      const previousData = queryClient.getQueryData<{
        albums: SpotifyAlbum[]
        total: number
        totalPages: number
      }>(queryKeys.artists.albums(artistId, 1, 20))

      // Optimistically update the cache
      queryClient.setQueriesData<{
        albums: SpotifyAlbum[]
        total: number
        totalPages: number
      }>({ queryKey: queryKeys.artists.albums(artistId, 1, 20) }, (oldData) => {
        if (!oldData) return oldData

        return {
          ...oldData,
          albums: [newAlbum, ...oldData.albums],
          total: oldData.total + 1,
        }
      })

      return {
        rollback: () => {
          if (rollbackOnError && previousData) {
            queryClient.setQueryData(
              queryKeys.artists.albums(artistId, 1, 20),
              previousData,
            )
          }
        },
      }
    },
    [queryClient],
  )

  // Optimistically remove album from artist's albums
  const optimisticallyRemoveAlbum = useCallback(
    (
      artistId: string,
      albumId: string,
      options: OptimisticUpdateOptions = {},
    ) => {
      const { rollbackOnError = true } = options

      // Store previous data for rollback
      const previousData = queryClient.getQueryData<{
        albums: SpotifyAlbum[]
        total: number
        totalPages: number
      }>(queryKeys.artists.albums(artistId, 1, 20))

      // Optimistically update the cache
      queryClient.setQueriesData<{
        albums: SpotifyAlbum[]
        total: number
        totalPages: number
      }>({ queryKey: queryKeys.artists.albums(artistId, 1, 20) }, (oldData) => {
        if (!oldData) return oldData

        return {
          ...oldData,
          albums: oldData.albums.filter((album) => album.id !== albumId),
          total: Math.max(0, oldData.total - 1),
        }
      })

      return {
        rollback: () => {
          if (rollbackOnError && previousData) {
            queryClient.setQueryData(
              queryKeys.artists.albums(artistId, 1, 20),
              previousData,
            )
          }
        },
      }
    },
    [queryClient],
  )

  return {
    optimisticallyUpdateArtist,
    optimisticallyUpdateAlbum,
    optimisticallyUpdateTrack,
    optimisticallyAddAlbum,
    optimisticallyRemoveAlbum,
  }
}
