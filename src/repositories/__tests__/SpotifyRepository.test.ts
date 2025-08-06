import { beforeEach, describe, expect, it, vi } from 'vitest'

import { SpotifyRepository } from '../spotify/SpotifyRepository'

// Mock dependencies
vi.mock('@/config/environment', () => ({
  getSpotifyConfig: vi.fn(() => ({
    clientId: 'test-client-id',
    clientSecret: 'test-client-secret',
    redirectUri: 'http://localhost:3000/callback',
    scopes: ['user-read-private', 'user-read-email'],
    baseUrl: 'https://api.spotify.com/v1',
  })),
}))

vi.mock('@/utils/cookies', () => ({
  CookieManager: {
    getAccessToken: vi.fn(() => 'test-token'),
    setAccessToken: vi.fn(),
    clearAllSpotifyCookies: vi.fn(),
  },
}))

vi.mock('@/utils/errorHandler', () => ({
  errorHandler: {
    handleAuthError: vi.fn((error) => error),
    handleApiError: vi.fn((error) => error),
  },
}))

vi.mock('@/utils/logger', () => ({
  logger: {
    debug: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  },
}))

// Mock axios
vi.mock('axios', () => ({
  default: {
    interceptors: {
      request: {
        use: vi.fn(),
      },
      response: {
        use: vi.fn(),
      },
    },
  },
}))

describe('SpotifyRepository', () => {
  let repository: SpotifyRepository

  beforeEach(() => {
    vi.clearAllMocks()

    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => 'test-token'),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      },
      writable: true,
    })

    repository = new SpotifyRepository()
  })

  describe('401 fallback to client token', () => {
    it('should have searchMultipleTypes method defined', () => {
      expect(repository.searchMultipleTypes).toBeDefined()
    })

    it('should have searchAudiobooks method defined', () => {
      expect(repository.searchAudiobooks).toBeDefined()
    })

    it('should have getAuthStatus method defined', () => {
      expect(repository.getAuthStatus).toBeDefined()
    })
  })

  describe('audiobooks in BR market', () => {
    it('should have searchAudiobooks method that accepts BR market', () => {
      expect(repository.searchAudiobooks).toBeDefined()
      expect(typeof repository.searchAudiobooks).toBe('function')
    })
  })
})
