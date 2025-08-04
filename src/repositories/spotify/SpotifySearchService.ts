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

export interface SearchFilters {
  year?: number
  genre?: string
  isrc?: string
  upc?: string
  tag?: string
}

export interface RecommendationParams {
  seed_artists?: string[]
  seed_genres?: string[]
  seed_tracks?: string[]
  target_energy?: number
  target_danceability?: number
  target_valence?: number
  target_tempo?: number
  target_popularity?: number
  limit?: number
}

export interface AudioFeatures {
  id: string
  danceability: number
  energy: number
  key: number
  loudness: number
  mode: number
  speechiness: number
  acousticness: number
  instrumentalness: number
  liveness: number
  valence: number
  tempo: number
  type: string
  uri: string
  track_href: string
  analysis_url: string
  duration_ms: number
  time_signature: number
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

  private getAuthToken(): string {
    const token = this.accessToken || this.clientToken
    if (!token) {
      throw new Error('Authentication token required')
    }
    return token
  }

  // Advanced search with filters
  async searchAdvanced(
    query: string,
    type: 'artist' | 'track' | 'album' | 'playlist',
    filters?: SearchFilters,
    limit: number = 20,
    offset: number = 0
  ) {
    try {
      logger.debug('Advanced search', { query, type, filters, limit, offset })

      const params: any = {
        q: query,
        type,
        limit,
        offset,
      }

      // Add filters to query
      if (filters) {
        const filterParts: string[] = []
        
        if (filters.year) {
          filterParts.push(`year:${filters.year}`)
        }
        if (filters.genre) {
          filterParts.push(`genre:${filters.genre}`)
        }
        if (filters.isrc) {
          filterParts.push(`isrc:${filters.isrc}`)
        }
        if (filters.upc) {
          filterParts.push(`upc:${filters.upc}`)
        }
        if (filters.tag) {
          filterParts.push(`tag:${filters.tag}`)
        }

        if (filterParts.length > 0) {
          params.q = `${query} ${filterParts.join(' ')}`
        }
      }

      const response = await this.axiosInstance.get('/search', {
        params,
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      })

      logger.debug('Advanced search successful', {
        query,
        type,
        resultsCount: response.data[type + 's']?.items?.length || 0,
      })

      return response.data
    } catch (error) {
      const appError = errorHandler.handleApiError(
        error,
        'SpotifySearchService.searchAdvanced',
      )
      throw appError
    }
  }

  // Get recommendations
  async getRecommendations(params: RecommendationParams): Promise<SpotifyTrack[]> {
    try {
      logger.debug('Getting recommendations', params)

      const response = await this.axiosInstance.get('/recommendations', {
        params,
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      })

      const validatedData = validateSpotifyTracksResponse(response.data)
      logger.debug('Recommendations retrieved successfully', {
        tracksCount: validatedData.tracks.length,
      })

      return validatedData.tracks
    } catch (error) {
      const appError = errorHandler.handleApiError(
        error,
        'SpotifySearchService.getRecommendations',
      )
      throw appError
    }
  }

  // Get audio features for a track
  async getAudioFeatures(trackId: string): Promise<AudioFeatures> {
    try {
      logger.debug('Getting audio features', { trackId })

      const response = await this.axiosInstance.get(`/audio-features/${trackId}`, {
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      })

      logger.debug('Audio features retrieved successfully', { trackId })
      return response.data
    } catch (error) {
      const appError = errorHandler.handleApiError(
        error,
        'SpotifySearchService.getAudioFeatures',
      )
      throw appError
    }
  }

  // Get audio features for multiple tracks
  async getMultipleAudioFeatures(trackIds: string[]): Promise<AudioFeatures[]> {
    try {
      logger.debug('Getting multiple audio features', { trackIdsCount: trackIds.length })

      const response = await this.axiosInstance.get('/audio-features', {
        params: { ids: trackIds.join(',') },
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      })

      logger.debug('Multiple audio features retrieved successfully', {
        featuresCount: response.data.audio_features?.length || 0,
      })

      return response.data.audio_features || []
    } catch (error) {
      const appError = errorHandler.handleApiError(
        error,
        'SpotifySearchService.getMultipleAudioFeatures',
      )
      throw appError
    }
  }

  // Get available genres
  async getAvailableGenres(): Promise<string[]> {
    try {
      logger.debug('Getting available genres')

      const response = await this.axiosInstance.get('/recommendations/available-genre-seeds', {
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      })

      logger.debug('Available genres retrieved successfully', {
        genresCount: response.data.genres?.length || 0,
      })

      return response.data.genres || []
    } catch (error) {
      const appError = errorHandler.handleApiError(
        error,
        'SpotifySearchService.getAvailableGenres',
      )
      throw appError
    }
  }

  // Get track by ISRC
  async getTrackByISRC(isrc: string): Promise<SpotifyTrack[]> {
    try {
      logger.debug('Getting track by ISRC', { isrc })

      const response = await this.axiosInstance.get('/search', {
        params: {
          q: `isrc:${isrc}`,
          type: 'track',
        },
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      })

      const validatedData = validateSpotifyTracksResponse(response.data)
      logger.debug('Track by ISRC retrieved successfully', {
        isrc,
        tracksCount: validatedData.tracks.length,
      })

      return validatedData.tracks
    } catch (error) {
      const appError = errorHandler.handleApiError(
        error,
        'SpotifySearchService.getTrackByISRC',
      )
      throw appError
    }
  }

  // Get album by UPC
  async getAlbumByUPC(upc: string): Promise<SpotifyAlbum[]> {
    try {
      logger.debug('Getting album by UPC', { upc })

      const response = await this.axiosInstance.get('/search', {
        params: {
          q: `upc:${upc}`,
          type: 'album',
        },
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      })

      const validatedData = validateSpotifyAlbumsResponse(response.data)
      logger.debug('Album by UPC retrieved successfully', {
        upc,
        albumsCount: validatedData.items.length,
      })

      return validatedData.items
    } catch (error) {
      const appError = errorHandler.handleApiError(
        error,
        'SpotifySearchService.getAlbumByUPC',
      )
      throw appError
    }
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
