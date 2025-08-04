import { SpotifyAlbum, SpotifyArtist, SpotifyTrack } from './spotify'

// Search domain types - expanded with advanced filters
export interface SearchResult {
  artists: SpotifyArtist[]
  albums?: SpotifyAlbum[]
  tracks?: SpotifyTrack[]
}

export interface SearchState {
  query: string
  debouncedQuery: string
  page: number
  limit: number
  hasMore: boolean
  isLoading: boolean
  isLoadingMore: boolean
  error: string | null
  totalResults: number
}

// Advanced search filters
export interface SearchFilters {
  // Type filters
  types: ('artist' | 'album' | 'track')[]

  // Genre filters
  genres?: string[]

  // Year range
  yearFrom?: number
  yearTo?: number

  // Popularity range
  popularityFrom?: number
  popularityTo?: number

  // Market
  market?: string

  // Content filters
  includeExplicit?: boolean
  includeExternal?: boolean
}

// Search parameters
export interface SearchParams {
  query: string
  types: ('artist' | 'album' | 'track')[]
  filters?: SearchFilters
  limit?: number
  offset?: number
}

// Search API response types
export interface SearchAPIResponse {
  artists?: {
    items: SpotifyArtist[]
    total: number
    limit: number
    offset: number
  }
  albums?: {
    items: SpotifyAlbum[]
    total: number
    limit: number
    offset: number
  }
  tracks?: {
    items: SpotifyTrack[]
    total: number
    limit: number
    offset: number
  }
}

// Search filter options
export const SEARCH_FILTER_OPTIONS = {
  types: [
    { value: 'artist', label: 'Artistas' },
    { value: 'album', label: 'Álbuns' },
    { value: 'track', label: 'Músicas' },
  ],
  genres: [
    'rock',
    'pop',
    'hip-hop',
    'electronic',
    'jazz',
    'classical',
    'country',
    'r&b',
    'reggae',
    'blues',
    'folk',
    'metal',
  ],
  markets: [
    { value: 'BR', label: 'Brasil' },
    { value: 'US', label: 'Estados Unidos' },
    { value: 'GB', label: 'Reino Unido' },
    { value: 'CA', label: 'Canadá' },
  ],
} as const
