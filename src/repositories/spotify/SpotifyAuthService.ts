import { validateSpotifyTokenResponse } from '@/schemas/spotify'
import { CookieManager } from '@/utils/cookies'
import { errorHandler } from '@/utils/errorHandler'
import { logger } from '@/utils/logger'

export interface SpotifyAuthConfig {
  clientId: string
  clientSecret: string
  redirectUri: string
  scopes: string[]
}

export class SpotifyAuthService {
  private config: SpotifyAuthConfig

  constructor(config: SpotifyAuthConfig) {
    this.config = config
  }

  // PKCE Implementation
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

  private generateState(): string {
    const array = new Uint8Array(16)
    crypto.getRandomValues(array)
    return btoa(String.fromCharCode(...array))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
  }

  async generateAuthUrl(): Promise<string> {
    try {
      // Removed debug logs for cleaner production code

      const { clientId, redirectUri, scopes } = this.config

      // Validate required configuration
      if (!clientId || clientId.trim() === '') {
        throw new Error('Client ID is required for authentication')
      }

      const codeVerifier = this.generateCodeVerifier()
      const codeChallenge = await this.generateCodeChallenge(codeVerifier)
      const state = this.generateState()

      // Removed debug logs for cleaner production code

      // Store code verifier securely
      CookieManager.setCodeVerifier(codeVerifier)

      const params = new URLSearchParams({
        client_id: clientId,
        response_type: 'code',
        redirect_uri: redirectUri,
        scope: scopes.join(' '),
        state,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
      })

      // Fix encoding issue: replace + with %20 in scope parameter
      const authUrl = `https://accounts.spotify.com/authorize?${params.toString().replace(/\+/g, '%20')}`
      // Removed debug logs for cleaner production code
      return authUrl
    } catch (error) {
      const appError = errorHandler.handleAuthError(
        error,
        'SpotifyAuthService.generateAuthUrl',
      )
      throw appError
    }
  }

  extractCodeFromUrl(url: string): {
    code: string | null
    state: string | null
  } {
    try {
      logger.debug('Extracting code from URL', { url })

      const urlObj = new URL(url)
      const code = urlObj.searchParams.get('code')
      const state = urlObj.searchParams.get('state')

      logger.debug('Code extraction result', {
        code: code ? 'Present' : 'Missing',
        state: state ? 'Present' : 'Missing',
      })

      return { code, state }
    } catch (error) {
      logger.error('Failed to extract code from URL', error)
      return { code: null, state: null }
    }
  }

  private getCodeVerifier(): string | null {
    // Try cookie first (more secure)
    let codeVerifier = CookieManager.getCodeVerifier()

    if (!codeVerifier) {
      // Fallback to localStorage (for backward compatibility)
      logger.debug('Trying localStorage fallback for code verifier')
      codeVerifier = localStorage.getItem('spotify_code_verifier')
      if (codeVerifier) {
        logger.debug('Code verifier found in localStorage')
        // Migrate to cookie for future use
        try {
          CookieManager.setCodeVerifier(codeVerifier)
          localStorage.removeItem('spotify_code_verifier')
        } catch (error) {
          logger.warn('Failed to migrate code verifier to cookie', error)
        }
      }
    }

    if (!codeVerifier) {
      logger.debug('Code verifier not found in cookies or localStorage')
    }

    return codeVerifier
  }

  private clearCodeVerifier(): void {
    CookieManager.clearCodeVerifier()
    localStorage.removeItem('spotify_code_verifier')
    logger.debug('Code verifier cleared from both cookies and localStorage')
  }

  async handleTokenExchange(code: string): Promise<{
    access_token: string
    token_type: string
    expires_in: number
    refresh_token?: string
    scope?: string
  }> {
    try {
      const codeVerifier = this.getCodeVerifier()
      if (!codeVerifier) {
        throw new Error(
          'Code verifier not found. Please restart the authentication process.',
        )
      }

      const { clientId, clientSecret, redirectUri } = this.config

      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
          client_id: clientId,
          client_secret: clientSecret,
          code_verifier: codeVerifier,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          errorData.error_description ||
            `Token exchange failed: ${response.status}`,
        )
      }

      const data = await response.json()
      const tokenResponse = validateSpotifyTokenResponse(data)

      // Clear code verifier after successful exchange
      this.clearCodeVerifier()

      return tokenResponse
    } catch (error) {
      const appError = errorHandler.handleAuthError(
        error,
        'SpotifyAuthService.handleTokenExchange',
      )
      throw appError
    }
  }

  async getClientToken(): Promise<{
    access_token: string
    token_type: string
    expires_in: number
  }> {
    try {
      const { clientId, clientSecret } = this.config

      if (!clientId || !clientSecret) {
        throw new Error(
          'Client ID and Client Secret are required for client credentials flow',
        )
      }

      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: clientId,
          client_secret: clientSecret,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          errorData.error_description ||
            `Client token request failed: ${response.status}`,
        )
      }

      const data = await response.json()
      const tokenResponse = validateSpotifyTokenResponse(data)

      return tokenResponse
    } catch (error) {
      const appError = errorHandler.handleAuthError(
        error,
        'SpotifyAuthService.getClientToken',
      )
      throw appError
    }
  }
}
