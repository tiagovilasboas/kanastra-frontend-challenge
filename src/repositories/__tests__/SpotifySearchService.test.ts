import { beforeEach, describe, expect, it, vi } from 'vitest'

import { SpotifySearchService } from '../spotify/SpotifySearchService'

// Mock dependencies
vi.mock('@/utils/errorHandler', () => ({
  errorHandler: {
    handleApiError: vi.fn(),
  },
}))

vi.mock('@/utils/logger', () => ({
  logger: {
    debug: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  },
}))

vi.mock('@/config/features', () => ({
  isFeatureEnabled: vi.fn((feature: string) => {
    if (feature === 'ENABLE_GENRES_ENDPOINT') return true
    if (feature === 'ENABLE_GENRES_FALLBACK') return true
    if (feature === 'ENABLE_GENRES_DEPRECATION_WARNING') return false
    return false
  }),
}))

vi.mock('@/constants/genres', () => ({
  getStaticGenres: vi.fn(() => ['rock', 'pop', 'jazz']),
}))

vi.mock('@/schemas/spotify', () => ({
  validateSpotifySearchResponse: vi.fn(),
  validateSpotifyArtist: vi.fn(),
  validateSpotifyAlbumsResponse: vi.fn(),
  validateSpotifyTracksResponse: vi.fn(),
}))

describe('SpotifySearchService', () => {
  let searchService: SpotifySearchService

  beforeEach(() => {
    vi.clearAllMocks()
    searchService = new SpotifySearchService({
      baseURL: 'https://api.spotify.com/v1',
    })
    searchService.setAccessToken('test-token')
  })

  describe('getTrackByISRC', () => {
    it('should be defined', () => {
      expect(searchService.getTrackByISRC).toBeDefined()
    })
  })

  describe('getAlbumByUPC', () => {
    it('should be defined', () => {
      expect(searchService.getAlbumByUPC).toBeDefined()
    })
  })

  describe('getAvailableGenres', () => {
    it('should be defined', () => {
      expect(searchService.getAvailableGenres).toBeDefined()
    })
  })
})
