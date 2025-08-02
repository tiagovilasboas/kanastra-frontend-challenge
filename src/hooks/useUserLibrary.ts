import { useQuery } from '@tanstack/react-query'

import { cache, queryKeys } from '@/config/react-query'
import { spotifyRepository } from '@/repositories'
import { SpotifyAlbum,SpotifyTrack } from '@/schemas/spotify'

interface UseUserLibraryParams {
  enabled?: boolean
}

interface UseUserLibraryReturn {
  likedTracks: SpotifyTrack[]
  savedAlbums: SpotifyAlbum[]
  userPlaylists: SpotifyPlaylist[]
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

interface SpotifyPlaylist {
  id: string
  name: string
  description?: string
  public: boolean
  tracks: {
    total: number
    items: Array<{
      added_at: string
      track: SpotifyTrack
    }>
  }
}

export function useUserLibrary({
  enabled = true,
}: UseUserLibraryParams = {}): UseUserLibraryReturn {
  // Liked Tracks
  const { 
    data: likedTracks, 
    isLoading: isLoadingTracks, 
    error: tracksError,
    refetch: refetchTracks 
  } = useQuery({
    queryKey: queryKeys.user.likedTracks(),
    queryFn: async () => {
      // TODO: Implement when we have user-library-read scope
      // return await spotifyRepository.getUserLikedTracks()
      return []
    },
    enabled: enabled && spotifyRepository.isAuthenticated(),
    staleTime: cache.stale.OCCASIONAL,
    gcTime: cache.times.MEDIUM,
  })

  // Saved Albums
  const { 
    data: savedAlbums, 
    isLoading: isLoadingAlbums, 
    error: albumsError,
    refetch: refetchAlbums 
  } = useQuery({
    queryKey: queryKeys.user.savedAlbums(),
    queryFn: async () => {
      // TODO: Implement when we have user-library-read scope
      // return await spotifyRepository.getUserSavedAlbums()
      return []
    },
    enabled: enabled && spotifyRepository.isAuthenticated(),
    staleTime: cache.stale.OCCASIONAL,
    gcTime: cache.times.MEDIUM,
  })

  // User Playlists
  const { 
    data: userPlaylists, 
    isLoading: isLoadingPlaylists, 
    error: playlistsError,
    refetch: refetchPlaylists 
  } = useQuery({
    queryKey: queryKeys.user.playlists(),
    queryFn: async () => {
      // TODO: Implement when we have playlist-read-private scope
      // return await spotifyRepository.getUserPlaylists()
      return []
    },
    enabled: enabled && spotifyRepository.isAuthenticated(),
    staleTime: cache.stale.OCCASIONAL,
    gcTime: cache.times.MEDIUM,
  })

  return {
    likedTracks: (likedTracks as SpotifyTrack[]) || [],
    savedAlbums: (savedAlbums as SpotifyAlbum[]) || [],
    userPlaylists: userPlaylists || [],
    isLoading: isLoadingTracks || isLoadingAlbums || isLoadingPlaylists,
    error: (tracksError || albumsError || playlistsError) as Error | null,
    refetch: () => {
      refetchTracks()
      refetchAlbums()
      refetchPlaylists()
    },
  }
} 