import {
  SpotifyRepository as ISpotifyRepository,
  SearchParams,
  AlbumParams,
  SpotifySearchResponse,
  SpotifyArtistTopTracksResponse,
  SpotifyArtistAlbumsResponse,
} from './types'
import { SpotifyArtist } from '@/types/spotify'

export interface SpotifyRepository extends ISpotifyRepository {
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