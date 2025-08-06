import {
  SpotifyAlbum as SpotifyAlbumSchema,
  SpotifyTrack,
} from '@/schemas/spotify'

// Re-export SpotifyTrack and SpotifyAlbum for backward compatibility
export type { SpotifyTrack }
export type { SpotifyAlbumSchema as SpotifyAlbum }

// Enum para tipos de busca - Single Source of Truth
export enum SpotifySearchType {
  ARTIST = 'artist',
  ALBUM = 'album',
  TRACK = 'track',
  PLAYLIST = 'playlist',
  SHOW = 'show',
  EPISODE = 'episode',
  AUDIOBOOK = 'audiobook',
  ALL = 'all', // Sentinel para busca em todos os tipos
}

// Array com todos os tipos para facilitar iterações
export const ALL_SPOTIFY_SEARCH_TYPES = Object.values(SpotifySearchType)

// Tipo para representar qualquer tipo de busca
export type SpotifySearchTypeValue = `${SpotifySearchType}`

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

export interface SpotifyPlaylist {
  id: string
  name: string
  description: string
  images: SpotifyImage[]
  owner: {
    id: string
    display_name: string
    type: string
  }
  public: boolean
  collaborative: boolean
  tracks: {
    total: number
  }
  external_urls?: {
    spotify: string
  }
}

export interface SpotifyShow {
  id: string
  name: string
  description: string
  images: SpotifyImage[]
  publisher: string
  total_episodes: number
  explicit: boolean
  external_urls?: {
    spotify: string
  }
}

export interface SpotifyEpisode {
  id: string
  name: string
  description: string
  images: SpotifyImage[]
  duration_ms: number
  release_date: string
  explicit: boolean
  show: {
    id: string
    name: string
  }
  external_urls?: {
    spotify: string
  }
}

export interface SpotifyAudiobook {
  id: string
  name: string
  description: string
  images: SpotifyImage[]
  authors: Array<{ name: string }>
  narrators: Array<{ name: string }>
  publisher: string
  total_chapters: number
  explicit: boolean
  external_urls?: {
    spotify: string
  }
}

// Mapeamento de tipos para suas interfaces correspondentes
export interface SpotifyTypeMapping {
  [SpotifySearchType.ARTIST]: SpotifyArtist
  [SpotifySearchType.ALBUM]: SpotifyAlbumSchema
  [SpotifySearchType.TRACK]: SpotifyTrack
  [SpotifySearchType.PLAYLIST]: SpotifyPlaylist
  [SpotifySearchType.SHOW]: SpotifyShow
  [SpotifySearchType.EPISODE]: SpotifyEpisode
  [SpotifySearchType.AUDIOBOOK]: SpotifyAudiobook
  [SpotifySearchType.ALL]: never // Sentinel não mapeia para nenhum tipo específico
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
  albums: {
    items: SpotifyAlbumSchema[]
    total: number
    limit: number
    offset: number
    next: string | null
    previous: string | null
  }
  tracks: {
    items: SpotifyTrack[]
    total: number
    limit: number
    offset: number
    next: string | null
    previous: string | null
  }
  playlists: {
    items: SpotifyPlaylist[]
    total: number
    limit: number
    offset: number
    next: string | null
    previous: string | null
  }
  shows: {
    items: SpotifyShow[]
    total: number
    limit: number
    offset: number
    next: string | null
    previous: string | null
  }
  episodes: {
    items: SpotifyEpisode[]
    total: number
    limit: number
    offset: number
    next: string | null
    previous: string | null
  }
  audiobooks: {
    items: SpotifyAudiobook[]
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
  type: SpotifySearchType
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
