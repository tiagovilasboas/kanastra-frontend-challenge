import axios, { AxiosInstance } from 'axios'

import {
  SpotifyAlbum,
  SpotifyArtist,
  SpotifyTrack,
  validateSpotifyAlbumsResponse,
  validateSpotifyArtist,
  validateSpotifySearchResponse,
  validateSpotifyTracksResponse,
} from '@/schemas/spotify'
import { errorHandler } from '@/utils/errorHandler'
import { logger } from '@/utils/logger'

export interface SpotifySearchConfig {
  baseURL: string
  accessToken?: string
  clientToken?: string
}

export class SpotifySearchService {
  private axiosInstance: AxiosInstance
  private accessToken?: string
  private clientToken?: string

  constructor(config: SpotifySearchConfig) {
    this.axiosInstance = axios.create({
      baseURL: config.baseURL,
      timeout: 10000,
    })

    this.accessToken = config.accessToken
    this.clientToken = config.clientToken

    this.setupInterceptors()
  }

  setAccessToken(token: string): void {
    this.accessToken = token
    logger.debug('Access token set for search service')
  }

  setClientToken(token: string): void {
    this.clientToken = token
    logger.debug('Client token set for search service', {
      hasToken: !!token,
      tokenLength: token?.length || 0,
      tokenPreview: token ? token.substring(0, 10) + '...' : 'none',
    })
  }

  hasAccessToken(): boolean {
    return !!this.accessToken
  }

  hasClientToken(): boolean {
    return !!this.clientToken
  }

  // Search artists with user authentication
  async searchArtists(query: string, limit: number = 20, offset: number = 0) {
    try {
      logger.debug('Searching artists with user authentication', {
        query,
        limit,
        offset,
      })

      if (!this.accessToken) {
        throw new Error('Access token required for authenticated search')
      }

      const response = await this.axiosInstance.get('/search', {
        params: {
          q: query,
          type: 'artist',
          limit,
          offset,
        },
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      })

      const validatedData = validateSpotifySearchResponse(response.data)
      logger.debug('Artist search successful', {
        query,
        resultsCount: validatedData.artists.items.length,
        total: validatedData.artists.total,
        limit,
        offset,
      })

      return validatedData
    } catch (error) {
      const appError = errorHandler.handleApiError(
        error,
        'SpotifySearchService.searchArtists',
      )
      throw appError
    }
  }

  // Search artists with client credentials (public)
  async searchArtistsPublic(
    query: string,
    limit: number = 20,
    offset: number = 0,
  ) {
    try {
      logger.debug('Searching artists with client credentials', {
        query,
        limit,
        offset,
      })

      if (!this.clientToken) {
        throw new Error('Client token required for public search')
      }

      const response = await this.axiosInstance.get('/search', {
        params: {
          q: query,
          type: 'artist',
          limit,
          offset,
        },
        headers: {
          Authorization: `Bearer ${this.clientToken}`,
        },
      })

      const validatedData = validateSpotifySearchResponse(response.data)
      logger.debug('Public artist search successful', {
        query,
        resultsCount: validatedData.artists.items.length,
        total: validatedData.artists.total,
        limit,
        offset,
      })

      return validatedData
    } catch (error) {
      const appError = errorHandler.handleApiError(
        error,
        'SpotifySearchService.searchArtistsPublic',
      )
      throw appError
    }
  }

  // Get artist details
  async getArtistDetails(artistId: string): Promise<SpotifyArtist> {
    try {
      logger.debug('Getting artist details', { artistId })

      if (!this.accessToken && !this.clientToken) {
        throw new Error('Authentication token required')
      }

      const token = this.accessToken || this.clientToken
      const response = await this.axiosInstance.get(`/artists/${artistId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const validatedData = validateSpotifyArtist(response.data)
      logger.debug('Artist details retrieved successfully', { artistId })

      return validatedData
    } catch (error) {
      const appError = errorHandler.handleApiError(
        error,
        'SpotifySearchService.getArtistDetails',
      )
      throw appError
    }
  }

  // Get artist top tracks - UPDATED VERSION
  async getArtistTopTracks(
    artistId: string,
    market: string = 'US',
  ): Promise<SpotifyTrack[]> {
    try {
      logger.debug('=== TOP TRACKS METHOD CALLED - UPDATED VERSION ===')
      logger.debug('Getting artist top tracks', {
        artistId,
        market,
        hasAccessToken: !!this.accessToken,
        hasClientToken: !!this.clientToken,
        accessTokenLength: this.accessToken?.length || 0,
        clientTokenLength: this.clientToken?.length || 0,
      })

      // Use access token if available, otherwise use client token
      const token = this.accessToken || this.clientToken
      const tokenType = this.accessToken ? 'access' : 'client'

      if (!token) {
        logger.error('No tokens available for top tracks', {
          artistId,
          hasAccessToken: !!this.accessToken,
          hasClientToken: !!this.clientToken,
          accessTokenLength: this.accessToken?.length || 0,
          clientTokenLength: this.clientToken?.length || 0,
        })
        throw new Error('Authentication token required for top tracks')
      }

      logger.debug(`Using ${tokenType} token for top tracks`, {
        tokenLength: token.length,
        tokenPreview: token.substring(0, 10) + '...',
      })

      const response = await this.axiosInstance.get(
        `/artists/${artistId}/top-tracks`,
        {
          params: { market },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      const validatedData = validateSpotifyTracksResponse(response.data)
      logger.debug('Artist top tracks retrieved successfully', {
        artistId,
        tracksCount: validatedData.tracks.length,
      })

      return validatedData.tracks
    } catch (error) {
      const appError = errorHandler.handleApiError(
        error,
        'SpotifySearchService.getArtistTopTracks',
      )
      throw appError
    }
  }

  // Get artist albums
  async getArtistAlbums(
    artistId: string,
    includeGroups: string[] = ['album', 'single'],
    limit: number = 20,
    offset: number = 0,
  ): Promise<SpotifyAlbum[]> {
    try {
      logger.debug('Getting artist albums', {
        artistId,
        includeGroups,
        limit,
        offset,
      })

      if (!this.accessToken && !this.clientToken) {
        throw new Error('Authentication token required')
      }

      const token = this.accessToken || this.clientToken
      const response = await this.axiosInstance.get(
        `/artists/${artistId}/albums`,
        {
          params: {
            include_groups: includeGroups.join(','),
            limit,
            offset,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      logger.debug('Validating albums response', {
        artistId,
        responseKeys: Object.keys(response.data || {}),
        itemsCount: response.data?.items?.length || 0,
      })

      const validatedData = validateSpotifyAlbumsResponse(response.data)
      logger.debug('Artist albums retrieved successfully', {
        artistId,
        albumsCount: validatedData.items.length,
      })

      return validatedData.items
    } catch (error) {
      logger.error('Album validation failed', {
        artistId,
        error: error instanceof Error ? error.message : 'Unknown error',
        responseData:
          error instanceof Error && 'response' in error
            ? (error as { response?: { data?: unknown } }).response?.data
            : 'No response data',
      })

      const appError = errorHandler.handleApiError(
        error,
        'SpotifySearchService.getArtistAlbums',
      )
      throw appError
    }
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        logger.debug('Spotify API request', {
          method: config.method?.toUpperCase(),
          url: config.url,
          params: config.params,
        })
        return config
      },
      (error) => {
        logger.error('Spotify API request error', error)
        return Promise.reject(error)
      },
    )

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        logger.debug('Spotify API response', {
          status: response.status,
          url: response.config.url,
        })
        return response
      },
      (error) => {
        logger.error('Spotify API response error', {
          status: error.response?.status,
          message: error.response?.data?.error?.message || error.message,
          url: error.config?.url,
        })
        return Promise.reject(error)
      },
    )
  }
}
