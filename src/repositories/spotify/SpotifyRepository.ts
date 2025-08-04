import axios from 'axios'

import { getSpotifyConfig } from '@/config/environment'
import { validateSpotifyTokenResponse } from '@/schemas/spotify'
import { CookieManager } from '@/utils/cookies'
import { errorHandler } from '@/utils/errorHandler'
import { logger } from '@/utils/logger'

import { SpotifyAuthService } from './SpotifyAuthService'
import {
  AudioFeatures,
  RecommendationParams,
  SearchFilters,
  SpotifySearchService,
} from './SpotifySearchService'

export class SpotifyRepository {
  private authService: SpotifyAuthService
  private searchService: SpotifySearchService
  private accessToken?: string

  constructor() {
    try {
      const config = getSpotifyConfig()

      this.authService = new SpotifyAuthService({
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        redirectUri: config.redirectUri,
        scopes: config.scopes,
      })

      this.searchService = new SpotifySearchService({
        baseURL: config.baseUrl,
      })

      this.setupAxiosInterceptors()

      // Try to load token from localStorage on initialization
      this.loadTokenFromStorage()
    } catch {
      console.warn('Spotify configuration not available, running in demo mode')
      // Initialize with dummy services for demo mode
      this.authService = {} as SpotifyAuthService
      this.searchService = {} as SpotifySearchService
    }
  }

  // Authentication methods
  async getAuthUrl(): Promise<string> {
    try {
      logger.debug('Generating auth URL')
      const authUrl = await this.authService.generateAuthUrl()
      logger.debug('Auth URL generated successfully')
      return authUrl
    } catch (error) {
      const appError = errorHandler.handleAuthError(
        error,
        'SpotifyRepository.getAuthUrl',
      )
      throw appError
    }
  }

  async exchangeCodeForToken(code: string, state?: string): Promise<string> {
    try {
      logger.debug('Exchanging code for token')
      const tokenResponse = await this.authService.handleTokenExchange(
        code,
        state,
      )
      this.setAccessToken(tokenResponse.access_token)
      logger.debug('Token exchange successful')
      return tokenResponse.access_token
    } catch (error) {
      const appError = errorHandler.handleAuthError(
        error,
        'SpotifyRepository.exchangeCodeForToken',
      )
      throw appError
    }
  }

  extractCodeFromUrl(url: string): {
    code: string | null
    state: string | null
  } {
    return this.authService.extractCodeFromUrl(url)
  }

  setAccessToken(token: string): void {
    this.accessToken = token
    this.searchService.setAccessToken(token)

    // Store in both cookie and localStorage for redundancy
    try {
      CookieManager.setAccessToken(token)
      localStorage.setItem('spotify_token', token)
      logger.debug('Access token set in both cookie and localStorage', {
        hasToken: !!token,
        tokenLength: token?.length || 0,
        searchServiceHasToken: this.searchService.hasAccessToken(),
      })
    } catch (error) {
      logger.warn(
        'Failed to store token in cookie, using localStorage only',
        error,
      )
      localStorage.setItem('spotify_token', token)
    }
  }

  getAccessToken(): string | undefined {
    return this.accessToken
  }

  isAuthenticated(): boolean {
    return !!this.accessToken
  }

  getAuthStatus(): {
    hasAccessToken: boolean
    hasClientToken: boolean
    localStorageToken: boolean
    cookieToken: boolean
  } {
    return {
      hasAccessToken: !!this.accessToken,
      hasClientToken: this.searchService.hasClientToken(),
      localStorageToken: !!localStorage.getItem('spotify_token'),
      cookieToken: !!CookieManager.getAccessToken(),
    }
  }

  private loadTokenFromStorage(): void {
    try {
      // Try to load from cookie first (more secure)
      let token = CookieManager.getAccessToken()

      if (!token) {
        // Fallback to localStorage
        token = localStorage.getItem('spotify_token')
        if (token) {
          logger.debug('Token loaded from localStorage, migrating to cookie')
          // Migrate to cookie for future use
          try {
            CookieManager.setAccessToken(token)
          } catch (error) {
            logger.warn('Failed to migrate token to cookie', error)
          }
        }
      } else {
        logger.debug('Token loaded from cookie')
      }

      if (token) {
        this.setAccessToken(token)
        logger.debug('Token loaded from storage on initialization')
      } else {
        logger.debug('No token found in storage on initialization')
      }
    } catch (error) {
      logger.error('Error loading token from storage', error)
    }
  }

  // Client credentials flow
  async getClientToken(): Promise<string> {
    try {
      logger.debug('Getting client token')
      const config = getSpotifyConfig()

      logger.debug('Making token request with config', {
        clientId: config.clientId ? 'Present' : 'Missing',
        clientSecret: config.clientSecret ? 'Present' : 'Missing',
        redirectUri: config.redirectUri,
      })

      const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: config.clientId,
          client_secret: config.clientSecret,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )

      logger.debug('Token response received', {
        status: response.status,
        hasData: !!response.data,
        dataKeys: Object.keys(response.data || {}),
      })

      const tokenResponse = validateSpotifyTokenResponse(response.data)

      logger.debug('Client token response validated', {
        hasAccessToken: !!tokenResponse.access_token,
        tokenLength: tokenResponse.access_token?.length || 0,
        tokenType: tokenResponse.token_type,
      })

      this.searchService.setClientToken(tokenResponse.access_token)

      logger.debug('Client token obtained and set successfully')
      return tokenResponse.access_token
    } catch (error) {
      logger.error('Client token request failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        response:
          error instanceof Error && 'response' in error
            ? (error as { response?: { data?: unknown } }).response?.data
            : 'No response data',
      })

      const appError = errorHandler.handleAuthError(
        error,
        'SpotifyRepository.getClientToken',
      )
      throw appError
    }
  }

  // Search methods (delegated to search service)
  async searchArtists(query: string, limit: number = 20, offset: number = 0) {
    return this.searchService.searchArtists(query, limit, offset)
  }

  async searchArtistsPublic(
    query: string,
    limit: number = 20,
    offset: number = 0,
  ) {
    return this.searchService.searchArtistsPublic(query, limit, offset)
  }

  // Advanced search methods
  async searchAdvanced(
    query: string,
    type: 'artist' | 'track' | 'album' | 'playlist',
    filters?: SearchFilters,
    limit: number = 20,
    offset: number = 0,
  ) {
    // Ensure we have a token
    if (!this.accessToken && !this.searchService.hasClientToken()) {
      await this.getClientToken()
    }
    return this.searchService.searchAdvanced(
      query,
      type,
      filters,
      limit,
      offset,
    )
  }

  async getRecommendations(params: RecommendationParams) {
    // Ensure we have a token
    if (!this.accessToken && !this.searchService.hasClientToken()) {
      await this.getClientToken()
    }
    return this.searchService.getRecommendations(params)
  }

  async getAvailableGenres() {
    // Ensure we have a token
    if (!this.accessToken && !this.searchService.hasClientToken()) {
      await this.getClientToken()
    }
    return this.searchService.getAvailableGenres()
  }

  // Audio features methods
  async getAudioFeatures(trackId: string): Promise<AudioFeatures> {
    // Ensure we have a token
    if (!this.accessToken && !this.searchService.hasClientToken()) {
      await this.getClientToken()
    }
    return this.searchService.getAudioFeatures(trackId)
  }

  async getMultipleAudioFeatures(trackIds: string[]): Promise<AudioFeatures[]> {
    // Ensure we have a token
    if (!this.accessToken && !this.searchService.hasClientToken()) {
      await this.getClientToken()
    }
    return this.searchService.getMultipleAudioFeatures(trackIds)
  }

  // ISRC/UPC search methods
  async getTrackByISRC(isrc: string) {
    // Ensure we have a token
    if (!this.accessToken && !this.searchService.hasClientToken()) {
      await this.getClientToken()
    }
    return this.searchService.getTrackByISRC(isrc)
  }

  async getAlbumByUPC(upc: string) {
    // Ensure we have a token
    if (!this.accessToken && !this.searchService.hasClientToken()) {
      await this.getClientToken()
    }
    return this.searchService.getAlbumByUPC(upc)
  }

  async getArtistDetails(artistId: string) {
    // Only get client token if we don't have access token and don't already have client token
    if (!this.accessToken && !this.searchService.hasClientToken()) {
      logger.debug(
        'No tokens available for artist details, getting client token',
      )
      try {
        await this.getClientToken()
      } catch (error) {
        logger.error('Failed to get client token for artist details', error)
        throw new Error('Authentication required for artist details')
      }
    }

    return this.searchService.getArtistDetails(artistId)
  }

  async getArtistTopTracks(artistId: string, market: string = 'US') {
    // Only get client token if we don't have access token and don't already have client token
    if (!this.accessToken && !this.searchService.hasClientToken()) {
      logger.debug('No tokens available for top tracks, getting client token')
      try {
        await this.getClientToken()
      } catch (error) {
        logger.error('Failed to get client token for top tracks', error)
        throw new Error('Authentication required for top tracks')
      }
    }

    return this.searchService.getArtistTopTracks(artistId, market)
  }

  async getArtistAlbums(
    artistId: string,
    includeGroups: string[] = ['album', 'single'],
    limit: number = 20,
    offset: number = 0,
  ) {
    // Only get client token if we don't have access token and don't already have client token
    if (!this.accessToken && !this.searchService.hasClientToken()) {
      logger.debug(
        'No tokens available for artist albums, getting client token',
      )
      try {
        await this.getClientToken()
      } catch (error) {
        logger.error('Failed to get client token for artist albums', error)
        throw new Error('Authentication required for artist albums')
      }
    }

    return this.searchService.getArtistAlbums(
      artistId,
      includeGroups,
      limit,
      offset,
    )
  }

  // Utility methods
  logout(): void {
    logger.debug('Logging out')

    // Clear access token
    this.accessToken = undefined

    // Clear search service tokens
    this.searchService.setAccessToken('')
    this.searchService.setClientToken('')

    // Clear localStorage
    localStorage.removeItem('spotify_token')

    // Clear all cookies
    CookieManager.clearAllSpotifyCookies()

    logger.debug('Logout completed - all tokens and cookies cleared')
  }

  async handleTokenExpired(): Promise<string> {
    logger.debug('Handling token expiration')
    const authUrl = await this.getAuthUrl()
    this.logout()
    return authUrl
  }

  private setupAxiosInterceptors(): void {
    // Global request interceptor
    axios.interceptors.request.use(
      (config) => {
        // Only add Authorization header if not already present
        if (!config.headers.Authorization && this.accessToken) {
          config.headers.Authorization = `Bearer ${this.accessToken}`
        }
        return config
      },
      (error) => {
        logger.error('Global request interceptor error', error)
        return Promise.reject(error)
      },
    )

    // Global response interceptor
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          logger.warn('Token expired, handling gracefully')

          // Don't redirect immediately, let the component handle it
          // This prevents breaking the entire app
          const customError = new Error('Authentication required')
          customError.name = 'AUTH_REQUIRED'

          return Promise.reject(customError)
        }
        return Promise.reject(error)
      },
    )
  }
}

export const spotifyRepository = new SpotifyRepository()
