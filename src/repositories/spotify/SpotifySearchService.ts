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
import { SpotifySearchType } from '@/types/spotify'
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
  }

  setClientToken(token: string): void {
    this.clientToken = token
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

  async searchAdvanced(
    query: string,
    type: SpotifySearchType,
    filters?: SearchFilters,
    limit: number = 20,
    offset: number = 0,
  ) {
    try {
      const params: Record<string, string | number> = {
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

      return response.data
    } catch (error) {
      const appError = errorHandler.handleApiError(
        error,
        'SpotifySearchService.searchAdvanced',
      )
      throw appError
    }
  }

  /**
   * Busca otimizada com múltiplos tipos em uma única requisição
   * Conforme documentação: https://developer.spotify.com/documentation/web-api/reference/search
   */
  async searchMultipleTypes(
    query: string,
    types: SpotifySearchType[],
    filters?: SearchFilters,
    limit: number = 20,
    offset: number = 0,
  ) {
    try {
      const params: Record<string, string | number> = {
        q: query,
        type: types.join(','), // Múltiplos tipos separados por vírgula
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

      return response.data
    } catch (error) {
      const appError = errorHandler.handleApiError(
        error,
        'SpotifySearchService.searchMultipleTypes',
      )
      throw appError
    }
  }

  // Get recommendations
  async getRecommendations(
    params: RecommendationParams,
  ): Promise<SpotifyTrack[]> {
    try {
      const response = await this.axiosInstance.get('/recommendations', {
        params,
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      })

      const validatedData = validateSpotifyTracksResponse(response.data)

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
      const response = await this.axiosInstance.get(
        `/audio-features/${trackId}`,
        {
          headers: {
            Authorization: `Bearer ${this.getAuthToken()}`,
          },
        },
      )

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
      const response = await this.axiosInstance.get('/audio-features', {
        params: {
          ids: trackIds.join(','),
        },
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      })

      return response.data.audio_features
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
      const response = await this.axiosInstance.get(
        '/recommendations/available-genre-seeds',
        {
          headers: {
            Authorization: `Bearer ${this.getAuthToken()}`,
          },
        },
      )

      return response.data.genres
    } catch (error) {
      const appError = errorHandler.handleApiError(
        error,
        'SpotifySearchService.getAvailableGenres',
      )
      throw appError
    }
  }

  // Search tracks by ISRC
  async getTrackByISRC(isrc: string): Promise<SpotifyTrack[]> {
    try {
      const response = await this.axiosInstance.get('/search', {
        params: {
          q: `isrc:${isrc}`,
          type: SpotifySearchType.TRACK,
          limit: 50,
        },
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      })

      const validatedData = validateSpotifyTracksResponse(response.data)
      return validatedData.tracks
    } catch (error) {
      const appError = errorHandler.handleApiError(
        error,
        'SpotifySearchService.getTrackByISRC',
      )
      throw appError
    }
  }

  // Search albums by UPC
  async getAlbumByUPC(upc: string): Promise<SpotifyAlbum[]> {
    try {
      const response = await this.axiosInstance.get('/search', {
        params: {
          q: `upc:${upc}`,
          type: SpotifySearchType.ALBUM,
          limit: 50,
        },
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      })

      const validatedData = validateSpotifyAlbumsResponse(response.data)
      return validatedData.items
    } catch (error) {
      const appError = errorHandler.handleApiError(
        error,
        'SpotifySearchService.getAlbumByUPC',
      )
      throw appError
    }
  }

  // Search artists
  async searchArtists(query: string, limit: number = 20, offset: number = 0) {
    try {
      const response = await this.axiosInstance.get('/search', {
        params: {
          q: query,
          type: SpotifySearchType.ARTIST,
          limit,
          offset,
        },
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      })

      const validatedData = validateSpotifySearchResponse(response.data)
      return validatedData.artists
    } catch (error) {
      const appError = errorHandler.handleApiError(
        error,
        'SpotifySearchService.searchArtists',
      )
      throw appError
    }
  }

  async searchAlbums(query: string, limit: number = 20, offset: number = 0) {
    try {
      const response = await this.axiosInstance.get('/search', {
        params: {
          q: query,
          type: SpotifySearchType.ALBUM,
          limit,
          offset,
        },
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      })

      const validatedData = validateSpotifySearchResponse(response.data)
      return validatedData.albums
    } catch (error) {
      const appError = errorHandler.handleApiError(
        error,
        'SpotifySearchService.searchAlbums',
      )
      throw appError
    }
  }

  async searchTracks(query: string, limit: number = 20, offset: number = 0) {
    try {
      const response = await this.axiosInstance.get('/search', {
        params: {
          q: query,
          type: SpotifySearchType.TRACK,
          limit,
          offset,
        },
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      })

      const validatedData = validateSpotifySearchResponse(response.data)
      return validatedData.tracks
    } catch (error) {
      const appError = errorHandler.handleApiError(
        error,
        'SpotifySearchService.searchTracks',
      )
      throw appError
    }
  }

  async searchPlaylists(query: string, limit: number = 20, offset: number = 0) {
    try {
      const response = await this.axiosInstance.get('/search', {
        params: {
          q: query,
          type: SpotifySearchType.PLAYLIST,
          limit,
          offset,
        },
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      })

      const validatedData = validateSpotifySearchResponse(response.data)
      return validatedData.playlists
    } catch (error) {
      const appError = errorHandler.handleApiError(
        error,
        'SpotifySearchService.searchPlaylists',
      )
      throw appError
    }
  }

  async searchShows(query: string, limit: number = 20, offset: number = 0) {
    try {
      const response = await this.axiosInstance.get('/search', {
        params: {
          q: query,
          type: SpotifySearchType.SHOW,
          limit,
          offset,
        },
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      })

      const validatedData = validateSpotifySearchResponse(response.data)
      return validatedData.shows
    } catch (error) {
      const appError = errorHandler.handleApiError(
        error,
        'SpotifySearchService.searchShows',
      )
      throw appError
    }
  }

  async searchEpisodes(query: string, limit: number = 20, offset: number = 0) {
    try {
      const response = await this.axiosInstance.get('/search', {
        params: {
          q: query,
          type: SpotifySearchType.EPISODE,
          limit,
          offset,
        },
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      })

      const validatedData = validateSpotifySearchResponse(response.data)
      return validatedData.episodes
    } catch (error) {
      const appError = errorHandler.handleApiError(
        error,
        'SpotifySearchService.searchEpisodes',
      )
      throw appError
    }
  }

  async searchAudiobooks(
    query: string,
    limit: number = 20,
    offset: number = 0,
  ) {
    try {
      const response = await this.axiosInstance.get('/search', {
        params: {
          q: query,
          type: SpotifySearchType.AUDIOBOOK,
          limit,
          offset,
        },
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      })

      const validatedData = validateSpotifySearchResponse(response.data)
      return validatedData.audiobooks
    } catch (error) {
      const appError = errorHandler.handleApiError(
        error,
        'SpotifySearchService.searchAudiobooks',
      )
      throw appError
    }
  }

  // Search artists (public endpoint - no auth required)
  async searchArtistsPublic(
    query: string,
    limit: number = 20,
    offset: number = 0,
  ) {
    try {
      const response = await this.axiosInstance.get('/search', {
        params: {
          q: query,
          type: SpotifySearchType.ARTIST,
          limit,
          offset,
        },
      })

      const validatedData = validateSpotifySearchResponse(response.data)
      return validatedData.artists
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
      const response = await this.axiosInstance.get(`/artists/${artistId}`, {
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      })

      const validatedData = validateSpotifyArtist(response.data)
      return validatedData
    } catch (error) {
      const appError = errorHandler.handleApiError(
        error,
        'SpotifySearchService.getArtistDetails',
      )
      throw appError
    }
  }

  // Get artist top tracks
  async getArtistTopTracks(
    artistId: string,
    market: string = 'US',
  ): Promise<SpotifyTrack[]> {
    try {
      const response = await this.axiosInstance.get(
        `/artists/${artistId}/top-tracks`,
        {
          params: {
            market,
          },
          headers: {
            Authorization: `Bearer ${this.getAuthToken()}`,
          },
        },
      )

      const validatedData = validateSpotifyTracksResponse(response.data)
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
      const response = await this.axiosInstance.get(
        `/artists/${artistId}/albums`,
        {
          params: {
            include_groups: includeGroups.join(','),
            limit,
            offset,
          },
          headers: {
            Authorization: `Bearer ${this.getAuthToken()}`,
          },
        },
      )

      const validatedData = validateSpotifyAlbumsResponse(response.data)
      return validatedData.items
    } catch (error) {
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
        const token = this.getAuthToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      },
    )

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response
      },
      (error) => {
        if (error.response?.status === 401) {
          logger.warn('Authentication failed in search service')
        }
        return Promise.reject(error)
      },
    )
  }
}
