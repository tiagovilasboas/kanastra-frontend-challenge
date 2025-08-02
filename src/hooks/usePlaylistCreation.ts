import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@/config/react-query'

interface CreatePlaylistParams {
  name: string
  description?: string
  isPublic?: boolean
}

interface AddTracksToPlaylistParams {
  playlistId: string
  trackUris: string[]
}

interface SpotifyPlaylist {
  id: string
  name: string
  description?: string
  public: boolean
}

interface UsePlaylistCreationReturn {
  createPlaylist: (params: CreatePlaylistParams) => Promise<SpotifyPlaylist>
  addTracksToPlaylist: (params: AddTracksToPlaylistParams) => Promise<{ success: boolean }>
  isCreating: boolean
  isAddingTracks: boolean
  error: Error | null
}

export function usePlaylistCreation(): UsePlaylistCreationReturn {
  const queryClient = useQueryClient()

  // Create Playlist Mutation
  const {
    mutateAsync: createPlaylistMutation,
    isPending: isCreating,
    error: createError,
  } = useMutation({
    mutationFn: async (params: CreatePlaylistParams) => {
      // TODO: Implement when we have playlist-modify-public/private scope
      // return await spotifyRepository.createPlaylist(params)
      console.log('Creating playlist:', params)
      return { id: 'mock-playlist-id', ...params }
    },
    onSuccess: () => {
      // Invalidate user playlists cache
      queryClient.invalidateQueries({
        queryKey: queryKeys.user.playlists(),
      })
    },
  })

  // Add Tracks to Playlist Mutation
  const {
    mutateAsync: addTracksMutation,
    isPending: isAddingTracks,
    error: addTracksError,
  } = useMutation({
    mutationFn: async (params: AddTracksToPlaylistParams) => {
      // TODO: Implement when we have playlist-modify-public/private scope
      // return await spotifyRepository.addTracksToPlaylist(params)
      console.log('Adding tracks to playlist:', params)
      return { success: true }
    },
    onSuccess: () => {
      // Invalidate user playlists cache
      queryClient.invalidateQueries({
        queryKey: queryKeys.user.playlists(),
      })
    },
  })

  return {
    createPlaylist: createPlaylistMutation,
    addTracksToPlaylist: addTracksMutation,
    isCreating,
    isAddingTracks,
    error: (createError || addTracksError) as Error | null,
  }
} 