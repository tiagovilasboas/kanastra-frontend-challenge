import axios from 'axios'

import { getSpotifyConfig } from '@/config/environment'
import { SpotifySearchType } from '@/types/spotify'
import { CookieManager } from '@/utils/cookies'
import { errorHandler } from '@/utils/errorHandler'
import { logger } from '@/utils/logger'

import { NoopAuthService } from './NoopAuthService'
import { NoopSearchService } from './NoopSearchService'
import { SpotifyAuthService } from './SpotifyAuthService'
import { SearchFilters, SpotifySearchService } from './SpotifySearchService'

// Flag para garantir que interceptors sejam instalados apenas uma vez
let interceptorsInstalled = false

export class SpotifyRepository {
  private authService: SpotifyAuthService | NoopAuthService
  private searchService: SpotifySearchService | NoopSearchService
  private accessToken?: string
  private currentTokenType: 'user' | 'client' | 'none' = 'none'

  constructor() {
    try {
      const config = getSpotifyConfig()

      // Check if credentials are available
      if (!config.clientId || !config.clientSecret) {
        logger.warn('Spotify credentials not available - using NoopServices')
        this.authService = new NoopAuthService()
        this.searchService = new NoopSearchService()
        return
      }

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
    } catch (error) {
      logger.warn('Spotify configuration error:', error)
      this.authService = new NoopAuthService()
      this.searchService = new NoopSearchService()
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
      this.currentTokenType = 'user'
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
    this.currentTokenType = 'user'

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
    tokenType: 'user' | 'client' | 'none'
  } {
    const localStorageToken = !!localStorage.getItem('spotify_token')
    const cookieToken = !!CookieManager.getAccessToken()

    return {
      hasAccessToken: !!this.accessToken,
      hasClientToken: this.searchService.hasClientToken(),
      localStorageToken,
      cookieToken,
      tokenType: this.currentTokenType,
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
      logger.debug('Getting client token from auth service...')
      const tokenResponse = await this.authService.getClientToken()
      logger.debug('Client token received, setting in search service...')
      this.searchService.setClientToken(tokenResponse.access_token)
      this.currentTokenType = 'client'
      logger.debug('Client token set successfully')
      return tokenResponse.access_token
    } catch (error) {
      logger.error('Failed to get client token:', error)
      const appError = errorHandler.handleAuthError(
        error,
        'SpotifyRepository.getClientToken',
      )
      throw appError
    }
  }

  async searchArtists(
    query: string,
    limit: number = 20,
    offset: number = 0,
    market: string = 'BR',
  ) {
    return this.searchAdvanced(
      query,
      SpotifySearchType.ARTIST,
      { market },
      limit,
      offset,
    )
  }

  async searchAlbums(
    query: string,
    limit: number = 20,
    offset: number = 0,
    market: string = 'BR',
  ) {
    return this.searchAdvanced(
      query,
      SpotifySearchType.ALBUM,
      { market },
      limit,
      offset,
    )
  }

  async searchTracks(
    query: string,
    limit: number = 20,
    offset: number = 0,
    market: string = 'BR',
  ) {
    return this.searchAdvanced(
      query,
      SpotifySearchType.TRACK,
      { market },
      limit,
      offset,
    )
  }

  async searchPlaylists(
    query: string,
    limit: number = 20,
    offset: number = 0,
    market: string = 'BR',
  ) {
    return this.searchAdvanced(
      query,
      SpotifySearchType.PLAYLIST,
      { market },
      limit,
      offset,
    )
  }

  async searchShows(
    query: string,
    limit: number = 20,
    offset: number = 0,
    market: string = 'BR',
  ) {
    return this.searchAdvanced(
      query,
      SpotifySearchType.SHOW,
      { market },
      limit,
      offset,
    )
  }

  async searchEpisodes(
    query: string,
    limit: number = 20,
    offset: number = 0,
    market: string = 'BR',
  ) {
    return this.searchAdvanced(
      query,
      SpotifySearchType.EPISODE,
      { market },
      limit,
      offset,
    )
  }

  async searchAudiobooks(
    query: string,
    limit: number = 20,
    offset: number = 0,
    market: string = 'BR',
  ) {
    const result = (await this.searchAdvanced(
      query,
      SpotifySearchType.AUDIOBOOK,
      { market },
      limit,
      offset,
    )) as unknown

    // Fallback: if zero items returned for BR, try US (Spotify só vende audiobooks em poucos mercados)
    if (
      Array.isArray((result as { items: unknown[] }).items) &&
      (result as { items: unknown[] }).items.length === 0 &&
      market !== 'US'
    ) {
      try {
        const usResult = await this.searchAdvanced(
          query,
          SpotifySearchType.AUDIOBOOK,
          { market: 'US' },
          limit,
          offset,
        )
        return usResult
      } catch {
        // ignore, return original result
      }
    }

    return result
  }

  async searchArtistsPublic(
    query: string,
    limit: number = 20,
    offset: number = 0,
  ) {
    return this.searchService.searchArtistsPublic(query, limit, offset)
  }

  private async ensureAuthentication(): Promise<void> {
    // Se não há user token nem client token, obtenha client token
    if (!this.isAuthenticated() && !this.searchService.hasClientToken()) {
      try {
        logger.debug('No authentication found, getting client token...')
        await this.getClientToken()
        logger.debug('Client token obtained successfully')
      } catch (error) {
        logger.debug(
          'Failed to get client token, proceeding without authentication',
          error,
        )
      }
    } else {
      logger.debug('Authentication status:', {
        isAuthenticated: this.isAuthenticated(),
        hasClientToken: this.searchService.hasClientToken(),
        currentTokenType: this.currentTokenType,
      })
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
      // Se 401 com user token, tente uma vez com client token APENAS para esta chamada
      if (this.is401Error(error) && this.currentTokenType === 'user') {
        logger.debug(
          'User token failed, trying with client token for this request only',
        )
        try {
          // Obtenha client token temporariamente para esta requisição
          const clientToken = await this.authService.getClientToken()
          const originalToken = this.accessToken

          // Configure client token temporariamente
          this.searchService.setClientToken(clientToken.access_token)

          // Faça a requisição com client token
          const result = await this.searchService.searchAdvanced(
            query,
            type,
            filters,
            limit,
            offset,
          )

          // Restaure o token original
          if (originalToken) {
            this.searchService.setAccessToken(originalToken)
          }

          return result
        } catch (clientError) {
          // Restaure o token original em caso de erro
          if (this.accessToken) {
            this.searchService.setAccessToken(this.accessToken)
          }
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
      // Se 401 com user token, tente uma vez com client token APENAS para esta chamada
      if (this.is401Error(error) && this.currentTokenType === 'user') {
        logger.debug(
          'User token failed, trying with client token for this request only',
        )
        try {
          // Obtenha client token temporariamente para esta requisição
          const clientToken = await this.authService.getClientToken()
          const originalToken = this.accessToken

          // Configure client token temporariamente
          this.searchService.setClientToken(clientToken.access_token)

          // Faça a requisição com client token
          const result = await this.searchService.searchMultipleTypes(
            query,
            types,
            filters,
            limit,
            offset,
          )

          // Restaure o token original
          if (originalToken) {
            this.searchService.setAccessToken(originalToken)
          }

          return result
        } catch (clientError) {
          // Restaure o token original em caso de erro
          if (this.accessToken) {
            this.searchService.setAccessToken(this.accessToken)
          }
          throw clientError
        }
      }
      throw error
    }
  }

  private is401Error(error: unknown): boolean {
    if (typeof error === 'object' && error !== null) {
      if (
        'response' in error &&
        typeof (error as { response?: { status?: number } }).response
          ?.status === 'number'
      ) {
        return (
          (error as { response?: { status?: number } }).response?.status === 401
        )
      }
      if (
        'message' in error &&
        typeof (error as { message?: string }).message === 'string'
      ) {
        return (
          (error as { message?: string }).message === 'Authentication required'
        )
      }
    }
    return false
  }

  async getAvailableGenres() {
    await this.ensureAuthentication()
    try {
      return await this.searchService.getAvailableGenres()
    } catch (error) {
      logger.error('Failed to get available genres', error)
      throw new Error('Failed to retrieve available genres')
    }
  }

  // Audio features methods

  // ISRC/UPC search methods
  async getTrackByISRC(isrc: string) {
    await this.ensureAuthentication()
    try {
      return await this.searchService.getTrackByISRC(isrc)
    } catch (error) {
      logger.error('Failed to get track by ISRC', error)
      throw new Error(`Failed to find track with ISRC: ${isrc}`)
    }
  }

  async getAlbumByUPC(upc: string) {
    await this.ensureAuthentication()
    try {
      return await this.searchService.getAlbumByUPC(upc)
    } catch (error) {
      logger.error('Failed to get album by UPC', error)
      throw new Error(`Failed to find album with UPC: ${upc}`)
    }
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

  async getArtistTopTracks(artistId: string, market: string = 'BR') {
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
    this.currentTokenType = 'none'
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
    // Garantir que interceptors sejam instalados apenas uma vez
    if (interceptorsInstalled) {
      return
    }

    // Request interceptor
    axios.interceptors.request.use(
      (config) => {
        // Nunca configurar Authorization com token undefined
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
        if (
          error.response?.status === 401 &&
          this.currentTokenType === 'user'
        ) {
          try {
            // Tente obter client token para esta requisição específica
            const clientToken = await this.authService.getClientToken()
            const originalRequest = error.config

            // Configure client token temporariamente
            originalRequest.headers.Authorization = `Bearer ${clientToken.access_token}`

            // Retry the original request
            return axios(originalRequest)
          } catch (refreshError) {
            logger.error('Token refresh failed', refreshError)
            // Não faça logout automático, apenas logue o erro
          }
        }
        return Promise.reject(error)
      },
    )

    interceptorsInstalled = true
  }
}

// Lazy initialization to ensure environment variables are loaded
let spotifyRepositoryInstance: SpotifyRepository | null = null

export const getSpotifyRepository = (): SpotifyRepository => {
  if (!spotifyRepositoryInstance) {
    spotifyRepositoryInstance = new SpotifyRepository()
  }
  return spotifyRepositoryInstance
}

export const spotifyRepository = getSpotifyRepository()
