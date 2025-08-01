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
}
