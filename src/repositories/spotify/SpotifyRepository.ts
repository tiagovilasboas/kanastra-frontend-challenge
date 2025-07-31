import { SpotifyArtist } from '@/types/spotify'

import {
  AlbumParams,
  SearchParams,
  SpotifyArtistAlbumsResponse,
  SpotifyArtistTopTracksResponse,
  SpotifyRepository as ISpotifyRepository,
  SpotifySearchResponse,
} from './types'

// Abstract interface for Spotify Repository
export interface SpotifyRepository extends ISpotifyRepository {
  // Authentication
  getAuthUrl(): string
  extractTokenFromUrl(url: string): string | null
  setAccessToken(token: string): void
  getAccessToken(): string | null
  isAuthenticated(): boolean
  logout(): void

  // Artists
  searchArtists(query: string, params?: SearchParams): Promise<SpotifySearchResponse>
  getArtist(id: string): Promise<SpotifyArtist>
  getArtistTopTracks(artistId: string, market?: string): Promise<SpotifyArtistTopTracksResponse>
  getArtistAlbums(artistId: string, params?: AlbumParams): Promise<SpotifyArtistAlbumsResponse>
} 