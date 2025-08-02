import { SpotifyAlbum as SpotifyAlbumSchema } from '@/schemas/spotify'

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

export interface SpotifyTrack {
  id: string
  name: string
  duration_ms: number
  track_number: number
  disc_number: number
  explicit: boolean
  popularity: number
  artists: SpotifyArtist[]
  album: SpotifyAlbumSchema
}

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
