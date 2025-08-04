interface CookieOptions {
  expires?: Date
  maxAge?: number
  path?: string
  domain?: string
  secure?: boolean
  httpOnly?: boolean
  sameSite?: 'Strict' | 'Lax' | 'None'
}

export class CookieManager {
  private static readonly COOKIE_PREFIX = 'spotify_'
  private static readonly CODE_VERIFIER_KEY = 'code_verifier'
  private static readonly ACCESS_TOKEN_KEY = 'access_token'
  private static readonly COOKIE_OPTIONS: CookieOptions = {
    path: '/',
    secure: false, // Allow HTTP for development
    sameSite: 'Lax', // Allow cross-site requests for OAuth
    maxAge: 600, // 10 minutos (aumentado para dar mais tempo para o fluxo OAuth)
  }

  private static readonly TOKEN_COOKIE_OPTIONS: CookieOptions = {
    path: '/',
    secure: false, // Allow HTTP for development
    sameSite: 'Lax',
    maxAge: 3600, // 1 hora para o token de acesso
  }

  // Code verifier methods
  static setCodeVerifier(codeVerifier: string): void {
    try {
      const cookieName = this.COOKIE_PREFIX + this.CODE_VERIFIER_KEY
      const cookieValue = this.encodeValue(codeVerifier)
      const cookieString = this.buildCookieString(
        cookieName,
        cookieValue,
        this.COOKIE_OPTIONS,
      )

      console.log('🔧 Setting code verifier cookie:', cookieName)
      document.cookie = cookieString

      // Verify that the cookie was set
      const allCookies = document.cookie
      if (allCookies.includes(cookieName)) {
        console.log('✅ Code verifier stored in secure cookie')
      } else {
        console.warn('⚠️ Code verifier cookie may not have been set properly')
      }
    } catch (error) {
      console.error('❌ Failed to store code verifier in cookie:', error)
      throw new Error('Unable to store authentication data securely')
    }
  }

  static getCodeVerifier(): string | null {
    try {
      const cookieName = this.COOKIE_PREFIX + this.CODE_VERIFIER_KEY
      console.log('🔍 Looking for code verifier cookie:', cookieName)

      const cookies = document.cookie.split(';')

      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=')
        if (name === cookieName && value) {
          const decodedValue = this.decodeValue(value)
          console.log('✅ Code verifier found in secure cookie')
          return decodedValue
        }
      }

      console.log('❌ Code verifier not found in cookies')
      return null
    } catch (error) {
      console.error('❌ Failed to read code verifier from cookie:', error)
      return null
    }
  }

  static clearCodeVerifier(): void {
    try {
      const cookieName = this.COOKIE_PREFIX + this.CODE_VERIFIER_KEY
      // Set cookie with past expiration to delete it
      const expiredOptions = { ...this.COOKIE_OPTIONS, maxAge: -1 }
      const cookieString = this.buildCookieString(
        cookieName,
        '',
        expiredOptions,
      )

      document.cookie = cookieString
      console.log('🧹 Code verifier cleared from secure cookie')
    } catch (error) {
      console.error('❌ Failed to clear code verifier cookie:', error)
    }
  }

  // Access token methods
  static setAccessToken(token: string): void {
    try {
      const cookieName = this.COOKIE_PREFIX + this.ACCESS_TOKEN_KEY
      const cookieValue = this.encodeValue(token)
      const cookieString = this.buildCookieString(
        cookieName,
        cookieValue,
        this.TOKEN_COOKIE_OPTIONS,
      )

      console.log('🔧 Setting access token cookie:', cookieName)
      document.cookie = cookieString

      // Verify that the cookie was set
      const allCookies = document.cookie
      if (allCookies.includes(cookieName)) {
        console.log('✅ Access token stored in secure cookie')
      } else {
        console.warn('⚠️ Access token cookie may not have been set properly')
      }
    } catch (error) {
      console.error('❌ Failed to store access token in cookie:', error)
      throw new Error('Unable to store access token securely')
    }
  }

  static getAccessToken(): string | null {
    try {
      const cookieName = this.COOKIE_PREFIX + this.ACCESS_TOKEN_KEY
      console.log('🔍 Looking for access token cookie:', cookieName)

      const cookies = document.cookie.split(';')

      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=')
        if (name === cookieName && value) {
          const decodedValue = this.decodeValue(value)
          console.log('✅ Access token found in secure cookie')
          return decodedValue
        }
      }

      console.log('❌ Access token not found in cookies')
      return null
    } catch (error) {
      console.error('❌ Failed to read access token from cookie:', error)
      return null
    }
  }

  static clearAccessToken(): void {
    try {
      const cookieName = this.COOKIE_PREFIX + this.ACCESS_TOKEN_KEY
      // Set cookie with past expiration to delete it
      const expiredOptions = { ...this.TOKEN_COOKIE_OPTIONS, maxAge: -1 }
      const cookieString = this.buildCookieString(
        cookieName,
        '',
        expiredOptions,
      )

      document.cookie = cookieString
      console.log('🧹 Access token cleared from secure cookie')
    } catch (error) {
      console.error('❌ Failed to clear access token cookie:', error)
    }
  }

  // Clear all Spotify cookies
  static clearAllSpotifyCookies(): void {
    this.clearCodeVerifier()
    this.clearAccessToken()
    console.log('🧹 All Spotify cookies cleared')
  }

  private static encodeValue(value: string): string {
    // Base64 encoding with URL-safe characters
    return btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  }

  private static decodeValue(encodedValue: string): string {
    // Base64 decoding with URL-safe characters
    const paddedValue = encodedValue.replace(/-/g, '+').replace(/_/g, '/')

    // Add padding if needed
    const padding = 4 - (paddedValue.length % 4)
    const finalValue =
      padding < 4 ? paddedValue + '='.repeat(padding) : paddedValue

    return atob(finalValue)
  }

  private static buildCookieString(
    name: string,
    value: string,
    options: CookieOptions,
  ): string {
    let cookieString = `${name}=${value}`

    if (options.path) {
      cookieString += `; Path=${options.path}`
    }

    if (options.domain) {
      cookieString += `; Domain=${options.domain}`
    }

    if (options.maxAge !== undefined) {
      cookieString += `; Max-Age=${options.maxAge}`
    }

    if (options.expires) {
      cookieString += `; Expires=${options.expires.toUTCString()}`
    }

    if (options.secure) {
      cookieString += '; Secure'
    }

    if (options.httpOnly) {
      cookieString += '; HttpOnly'
    }

    if (options.sameSite) {
      cookieString += `; SameSite=${options.sameSite}`
    }

    return cookieString
  }
}
