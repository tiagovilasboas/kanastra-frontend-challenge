import { afterEach,beforeEach, describe, expect, it, vi } from 'vitest'

import { CookieManager } from '../cookies'

// Mock logger
vi.mock('../logger', () => ({
  logger: {
    debug: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}))

// Mock document.cookie
const mockDocumentCookie = {
  value: '',
  get: () => mockDocumentCookie.value,
  set: (newValue: string) => {
    mockDocumentCookie.value = newValue
  },
  clear: () => {
    mockDocumentCookie.value = ''
  },
}

Object.defineProperty(document, 'cookie', {
  get: mockDocumentCookie.get,
  set: mockDocumentCookie.set,
  configurable: true,
})

describe('CookieManager', () => {
  beforeEach(() => {
    mockDocumentCookie.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    mockDocumentCookie.clear()
  })

  describe('Code Verifier Management', () => {
    it('should set code verifier cookie', () => {
      const codeVerifier = 'test-code-verifier-123'
      
      CookieManager.setCodeVerifier(codeVerifier)
      
      expect(mockDocumentCookie.get()).toContain('spotify_code_verifier')
      expect(mockDocumentCookie.get()).toContain('spotify_code_verifier')
    })

    it('should get code verifier cookie', () => {
      const codeVerifier = 'test-code-verifier-456'
      CookieManager.setCodeVerifier(codeVerifier)
      
      const retrieved = CookieManager.getCodeVerifier()
      
      expect(retrieved).toBe(codeVerifier)
    })

    it('should return null when code verifier not found', () => {
      const retrieved = CookieManager.getCodeVerifier()
      
      expect(retrieved).toBeNull()
    })

    it('should clear code verifier cookie', () => {
      const codeVerifier = 'test-code-verifier-789'
      CookieManager.setCodeVerifier(codeVerifier)
      
      // Verify it was set
      expect(CookieManager.getCodeVerifier()).toBe(codeVerifier)
      
      // Clear it
      CookieManager.clearCodeVerifier()
      
      // Verify it was cleared
      expect(CookieManager.getCodeVerifier()).toBeNull()
    })

    it('should handle multiple cookies correctly', () => {
      const codeVerifier = 'test-code-verifier'
      const otherCookie = 'other_cookie=value'
      
      // Set other cookie first
      mockDocumentCookie.set(otherCookie)
      
      // Set code verifier
      CookieManager.setCodeVerifier(codeVerifier)
      
      // Should still be able to retrieve code verifier
      expect(CookieManager.getCodeVerifier()).toBe(codeVerifier)
    })
  })

  describe('Access Token Management', () => {
    it('should set access token cookie', () => {
      const accessToken = 'test-access-token-123'
      
      CookieManager.setAccessToken(accessToken)
      
      expect(mockDocumentCookie.get()).toContain('spotify_access_token')
      expect(mockDocumentCookie.get()).toContain('spotify_access_token')
    })

    it('should get access token cookie', () => {
      const accessToken = 'test-access-token-456'
      CookieManager.setAccessToken(accessToken)
      
      const retrieved = CookieManager.getAccessToken()
      
      expect(retrieved).toBe(accessToken)
    })

    it('should return null when access token not found', () => {
      const retrieved = CookieManager.getAccessToken()
      
      expect(retrieved).toBeNull()
    })

    it('should clear access token cookie', () => {
      const accessToken = 'test-access-token-789'
      CookieManager.setAccessToken(accessToken)
      
      // Verify it was set
      expect(CookieManager.getAccessToken()).toBe(accessToken)
      
      // Clear it
      CookieManager.clearAccessToken()
      
      // Verify it was cleared
      expect(CookieManager.getAccessToken()).toBeNull()
    })
  })



  describe('Cookie Parsing', () => {
    it('should handle malformed cookies gracefully', () => {
      // Set malformed cookie
      mockDocumentCookie.set('spotify_code_verifier=; malformed')
      
      const retrieved = CookieManager.getCodeVerifier()
      
      expect(retrieved).toBeNull()
    })

    it('should handle empty cookie value', () => {
      // Set empty cookie
      mockDocumentCookie.set('spotify_code_verifier=')
      
      const retrieved = CookieManager.getCodeVerifier()
      
      expect(retrieved).toBeNull()
    })

    it('should handle cookies with spaces', () => {
      const codeVerifier = 'test code verifier with spaces'
      CookieManager.setCodeVerifier(codeVerifier)
      
      const retrieved = CookieManager.getCodeVerifier()
      
      expect(retrieved).toBe(codeVerifier)
    })

    it('should handle special characters in cookie values', () => {
      const codeVerifier = 'test-code-verifier-with-special-chars!@#$%^&*()'
      CookieManager.setCodeVerifier(codeVerifier)
      
      const retrieved = CookieManager.getCodeVerifier()
      
      expect(retrieved).toBe(codeVerifier)
    })
  })


}) 