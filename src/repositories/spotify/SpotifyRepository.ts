import axios from 'axios'

import { getSpotifyConfig } from '@/config/environment'
import { validateSpotifyTokenResponse } from '@/schemas/spotify'
import { CookieManager } from '@/utils/cookies'
import { errorHandler } from '@/utils/errorHandler'
import { logger } from '@/utils/logger'

import { SpotifyAuthService } from './SpotifyAuthService'
import { SearchFilters, SpotifySearchService } from './SpotifySearchService'

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
      this.loadTokenFromStorage()
    } catch {
      console.warn('Spotify configuration not available')
      this.authService = {} as SpotifyAuthService
      this.searchService = {} as SpotifySearchService
    }
  }

  async getAuthUrl(): Promise<string> {
    try {
      // Removed debug logs for cleaner production code
      const authUrl = await this.authService.generateAuthUrl()
              // Removed debug logs for cleaner production code
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
      // Removed debug logs for cleaner production code
      const tokenResponse = await this.authService.handleTokenExchange(
        code,
        state,
      )
      this.setAccessToken(tokenResponse.access_token)
      // Removed debug logs for cleaner production code
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

  async getClientToken(): Promise<string> {
    try {
      logger.debug('Getting client token')
      const config = getSpotifyConfig()

      if (!config.clientId || !config.clientSecret) {
        const error = new Error(
          'Spotify credentials not configured. Please set VITE_SPOTIFY_CLIENT_ID and VITE_SPOTIFY_CLIENT_SECRET in your .env file. See env.example for reference.',
        )
        logger.error('Configuration error', error.message)
        throw error
      }

      const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        `grant_type=client_credentials&client_id=${config.clientId}&client_secret=${config.clientSecret}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          timeout: 10000,
        },
      )

      const tokenResponse = validateSpotifyTokenResponse(response.data)
      this.searchService.setClientToken(tokenResponse.access_token)

      logger.debug('Client token obtained and set successfully')
      return tokenResponse.access_token
    } catch (error) {
      logger.error('Client token request failed', error)

      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('Spotify credentials not configured')) {
          throw error // Re-throw our custom error
        }

        // Handle 400 Bad Request (usually invalid credentials)
        if (
          error.message.includes('400') ||
          error.message.includes('Bad Request')
        ) {
          const configError = new Error(
            'Invalid Spotify credentials. Please check your VITE_SPOTIFY_CLIENT_ID and VITE_SPOTIFY_CLIENT_SECRET in the .env file.',
          )
          logger.error('Invalid credentials error', configError.message)
          throw configError
        }
      }

      throw error
    }
  }

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

  private async ensureAuthentication(): Promise<void> {
    // If user is authenticated, use their access token
    if (this.isAuthenticated()) {
      logger.debug('Using user access token for authentication')
      // Ensure the search service has the user's access token
      if (this.accessToken) {
        this.searchService.setAccessToken(this.accessToken)
      }
      return
    }

    // If not authenticated, ensure we have a client token
    if (!this.searchService.hasClientToken()) {
      logger.debug('User not authenticated, getting client token')
      await this.getClientToken()
    }
  }

  async searchAdvanced(
    query: string,
    type: 'artist' | 'track' | 'album' | 'playlist',
    filters?: SearchFilters,
    limit: number = 20,
    offset: number = 0,
  ) {
    await this.ensureAuthentication()

    try {
      return await this.searchService.searchAdvanced(
        query,
        type,
        filters,
        limit,
        offset,
      )
    } catch (error: unknown) {
      // If 401 and we have user token, try with client token
      let is401 = false
      if (typeof error === 'object' && error !== null) {
        if (
          'response' in error &&
          typeof (error as { response?: { status?: number } }).response
            ?.status === 'number'
        ) {
          is401 =
            (error as { response?: { status?: number } }).response?.status ===
            401
        }
        if (
          'message' in error &&
          typeof (error as { message?: string }).message === 'string'
        ) {
          is401 =
            is401 ||
            (error as { message?: string }).message ===
              'Authentication required'
        }
      }

      if (is401 && this.isAuthenticated()) {
        logger.debug('User token failed, trying with client token')
        try {
          await this.getClientToken()
          return await this.searchService.searchAdvanced(
            query,
            type,
            filters,
            limit,
            offset,
          )
        } catch (clientError) {
          throw clientError
        }
      }
      throw error
    }
  }

  async getAvailableGenres() {
    await this.ensureAuthentication()
    return this.searchService.getAvailableGenres()
  }

  // Audio features methods

  // ISRC/UPC search methods
  async getTrackByISRC(isrc: string) {
    await this.ensureAuthentication()
    return this.searchService.getTrackByISRC(isrc)
  }

  async getAlbumByUPC(upc: string) {
    await this.ensureAuthentication()
    return this.searchService.getAlbumByUPC(upc)
  }

  async getArtistDetails(artistId: string) {
    await this.ensureAuthentication()
    try {
      return await this.searchService.getArtistDetails(artistId)
    } catch (error) {
      logger.error('Failed to get artist details', error)
      throw new Error('Authentication required for artist details')
    }
  }

  async getArtistTopTracks(artistId: string, market: string = 'US') {
    await this.ensureAuthentication()
    try {
      return await this.searchService.getArtistTopTracks(artistId, market)
    } catch (error) {
      logger.error('Failed to get artist top tracks', error)
      throw new Error('Authentication required for artist top tracks')
    }
  }

  async getArtistAlbums(
    artistId: string,
    includeGroups: string[] = ['album', 'single'],
    limit: number = 20,
    offset: number = 0,
  ) {
    await this.ensureAuthentication()
    try {
      return await this.searchService.getArtistAlbums(
        artistId,
        includeGroups,
        limit,
        offset,
      )
    } catch (error) {
      logger.error('Failed to get artist albums', error)
      throw new Error('Authentication required for artist albums')
    }
  }

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

  private setupAxiosInterceptors = (): void => {
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
          logger.warn('Token expired, logging out and redirecting to login')
          this.logout()
          window.location.href = '/login'
          return Promise.reject(new Error('Authentication required'))
        }
        return Promise.reject(error)
      },
    )
  }
}

export const spotifyRepository = new SpotifyRepository()
