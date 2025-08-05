import axios from 'axios'

import { getSpotifyConfig } from '@/config/environment'
import { SpotifySearchType } from '@/types/spotify'
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
      const authUrl = await this.authService.generateAuthUrl()
      return authUrl
    } catch (error) {
      const appError = errorHandler.handleAuthError(
        error,
        'SpotifyRepository.getAuthUrl',
      )
      throw appError
    }
  }

  async exchangeCodeForToken(code: string): Promise<string> {
    try {
      const tokenResponse = await this.authService.handleTokenExchange(code)
      this.setAccessToken(tokenResponse.access_token)
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
    const localStorageToken = !!localStorage.getItem('spotify_token')
    const cookieToken = !!CookieManager.getAccessToken()

    return {
      hasAccessToken: !!this.accessToken,
      hasClientToken: this.searchService.hasClientToken(),
      localStorageToken,
      cookieToken,
    }
  }

  private loadTokenFromStorage(): void {
    try {
      // Try to load from cookie first
      const cookieToken = CookieManager.getAccessToken()
      if (cookieToken) {
        this.setAccessToken(cookieToken)
        return
      }

      // Fallback to localStorage
      const localStorageToken = localStorage.getItem('spotify_token')
      if (localStorageToken) {
        this.setAccessToken(localStorageToken)
        return
      }
    } catch (error) {
      logger.warn('Failed to load token from storage', error)
    }
  }

  async getClientToken(): Promise<string> {
    try {
      const tokenResponse = await this.authService.getClientToken()
      this.searchService.setClientToken(tokenResponse.access_token)
      return tokenResponse.access_token
    } catch (error) {
      const appError = errorHandler.handleAuthError(
        error,
        'SpotifyRepository.getClientToken',
      )
      throw appError
    }
  }

  async searchArtists(query: string, limit: number = 20, offset: number = 0) {
    return this.searchAdvanced(
      query,
      SpotifySearchType.ARTIST,
      undefined,
      limit,
      offset,
    )
  }

  async searchAlbums(query: string, limit: number = 20, offset: number = 0) {
    return this.searchAdvanced(
      query,
      SpotifySearchType.ALBUM,
      undefined,
      limit,
      offset,
    )
  }

  async searchTracks(query: string, limit: number = 20, offset: number = 0) {
    return this.searchAdvanced(
      query,
      SpotifySearchType.TRACK,
      undefined,
      limit,
      offset,
    )
  }

  async searchPlaylists(query: string, limit: number = 20, offset: number = 0) {
    return this.searchAdvanced(
      query,
      SpotifySearchType.PLAYLIST,
      undefined,
      limit,
      offset,
    )
  }

  async searchShows(query: string, limit: number = 20, offset: number = 0) {
    return this.searchAdvanced(
      query,
      SpotifySearchType.SHOW,
      undefined,
      limit,
      offset,
    )
  }

  async searchEpisodes(query: string, limit: number = 20, offset: number = 0) {
    return this.searchAdvanced(
      query,
      SpotifySearchType.EPISODE,
      undefined,
      limit,
      offset,
    )
  }

  async searchAudiobooks(
    query: string,
    limit: number = 20,
    offset: number = 0,
  ) {
    return this.searchAdvanced(
      query,
      SpotifySearchType.AUDIOBOOK,
      undefined,
      limit,
      offset,
    )
  }

  async searchArtistsPublic(
    query: string,
    limit: number = 20,
    offset: number = 0,
  ) {
    return this.searchService.searchArtistsPublic(query, limit, offset)
  }

  private async ensureAuthentication(): Promise<void> {
    if (!this.isAuthenticated() && !this.searchService.hasClientToken()) {
      await this.getClientToken()
    }
  }

  async searchAdvanced(
    query: string,
    type: SpotifySearchType,
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

  /**
   * Busca otimizada com múltiplos tipos em uma única requisição
   * Reduz significativamente o número de requisições à API
   */
  async searchMultipleTypes(
    query: string,
    types: SpotifySearchType[],
    filters?: SearchFilters,
    limit: number = 20,
    offset: number = 0,
  ) {
    await this.ensureAuthentication()

    try {
      return await this.searchService.searchMultipleTypes(
        query,
        types,
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
          return await this.searchService.searchMultipleTypes(
            query,
            types,
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
    this.accessToken = undefined
    this.searchService.setAccessToken('')
    this.searchService.setClientToken('')

    try {
      CookieManager.clearAllSpotifyCookies()
      localStorage.removeItem('spotify_token')
      logger.debug('Logged out successfully')
    } catch (error) {
      logger.warn('Failed to clear tokens during logout', error)
    }
  }

  async handleTokenExpired(): Promise<string> {
    logger.debug('Handling token expiration')
    this.logout()
    return await this.authService.generateAuthUrl()
  }

  private setupAxiosInterceptors = (): void => {
    // Request interceptor
    axios.interceptors.request.use(
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

    // Response interceptor
    axios.interceptors.response.use(
      (response) => {
        return response
      },
      async (error) => {
        if (error.response?.status === 401 && this.isAuthenticated()) {
          try {
            await this.handleTokenExpired()
            // Retry the original request
            const originalRequest = error.config
            originalRequest.headers.Authorization = `Bearer ${this.getAccessToken()}`
            return axios(originalRequest)
          } catch (refreshError) {
            logger.error('Token refresh failed', refreshError)
            this.logout()
          }
        }
        return Promise.reject(error)
      },
    )
  }
}

export const spotifyRepository = new SpotifyRepository()
