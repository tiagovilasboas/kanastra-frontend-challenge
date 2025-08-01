import axios, { AxiosInstance, AxiosResponse } from 'axios'

import { getApiConfig, getSpotifyConfig } from '@/config/environment'
import { SpotifyAlbum, SpotifyArtist, SpotifyTrack } from '@/types/spotify'

import { RepositoryError } from '../base/BaseRepository'

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

export interface SpotifyError {
  error: {
    status: number
    message: string
  }
}

export class SpotifyRepository {
  private api: AxiosInstance
  private accessToken: string | null = null
  private config = getSpotifyConfig()
  private apiConfig = getApiConfig()

  constructor() {
    this.api = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.apiConfig.timeout,
    })

    this.setupInterceptors()
  }

  getAuthUrl(): string {
    const { clientId, redirectUri, scopes } = this.config
    const scopeString = scopes.join(' ')

    return `${this.config.authUrl}?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(
      redirectUri,
    )}&scope=${encodeURIComponent(scopeString)}`
  }

  extractTokenFromUrl(url: string): string | null {
    const hash = url.split('#')[1]
    if (!hash) return null

    const params = new URLSearchParams(hash)
    return params.get('access_token')
  }

  setAccessToken(token: string): void {
    this.accessToken = token
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  getAccessToken(): string | null {
    return this.accessToken
  }

  isAuthenticated(): boolean {
    return !!this.accessToken
  }

  logout(): void {
    this.accessToken = null
    delete this.api.defaults.headers.common['Authorization']
    localStorage.removeItem('spotify_token')
  }

  async searchArtists(
    query: string,
    params: SearchParams = { query, type: 'artist', limit: 20, offset: 0 },
  ): Promise<SpotifySearchResponse> {
    try {
      const response: AxiosResponse<SpotifySearchResponse> = await this.api.get(
        '/search',
        {
          params: {
            q: params.query,
            type: 'artist',
            limit: params.limit || 20,
            offset: params.offset || 0,
          },
        },
      )
      return response.data
    } catch (error) {
      throw this.handleError(error, 'Failed to search artists')
    }
  }

  async getArtist(id: string): Promise<SpotifyArtist> {
    try {
      const response: AxiosResponse<SpotifyArtist> = await this.api.get(
        `/artists/${id}`,
      )
      return response.data
    } catch (error) {
      throw this.handleError(error, `Failed to get artist ${id}`)
    }
  }

  async getArtistTopTracks(
    artistId: string,
    market: string = 'BR',
  ): Promise<SpotifyArtistTopTracksResponse> {
    try {
      const response: AxiosResponse<SpotifyArtistTopTracksResponse> =
        await this.api.get(`/artists/${artistId}/top-tracks?market=${market}`)
      return response.data
    } catch (error) {
      throw this.handleError(
        error,
        `Failed to get top tracks for artist ${artistId}`,
      )
    }
  }

  async getArtistAlbums(
    artistId: string,
    params: AlbumParams = {},
  ): Promise<SpotifyArtistAlbumsResponse> {
    try {
      const response: AxiosResponse<SpotifyArtistAlbumsResponse> =
        await this.api.get(`/artists/${artistId}/albums`, {
          params: {
            limit: params.limit || 20,
            offset: params.offset || 0,
            include_groups: params.include_groups || 'album,single',
          },
        })
      return response.data
    } catch (error) {
      throw this.handleError(
        error,
        `Failed to get albums for artist ${artistId}`,
      )
    }
  }

  private setupInterceptors(): void {
    this.api.interceptors.request.use(
      (config) => {
        if (this.accessToken) {
          config.headers.Authorization = `Bearer ${this.accessToken}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      },
    )

    this.api.interceptors.response.use(
      (response) => {
        return response
      },
      (error) => {
        if (error.response?.status === 401) {
          this.handleTokenExpired()
        }
        return Promise.reject(error)
      },
    )
  }

  private handleError(error: unknown, message: string): RepositoryError {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as {
        response?: { data?: unknown; status?: number }
      }

      if (axiosError.response?.data) {
        const spotifyError = axiosError.response.data as SpotifyError
        return new RepositoryError(
          spotifyError.error.message,
          spotifyError.error.status,
          error,
        )
      }

      if (axiosError.response?.status) {
        return new RepositoryError(
          `${message}: HTTP ${axiosError.response.status}`,
          axiosError.response.status,
          error,
        )
      }
    }

    return new RepositoryError(message, undefined, error)
  }

  private handleTokenExpired(): void {
    this.accessToken = null
    delete this.api.defaults.headers.common['Authorization']
    window.location.href = this.getAuthUrl()
  }
}
