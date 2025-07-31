import { SpotifyArtist, SpotifyAlbum, SpotifyTrack } from '@/types/spotify'

export interface SpotifyRepository {
  getAuthUrl(): string
  extractTokenFromUrl(url: string): string | null
  setAccessToken(token: string): void
  getAccessToken(): string | null
  isAuthenticated(): boolean
  logout(): void

  searchArtists(query: string, params?: SearchParams): Promise<SpotifySearchResponse>
  getArtist(id: string): Promise<SpotifyArtist>
  getArtistTopTracks(artistId: string, market?: string): Promise<SpotifyArtistTopTracksResponse>
  getArtistAlbums(artistId: string, params?: AlbumParams): Promise<SpotifyArtistAlbumsResponse>
}

export interface SearchParams {
  query: string
  type: 'artist' | 'track' | 'album'
  limit?: number
  offset?: number
}

export interface AlbumParams {
  limit?: number
  offset?: number
  include_groups?: string
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

export interface SpotifyConfig {
  clientId: string
  redirectUri: string
  scopes: string[]
  baseUrl: string
}

export interface SpotifyError {
  error: {
    status: number
    message: string
  }
} 