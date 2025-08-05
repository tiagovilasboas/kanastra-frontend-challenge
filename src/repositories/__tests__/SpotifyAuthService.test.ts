import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { CookieManager } from '@/utils/cookies'
import { errorHandler } from '@/utils/errorHandler'

import {
  SpotifyAuthConfig,
  SpotifyAuthService,
} from '../spotify/SpotifyAuthService'

// Mock dependencies
vi.mock('@/utils/cookies', () => ({
  CookieManager: {
    setCodeVerifier: vi.fn(),
    getCodeVerifier: vi.fn(),
    clearCodeVerifier: vi.fn(),
  },
}))

vi.mock('@/utils/errorHandler', () => ({
  errorHandler: {
    handleAuthError: vi.fn(),
  },
}))

vi.mock('@/utils/logger', () => ({
  logger: {
    debug: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  },
}))

vi.mock('@/schemas/spotify', () => ({
  validateSpotifyTokenResponse: vi.fn(),
}))

const mockCookieManager = CookieManager as unknown as typeof CookieManager
const mockErrorHandler = errorHandler as unknown as typeof errorHandler

// Mock crypto API
const mockCrypto = {
  getRandomValues: vi.fn(),
  subtle: {
    digest: vi.fn(),
  },
}

Object.defineProperty(global, 'crypto', {
  value: mockCrypto,
  writable: true,
})

// Mock fetch
global.fetch = vi.fn()

describe('SpotifyAuthService', () => {
  let authService: SpotifyAuthService
  let mockConfig: SpotifyAuthConfig

  beforeEach(() => {
    vi.clearAllMocks()

    mockConfig = {
      clientId: 'test-client-id',
      clientSecret: 'test-client-secret',
      redirectUri: 'http://localhost:3000/callback',
      scopes: ['user-read-private', 'user-read-email'],
    }

    authService = new SpotifyAuthService(mockConfig)

    // Mock crypto.getRandomValues to return predictable values
    mockCrypto.getRandomValues.mockImplementation((array) => {
      for (let i = 0; i < array.length; i++) {
        array[i] = i % 256
      }
      return array
    })

    // Mock crypto.subtle.digest
    mockCrypto.subtle.digest.mockResolvedValue(new Uint8Array(32).fill(1))
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('constructor', () => {
    it('should create instance with config', () => {
      expect(authService).toBeInstanceOf(SpotifyAuthService)
    })
  })

  describe('generateAuthUrl', () => {
    it('should generate valid auth URL', async () => {
      const authUrl = await authService.generateAuthUrl()

      expect(authUrl).toContain('https://accounts.spotify.com/authorize')
      expect(authUrl).toContain('client_id=test-client-id')
      expect(authUrl).toContain(
        'redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback',
      )
      expect(authUrl).toContain('scope=user-read-private%20user-read-email')
      expect(authUrl).toContain('response_type=code')
      expect(authUrl).toContain('code_challenge_method=S256')
      expect(mockCookieManager.setCodeVerifier).toHaveBeenCalled()
    })

    it('should handle missing client ID', async () => {
      const invalidConfig = { ...mockConfig, clientId: '' }
      const invalidService = new SpotifyAuthService(invalidConfig)

      await expect(invalidService.generateAuthUrl()).rejects.toThrow()
      expect(mockErrorHandler.handleAuthError).toHaveBeenCalled()
    })

    it('should handle crypto errors', async () => {
      // Mock crypto error by overriding the global mock
      const originalGetRandomValues = window.crypto.getRandomValues
      window.crypto.getRandomValues = vi.fn().mockImplementation(() => {
        throw new Error('Crypto error')
      })

      await expect(authService.generateAuthUrl()).rejects.toThrow()
      expect(mockErrorHandler.handleAuthError).toHaveBeenCalled()

      // Restore original mock
      window.crypto.getRandomValues = originalGetRandomValues
    })
  })

  describe('extractCodeFromUrl', () => {
    it('should extract code and state from valid URL', () => {
      const url =
        'http://localhost:3000/callback?code=test-code&state=test-state'

      const result = authService.extractCodeFromUrl(url)

      expect(result.code).toBe('test-code')
      expect(result.state).toBe('test-state')
    })

    it('should handle URL without code', () => {
      const url = 'http://localhost:3000/callback?error=access_denied'

      const result = authService.extractCodeFromUrl(url)

      expect(result.code).toBeNull()
      expect(result.state).toBeNull()
    })

    it('should handle malformed URL', () => {
      const url = 'invalid-url'

      const result = authService.extractCodeFromUrl(url)

      expect(result.code).toBeNull()
      expect(result.state).toBeNull()
    })

    it('should handle URL with only code', () => {
      const url = 'http://localhost:3000/callback?code=test-code'

      const result = authService.extractCodeFromUrl(url)

      expect(result.code).toBe('test-code')
      expect(result.state).toBeNull()
    })
  })

  describe('handleTokenExchange', () => {
    beforeEach(() => {
      mockCookieManager.getCodeVerifier.mockReturnValue('test-code-verifier')
    })

    it('should handle successful token exchange', async () => {
      const mockTokenResponse = {
        access_token: 'test-access-token',
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: 'test-refresh-token',
        scope: 'user-read-private user-read-email',
      }

      const mockFetch = fetch as unknown as ReturnType<typeof vi.fn>
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockTokenResponse),
      })

      const { validateSpotifyTokenResponse } = await import('@/schemas/spotify')
      ;(
        validateSpotifyTokenResponse as unknown as ReturnType<typeof vi.fn>
      ).mockReturnValue(mockTokenResponse)

      const result = await authService.handleTokenExchange('test-code')

      expect(result).toEqual(mockTokenResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        'https://accounts.spotify.com/api/token',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }),
      )
      expect(mockCookieManager.clearCodeVerifier).toHaveBeenCalled()
    })

    it('should handle missing code verifier', async () => {
      mockCookieManager.getCodeVerifier.mockReturnValue(null)

      await expect(
        authService.handleTokenExchange('test-code'),
      ).rejects.toThrow('Code verifier not found')
      expect(mockErrorHandler.handleAuthError).toHaveBeenCalled()
    })

    it('should handle token exchange with code verifier from cookie', async () => {
      mockCookieManager.getCodeVerifier.mockReturnValue('cookie-code-verifier')

      const mockTokenResponse = {
        access_token: 'test-access-token',
        token_type: 'Bearer',
        expires_in: 3600,
      }

      const mockFetch = fetch as unknown as ReturnType<typeof vi.fn>
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockTokenResponse),
      })

      const { validateSpotifyTokenResponse } = await import('@/schemas/spotify')
      ;(
        validateSpotifyTokenResponse as unknown as ReturnType<typeof vi.fn>
      ).mockReturnValue(mockTokenResponse)

      await authService.handleTokenExchange('test-code')

      expect(mockFetch).toHaveBeenCalled()
      expect(mockCookieManager.clearCodeVerifier).toHaveBeenCalled()
    })

    it('should handle invalid authorization code', async () => {
      const mockFetch = fetch as unknown as ReturnType<typeof vi.fn>
      mockFetch.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: 'invalid_grant' }),
      })

      await expect(
        authService.handleTokenExchange('invalid-code'),
      ).rejects.toThrow('Invalid authorization code')
      expect(mockCookieManager.clearCodeVerifier).not.toHaveBeenCalled()
    })

    it('should handle token exchange error', async () => {
      const mockFetch = fetch as unknown as ReturnType<typeof vi.fn>
      mockFetch.mockResolvedValue({
        ok: false,
        json: () =>
          Promise.resolve({
            error: 'invalid_client',
            error_description: 'Invalid client',
          }),
      })

      await expect(
        authService.handleTokenExchange('test-code'),
      ).rejects.toThrow('Token exchange failed: Invalid client')
      expect(mockErrorHandler.handleAuthError).toHaveBeenCalled()
    })

    it('should handle network errors', async () => {
      const mockFetch = fetch as unknown as ReturnType<typeof vi.fn>
      mockFetch.mockRejectedValue(new Error('Network error'))

      await expect(
        authService.handleTokenExchange('test-code'),
      ).rejects.toThrow()
      expect(mockErrorHandler.handleAuthError).toHaveBeenCalled()
    })

    it('should handle validation errors', async () => {
      const mockTokenResponse = {
        access_token: 'test-access-token',
        token_type: 'Bearer',
        expires_in: 3600,
      }

      const mockFetch = fetch as unknown as ReturnType<typeof vi.fn>
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockTokenResponse),
      })

      const { validateSpotifyTokenResponse } = await import('@/schemas/spotify')
      ;(
        validateSpotifyTokenResponse as unknown as ReturnType<typeof vi.fn>
      ).mockImplementation(() => {
        throw new Error('Validation failed')
      })

      await expect(
        authService.handleTokenExchange('test-code'),
      ).rejects.toThrow()
      expect(mockErrorHandler.handleAuthError).toHaveBeenCalled()
    })
  })

  describe('code verifier management', () => {
    it('should migrate code verifier from localStorage to cookie', async () => {
      // Mock localStorage
      const mockLocalStorage = {
        getItem: vi.fn().mockReturnValue('localstorage-verifier'),
        removeItem: vi.fn(),
      }
      Object.defineProperty(global, 'localStorage', {
        value: mockLocalStorage,
        writable: true,
      })

      mockCookieManager.getCodeVerifier.mockReturnValue(null)

      // Create a new instance to trigger the migration logic
      const serviceWithMigration = new SpotifyAuthService(mockConfig)

      // Access private method through reflection or public interface
      // For now, we'll test through the public interface
      const mockTokenResponse = {
        access_token: 'test-access-token',
        token_type: 'Bearer',
        expires_in: 3600,
      }

      const mockFetch = fetch as unknown as ReturnType<typeof vi.fn>
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockTokenResponse),
      })

      const { validateSpotifyTokenResponse } = await import('@/schemas/spotify')
      ;(
        validateSpotifyTokenResponse as unknown as ReturnType<typeof vi.fn>
      ).mockReturnValue(mockTokenResponse)

      await serviceWithMigration.handleTokenExchange('test-code')

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(
        'spotify_code_verifier',
      )
      expect(mockCookieManager.setCodeVerifier).toHaveBeenCalledWith(
        'localstorage-verifier',
      )
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(
        'spotify_code_verifier',
      )
    })
  })
})
