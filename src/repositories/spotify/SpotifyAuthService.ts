import { CookieManager } from '@/utils/cookies'

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

  async generateAuthUrl(): Promise<string> {
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
      '🔑 Code challenge generated:',
      codeChallenge.substring(0, 10) + '...',
    )

    // Store code verifier securely
    CookieManager.setCodeVerifier(codeVerifier)

    // Build authorization URL
    const params = new URLSearchParams({
      client_id: clientId,
      response_type: 'code',
      redirect_uri: redirectUri,
      scope: scopeString,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    })

    const authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`
    console.log('🌐 Auth URL generated successfully')

    return authUrl
  }

  extractCodeFromUrl(url: string): {
    code: string | null
    state: string | null
  } {
    console.log('🔍 Extracting code from URL:', url)

    try {
      const urlObj = new URL(url)
      const code = urlObj.searchParams.get('code')
      const state = urlObj.searchParams.get('state')

      console.log('✅ Code extracted:', code ? 'Present' : 'Missing')
      console.log('✅ State extracted:', state ? 'Present' : 'Missing')

      return { code, state }
    } catch (error) {
      console.error('❌ Error extracting code from URL:', error)
      return { code: null, state: null }
    }
  }

  getCodeVerifier(): string | null {
    return CookieManager.getCodeVerifier()
  }

  clearCodeVerifier(): void {
    CookieManager.clearCodeVerifier()
  }

  async handleTokenExchange(code: string, state?: string): Promise<{ access_token: string }> {
    console.log('🔄 Handling token exchange...')
    console.log('📝 Code received:', code.substring(0, 10) + '...')

    let codeVerifier = this.getCodeVerifier()

    // If code verifier not found, try to extract from state parameter
    if (!codeVerifier && state) {
      try {
        console.log('🔍 Trying to extract code verifier from state parameter...')
        const decodedState = atob(state.replace(/-/g, '+').replace(/_/g, '/'))
        codeVerifier = decodedState
        console.log('✅ Code verifier extracted from state:', codeVerifier.substring(0, 10) + '...')
      } catch (error) {
        console.error('❌ Failed to extract code verifier from state:', error)
      }
    }

    if (!codeVerifier) {
      throw new Error('Authentication session expired. Please try logging in again.')
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

      return data
    } catch (error) {
      console.error('❌ Token exchange error:', error)
      // Clean up on error
      this.clearCodeVerifier()
      throw error
    }
  }
}
