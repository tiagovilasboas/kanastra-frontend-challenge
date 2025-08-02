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
  private static readonly COOKIE_OPTIONS: CookieOptions = {
    path: '/',
    secure: false, // Allow HTTP for development
    sameSite: 'Lax', // Allow cross-site requests for OAuth
    maxAge: 600, // 10 minutos (aumentado para dar mais tempo para o fluxo OAuth)
  }

  static setCodeVerifier(codeVerifier: string): void {
    try {
      const cookieName = this.COOKIE_PREFIX + this.CODE_VERIFIER_KEY
      const cookieValue = this.encodeValue(codeVerifier)
      const cookieString = this.buildCookieString(
        cookieName,
        cookieValue,
        this.COOKIE_OPTIONS,
      )

      console.log('🔧 Setting cookie:', cookieName)
      console.log('🔧 Cookie string:', cookieString)
      
      document.cookie = cookieString
      
      // Verify that the cookie was set
      const allCookies = document.cookie
      console.log('🔧 All cookies after setting:', allCookies)
      
      if (allCookies.includes(cookieName)) {
        console.log('✅ Code verifier stored in secure cookie')
      } else {
        console.warn('⚠️ Cookie may not have been set properly')
      }
    } catch (error) {
      console.error('❌ Failed to store code verifier in cookie:', error)
      throw new Error('Unable to store authentication data securely')
    }
  }

  static getCodeVerifier(): string | null {
    try {
      const cookieName = this.COOKIE_PREFIX + this.CODE_VERIFIER_KEY
      console.log('🔍 Looking for cookie:', cookieName)
      console.log('🔍 All cookies:', document.cookie)
      
      const cookies = document.cookie.split(';')

      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=')
        console.log('🔍 Checking cookie:', name, 'value:', value ? 'present' : 'missing')
        if (name === cookieName && value) {
          const decodedValue = this.decodeValue(value)
          console.log('✅ Code verifier found in secure cookie')
          return decodedValue
        }
      }

      console.log('❌ Code verifier not found in cookies')
      console.log('🔍 Available cookies:', cookies.map(c => c.trim().split('=')[0]))
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
