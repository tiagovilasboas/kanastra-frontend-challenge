import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import { SpotifyAlbum, SpotifyArtist, SpotifyTrack } from '@/types/spotify'

interface SpotifyState {
  // Authentication
  isAuthenticated: boolean
  accessToken: string | null

  // Search
  searchQuery: string
  searchResults: SpotifyArtist[]
  isSearching: boolean
  searchError: string | null

  // Current Artist
  currentArtist: SpotifyArtist | null
  artistTopTracks: SpotifyTrack[]
  artistAlbums: SpotifyAlbum[]

  // Pagination
  currentPage: number
  totalPages: number
  albumFilter: string

  // Loading States
  isLoadingArtist: boolean
  isLoadingTracks: boolean
  isLoadingAlbums: boolean

  // Actions
  setAuthenticated: (token: string) => void
  logout: () => void
  setSearchQuery: (query: string) => void
  setSearchResults: (results: SpotifyArtist[]) => void
  setSearching: (loading: boolean) => void
  setSearchError: (error: string | null) => void
  setCurrentArtist: (artist: SpotifyArtist | null) => void
  setArtistTopTracks: (tracks: SpotifyTrack[]) => void
  setArtistAlbums: (albums: SpotifyAlbum[]) => void
  setPagination: (page: number, total: number) => void
  setAlbumFilter: (filter: string) => void
  setLoadingStates: (
    states: Partial<{
      artist: boolean
      tracks: boolean
      albums: boolean
    }>,
  ) => void
  clearSearch: () => void
  clearArtist: () => void
}

export const useSpotifyStore = create<SpotifyState>()(
  devtools(
    (set, get) => ({
      // Initial State
      isAuthenticated: false,
      accessToken: null,
      searchQuery: '',
      searchResults: [],
      isSearching: false,
      searchError: null,
      currentArtist: null,
      artistTopTracks: [],
      artistAlbums: [],
      currentPage: 1,
      totalPages: 0,
      albumFilter: '',
      isLoadingArtist: false,
      isLoadingTracks: false,
      isLoadingAlbums: false,

      // Actions
      setAuthenticated: (token: string) =>
        set({
          isAuthenticated: true,
          accessToken: token,
          searchError: null,
        }),

      logout: () =>
        set({
          isAuthenticated: false,
          accessToken: null,
          searchQuery: '',
          searchResults: [],
          currentArtist: null,
          artistTopTracks: [],
          artistAlbums: [],
          currentPage: 1,
          totalPages: 0,
          albumFilter: '',
          searchError: null,
        }),

      setSearchQuery: (query: string) => set({ searchQuery: query }),

      setSearchResults: (results: SpotifyArtist[]) =>
        set({ searchResults: results, searchError: null }),

      setSearching: (loading: boolean) => set({ isSearching: loading }),

      setSearchError: (error: string | null) => set({ searchError: error }),

      setCurrentArtist: (artist: SpotifyArtist | null) =>
        set({ currentArtist: artist }),

      setArtistTopTracks: (tracks: SpotifyTrack[]) =>
        set({ artistTopTracks: tracks }),

      setArtistAlbums: (albums: SpotifyAlbum[]) =>
        set({ artistAlbums: albums }),

      setPagination: (page: number, total: number) =>
        set({ currentPage: page, totalPages: total }),

      setAlbumFilter: (filter: string) => set({ albumFilter: filter }),

      setLoadingStates: (states) =>
        set({
          isLoadingArtist: states.artist ?? get().isLoadingArtist,
          isLoadingTracks: states.tracks ?? get().isLoadingTracks,
          isLoadingAlbums: states.albums ?? get().isLoadingAlbums,
        }),

      clearSearch: () =>
        set({
          searchQuery: '',
          searchResults: [],
          searchError: null,
        }),

      clearArtist: () =>
        set({
          currentArtist: null,
          artistTopTracks: [],
          artistAlbums: [],
          currentPage: 1,
          totalPages: 0,
          albumFilter: '',
        }),
    }),
    {
      name: 'spotify-store',
    },
  ),
)
