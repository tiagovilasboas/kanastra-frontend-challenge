import axios, { AxiosInstance, AxiosResponse } from 'axios'

import { getApiConfig, getSpotifyConfig } from '@/config/environment'
import { SpotifyAlbum, SpotifyArtist, SpotifyTrack } from '@/types/spotify'
import { CookieManager } from '@/utils/cookies'

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
  private clientToken: string | null = null
  private config = getSpotifyConfig()
  private apiConfig = getApiConfig()

  constructor() {
    this.api = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.apiConfig.timeout,
    })

    this.setupInterceptors()
  }

  // PKCE Implementation based on Spotify's official documentation
  private generateCodeVerifier(): string {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return btoa(String.fromCharCode(...array))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
  }

  private async generateCodeChallenge(codeVerifier: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(codeVerifier)
    const digest = await crypto.subtle.digest('SHA-256', data)
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
  }

  async getAuthUrl(): Promise<string> {
    const { clientId, redirectUri, scopes } = this.config
    const scopeString = scopes.join(' ')

    console.log('🔐 Generating auth URL...')

    // Generate PKCE parameters
    const codeVerifier = this.generateCodeVerifier()
    const codeChallenge = await this.generateCodeChallenge(codeVerifier)

    console.log(
      '📝 Code verifier generated:',
      codeVerifier.substring(0, 10) + '...',
    )
    console.log(
      '🔐 Code challenge generated:',
      codeChallenge.substring(0, 10) + '...',
    )

    // Store code verifier securely
    this.storeCodeVerifier(codeVerifier)

    // Add state parameter with code verifier for persistence
    const state = btoa(codeVerifier)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')

    // Build authorization URL
    const params = new URLSearchParams({
      client_id: clientId,
      response_type: 'code',
      redirect_uri: redirectUri,
      scope: scopeString,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      state: state,
    })

    const authUrl = `${this.config.authUrl}?${params.toString()}`
    console.log('🌐 Auth URL generated:', authUrl.substring(0, 100) + '...')

    return authUrl
  }

  private storeCodeVerifier(codeVerifier: string): void {
    CookieManager.setCodeVerifier(codeVerifier)
  }

  private getCodeVerifier(): string | null {
    return CookieManager.getCodeVerifier()
  }

  private clearCodeVerifier(): void {
    CookieManager.clearCodeVerifier()
  }

  async exchangeCodeForToken(code: string, state?: string): Promise<string> {
    console.log('🔄 Exchanging code for token...')
    console.log('📝 Code received:', code.substring(0, 10) + '...')

    let codeVerifier = this.getCodeVerifier()

    // If code verifier not found in localStorage, try to extract from state parameter
    if (!codeVerifier && state) {
      try {
        console.log(
          '🔍 Trying to extract code verifier from state parameter...',
        )
        const decodedState = atob(state.replace(/-/g, '+').replace(/_/g, '/'))
        codeVerifier = decodedState
        console.log(
          '✅ Code verifier extracted from state:',
          codeVerifier.substring(0, 10) + '...',
        )
      } catch (error) {
        console.error('❌ Failed to extract code verifier from state:', error)
      }
    }

    if (!codeVerifier) {
      throw new Error(
        'Authentication session expired. Please try logging in again.',
      )
    }

    const { clientId, redirectUri } = this.config
    const tokenUrl = 'https://accounts.spotify.com/api/token'

    const params = new URLSearchParams({
      client_id: clientId,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    })

    console.log('📤 Sending token exchange request...')

    try {
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      })

      console.log('📥 Response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('❌ Token exchange failed:', errorData)
        throw new Error(
          errorData.error_description ||
            errorData.error ||
            `Token exchange failed: ${response.status}`,
        )
      }

      const data = await response.json()
      console.log('✅ Token exchange successful')

      // Clean up code verifier after successful exchange
      this.clearCodeVerifier()

      return data.access_token
    } catch (error) {
      console.error('❌ Token exchange error:', error)
      // Clean up on error
      this.clearCodeVerifier()
      throw error
    }
  }

  extractCodeFromUrl(url: string): {
    code: string | null
    state: string | null
  } {
    try {
      const urlObj = new URL(url)
      const code = urlObj.searchParams.get('code')
      const state = urlObj.searchParams.get('state')
      console.log(
        '🔍 Code extracted from URL:',
        code ? code.substring(0, 10) + '...' : 'null',
      )
      console.log(
        '🔍 State extracted from URL:',
        state ? state.substring(0, 10) + '...' : 'null',
      )
      return { code, state }
    } catch {
      // Fallback for older browsers or malformed URLs
      const urlParams = new URLSearchParams(url.split('?')[1] || '')
      const code = urlParams.get('code')
      const state = urlParams.get('state')
      console.log(
        '🔍 Code extracted from URL (fallback):',
        code ? code.substring(0, 10) + '...' : 'null',
      )
      console.log(
        '🔍 State extracted from URL (fallback):',
        state ? state.substring(0, 10) + '...' : 'null',
      )
      return { code, state }
    }
  }

  setAccessToken(token: string): void {
    this.accessToken = token
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    console.log('🔑 Access token set')
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
    this.clearCodeVerifier()
    console.log('🚪 Logged out and cleared all authentication data')
  }

  // Client Credentials Flow for public search
  private async getClientToken(): Promise<string> {
    if (this.clientToken) {
      console.log('🔄 Using cached client token')
      return this.clientToken
    }

    try {
      console.log('🔑 Getting client token for public search...')
      console.log('🔧 Config:', {
        clientId: this.config.clientId ? 'Present' : 'Missing',
        clientSecret: this.config.clientSecret ? 'Present' : 'Missing',
        baseUrl: this.config.baseUrl,
      })

      const authString = `${this.config.clientId}:${this.config.clientSecret}`
      const encodedAuth = btoa(authString)

      console.log('🔐 Auth string length:', authString.length)
      console.log('🔐 Encoded auth length:', encodedAuth.length)

      const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        'grant_type=client_credentials',
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${encodedAuth}`,
          },
        },
      )

      console.log('📊 Token response status:', response.status)
      console.log('📊 Token response data:', {
        access_token: response.data.access_token ? 'Present' : 'Missing',
        token_type: response.data.token_type,
        expires_in: response.data.expires_in,
      })

      this.clientToken = response.data.access_token as string
      console.log('✅ Client token obtained successfully')

      return this.clientToken
    } catch (error) {
      console.error('❌ Failed to get client token:', error)
      console.error('❌ Error details:', error)
      throw new Error('Failed to get client token for public search')
    }
  }

  // Public search without authentication
  async searchArtistsPublic(
    query: string,
    params: SearchParams = { query, type: 'artist', limit: 20, offset: 0 },
  ): Promise<SpotifySearchResponse> {
    try {
      console.log('🔍 Searching artists publicly:', query)
      console.log('🔧 Search params:', params)

      const token = await this.getClientToken()
      console.log('✅ Got client token:', token ? 'Token obtained' : 'No token')

      const requestConfig = {
        params: {
          q: params.query,
          type: params.type,
          limit: params.limit || 20,
          offset: params.offset || 0,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      console.log('🌐 Making request to:', `${this.config.baseUrl}/search`)
      console.log('📝 Request config:', requestConfig)

      const response = await this.api.get('/search', requestConfig)

      console.log('✅ Public search successful')
      console.log('📊 Response data:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Public search failed:', error)
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        response:
          error instanceof Error && 'response' in error
            ? error.response
            : 'No response',
      })
      throw this.handleError(error, 'Failed to search artists publicly')
    }
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
        // Only add user token if no Authorization header is already set
        // This allows public search to use its own client token
        if (this.accessToken && !config.headers.Authorization) {
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

  private async handleTokenExpired(): Promise<void> {
    this.accessToken = null
    delete this.api.defaults.headers.common['Authorization']
    this.clearCodeVerifier()

    try {
      const authUrl = await this.getAuthUrl()
      window.location.href = authUrl
    } catch (error) {
      console.error('Failed to redirect to auth:', error)
      window.location.href = '/'
    }
  }
}
