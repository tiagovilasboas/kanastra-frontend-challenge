import axios from 'axios'

import { getSpotifyConfig } from '@/config/environment'
import { validateSpotifyTokenResponse } from '@/schemas/spotify'
import { CookieManager } from '@/utils/cookies'
import { errorHandler } from '@/utils/errorHandler'
import { logger } from '@/utils/logger'

import { SpotifyAuthService } from './SpotifyAuthService'
import { SpotifySearchService } from './SpotifySearchService'

export class SpotifyRepository {
  private authService: SpotifyAuthService
  private searchService: SpotifySearchService
  private accessToken?: string


  constructor() {
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
  }

  // Authentication methods
  async getAuthUrl(): Promise<string> {
    try {
      logger.debug('Generating auth URL')
      const authUrl = await this.authService.generateAuthUrl()
      logger.debug('Auth URL generated successfully')
      return authUrl
    } catch (error) {
      const appError = errorHandler.handleAuthError(error, 'SpotifyRepository.getAuthUrl')
      throw appError
    }
  }

  async exchangeCodeForToken(code: string, state?: string): Promise<string> {
    try {
      logger.debug('Exchanging code for token')
      const tokenResponse = await this.authService.handleTokenExchange(code, state)
      this.setAccessToken(tokenResponse.access_token)
      logger.debug('Token exchange successful')
      return tokenResponse.access_token
    } catch (error) {
      const appError = errorHandler.handleAuthError(error, 'SpotifyRepository.exchangeCodeForToken')
      throw appError
    }
  }

  extractCodeFromUrl(url: string): { code: string | null; state: string | null } {
    return this.authService.extractCodeFromUrl(url)
  }

  setAccessToken(token: string): void {
    this.accessToken = token
    this.searchService.setAccessToken(token)
    localStorage.setItem('spotify_token', token)
    logger.debug('Access token set')
  }

  getAccessToken(): string | undefined {
    return this.accessToken
  }

  // Client credentials flow
  async getClientToken(): Promise<string> {
    try {
      logger.debug('Getting client token')
      const config = getSpotifyConfig()
      
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
        }
      )

      const tokenResponse = validateSpotifyTokenResponse(response.data)

      this.searchService.setClientToken(tokenResponse.access_token)
      
      logger.debug('Client token obtained successfully')
      return tokenResponse.access_token
    } catch (error) {
      const appError = errorHandler.handleAuthError(error, 'SpotifyRepository.getClientToken')
      throw appError
    }
  }

  // Search methods (delegated to search service)
  async searchArtists(query: string) {
    return this.searchService.searchArtists(query)
  }

  async searchArtistsPublic(query: string) {
    return this.searchService.searchArtistsPublic(query)
  }

  async getArtistDetails(artistId: string) {
    return this.searchService.getArtistDetails(artistId)
  }

  async getArtistTopTracks(artistId: string, market: string = 'US') {
    return this.searchService.getArtistTopTracks(artistId, market)
  }

  async getArtistAlbums(
    artistId: string,
    includeGroups: string[] = ['album', 'single'],
    limit: number = 20,
    offset: number = 0
  ) {
    return this.searchService.getArtistAlbums(artistId, includeGroups, limit, offset)
  }

  // Utility methods
  logout(): void {
    logger.debug('Logging out')
    this.accessToken = undefined

    this.searchService.setAccessToken('')
    this.searchService.setClientToken('')
    localStorage.removeItem('spotify_token')
    CookieManager.clearCodeVerifier()
    logger.debug('Logout completed')
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
      }
    )

    // Global response interceptor
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          logger.warn('Token expired, redirecting to auth')
          const authUrl = await this.handleTokenExpired()
          window.location.href = authUrl
        }
        return Promise.reject(error)
      }
    )
  }
}

export const spotifyRepository = new SpotifyRepository()
