import {
  SpotifyAlbum as SpotifyAlbumSchema,
  SpotifyTrack,
} from '@/schemas/spotify'

// Re-export SpotifyTrack and SpotifyAlbum for backward compatibility
export type { SpotifyTrack }
export type { SpotifyAlbumSchema as SpotifyAlbum }

export interface SpotifyImage {
  url: string
  height: number
  width: number
}

export interface SpotifyArtist {
  id: string
  name: string
  images: SpotifyImage[]
  popularity?: number
  followers: {
    total: number
  }
  genres: string[]
  external_urls?: {
    spotify: string
  }
}

// SpotifyTrack is now imported from @/schemas/spotify

export interface SpotifySearchResponse {
  artists: {
    items: SpotifyArtist[]
    total: number
    limit: number
    offset: number
    next: string | null
    previous: string | null
  }
}

export interface SpotifyArtistTopTracksResponse {
  tracks: SpotifyTrack[]
}

export interface SpotifyArtistAlbumsResponse {
  items: SpotifyAlbumSchema[]
  total: number
  limit: number
  offset: number
  next: string | null
  previous: string | null
}

export interface SpotifyError {
  error: {
    status: number
    message: string
  }
}

export interface ApiResponse<T> {
  data: T | null
  error?: string
  loading: boolean
}

export interface SearchParams {
  query: string
  type: 'artist' | 'track' | 'album'
  limit?: number
  offset?: number
}

export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  hasNext: boolean
  hasPrevious: boolean
}
