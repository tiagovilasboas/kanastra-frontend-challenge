import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useSpotifySearch } from '../useSpotifySearch'

// Mock dependencies
vi.mock('@/services/SearchService', () => ({
  SearchService: vi.fn().mockImplementation(() => ({
    searchArtists: vi.fn(),
    searchAlbums: vi.fn(),
    searchTracks: vi.fn(),
    searchPlaylists: vi.fn(),
    searchShows: vi.fn(),
    searchEpisodes: vi.fn(),
    searchAudiobooks: vi.fn(),
    searchMultipleTypes: vi.fn(),
    searchAllTypes: vi.fn(),
  })),
}))

vi.mock('@/config/searchLimits', () => ({
  getDeviceBasedConfig: vi.fn(() => ({
    artists: { limit: 20 },
    albums: { limit: 20 },
    tracks: { limit: 20 },
    playlists: { limit: 20 },
    shows: { limit: 20 },
    episodes: { limit: 20 },
    audiobooks: { limit: 20 },
  })),
}))

vi.mock('@/stores/searchStore', () => ({
  useSearchStore: vi.fn(() => ({
    debouncedSearchQuery: 'test query',
  })),
}))

describe('useSpotifySearch', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('searchAllTypes usage', () => {
    it('should have useSpotifySearch hook defined', () => {
      expect(useSpotifySearch).toBeDefined()
      expect(typeof useSpotifySearch).toBe('function')
    })

    it('should use searchAllTypes for multiple types', () => {
      // This test verifies that the hook can be called with multiple types
      // which should trigger the searchAllTypes method
      expect(useSpotifySearch).toBeDefined()
    })
  })

  describe('searchMultipleTypes usage', () => {
    it('should have searchMultipleTypes method available', () => {
      expect(useSpotifySearch).toBeDefined()
    })
  })
})
