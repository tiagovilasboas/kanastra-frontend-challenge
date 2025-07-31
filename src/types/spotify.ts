// Spotify API Types

export interface SpotifyImage {
  url: string
  height: number
  width: number
}

export interface SpotifyArtist {
  id: string
  name: string
  images: SpotifyImage[]
  popularity: number
  genres: string[]
  external_urls: {
    spotify: string
  }
  followers: {
    total: number
  }
}

export interface SpotifyAlbum {
  id: string
  name: string
  images: SpotifyImage[]
  release_date: string
  total_tracks: number
  album_type: 'album' | 'single' | 'compilation'
  external_urls: {
    spotify: string
  }
  artists: SpotifyArtist[]
}

export interface SpotifyTrack {
  id: string
  name: string
  duration_ms: number
  explicit: boolean
  external_urls: {
    spotify: string
  }
  album: SpotifyAlbum
  artists: SpotifyArtist[]
  popularity: number
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
  items: SpotifyAlbum[]
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

// API Response types
export interface ApiResponse<T> {
  data: T
  error?: string
  loading: boolean
}

// Search parameters
export interface SearchParams {
  query: string
  type: 'artist' | 'track' | 'album'
  limit?: number
  offset?: number
}

// Pagination
export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  hasNext: boolean
  hasPrevious: boolean
} 