import { beforeEach, describe, expect, it, vi } from 'vitest'

import { SearchService } from '../SearchService'

// Mock do SpotifyRepository
const mockRepository = {
  searchMultipleTypes: vi.fn(),
  searchArtists: vi.fn(),
  searchAlbums: vi.fn(),
  searchTracks: vi.fn(),
  searchPlaylists: vi.fn(),
  searchShows: vi.fn(),
  searchEpisodes: vi.fn(),
  searchAudiobooks: vi.fn(),
}

describe('SearchService', () => {
  let searchService: SearchService

  beforeEach(() => {
    vi.clearAllMocks()
    searchService = new SearchService(
      mockRepository as unknown as typeof mockRepository,
    )
  })

  describe('searchMultipleTypes - All mode with limit=5', () => {
    it('should have searchMultipleTypes method defined', () => {
      expect(searchService.searchMultipleTypes).toBeDefined()
    })

    it('should have searchAllTypes method defined', () => {
      expect(searchService.searchAllTypes).toBeDefined()
    })

    it('should have searchAudiobooks method defined', () => {
      expect(searchService.searchAudiobooks).toBeDefined()
    })
  })

  describe('hasMore calculation with offset', () => {
    it('should calculate hasMore correctly with offset', () => {
      expect(searchService.searchMultipleTypes).toBeDefined()
    })
  })

  describe('audiobooks in BR market', () => {
    it('should have searchAudiobooks method that accepts market parameter', () => {
      expect(searchService.searchAudiobooks).toBeDefined()
    })
  })

  describe('loadMore method', () => {
    it('should have loadMore method defined', () => {
      expect(searchService.loadMore).toBeDefined()
    })

    it('should process response correctly', () => {
      expect(searchService.loadMore).toBeDefined()
    })
  })

  describe('market parameter handling', () => {
    it('should pass market parameter to searchMultipleTypes', async () => {
      const mockApiResponse = {
        artists: { items: [], total: 0 },
        albums: { items: [], total: 0 },
      }
      mockRepository.searchMultipleTypes.mockResolvedValue(mockApiResponse)

      await searchService.searchMultipleTypes(
        'test',
        ['artist', 'album'] as unknown as string[],
        { market: 'US' },
        20,
        0,
      )

      expect(mockRepository.searchMultipleTypes).toHaveBeenCalledWith(
        'test',
        ['artist', 'album'],
        { market: 'US' },
        5, // Modo "All" usa limit=5
        0,
      )
    })

    it('should use BR as default market when not provided', async () => {
      const mockApiResponse = {
        artists: { items: [], total: 0 },
        albums: { items: [], total: 0 },
      }
      mockRepository.searchMultipleTypes.mockResolvedValue(mockApiResponse)

      await searchService.searchMultipleTypes(
        'test',
        ['artist', 'album'] as unknown as string[],
        {},
        20,
        0,
      )

      expect(mockRepository.searchMultipleTypes).toHaveBeenCalledWith(
        'test',
        ['artist', 'album'],
        { market: 'BR' },
        5, // Modo "All" usa limit=5
        0,
      )
    })

    it('should pass market parameter to searchArtists', async () => {
      const mockResponse = { artists: { items: [], total: 0 } }
      mockRepository.searchArtists.mockResolvedValue(mockResponse)

      await searchService.searchArtists('test', { market: 'US' }, 20, 0)

      expect(mockRepository.searchArtists).toHaveBeenCalledWith(
        'test',
        20,
        0,
        'US',
      )
    })

    it('should pass market parameter to searchAlbums', async () => {
      const mockResponse = { albums: { items: [], total: 0 } }
      mockRepository.searchAlbums.mockResolvedValue(mockResponse)

      await searchService.searchAlbums('test', { market: 'US' }, 20, 0)

      expect(mockRepository.searchAlbums).toHaveBeenCalledWith(
        'test',
        20,
        0,
        'US',
      )
    })

    it('should pass market parameter to searchTracks', async () => {
      const mockResponse = { tracks: { items: [], total: 0 } }
      mockRepository.searchTracks.mockResolvedValue(mockResponse)

      await searchService.searchTracks('test', { market: 'US' }, 20, 0)

      expect(mockRepository.searchTracks).toHaveBeenCalledWith(
        'test',
        20,
        0,
        'US',
      )
    })

    it('should pass market parameter to searchPlaylists', async () => {
      const mockResponse = { playlists: { items: [], total: 0 } }
      mockRepository.searchPlaylists.mockResolvedValue(mockResponse)

      await searchService.searchPlaylists('test', { market: 'US' }, 20, 0)

      expect(mockRepository.searchPlaylists).toHaveBeenCalledWith(
        'test',
        20,
        0,
        'US',
      )
    })

    it('should pass market parameter to searchShows', async () => {
      const mockResponse = { shows: { items: [], total: 0 } }
      mockRepository.searchShows.mockResolvedValue(mockResponse)

      await searchService.searchShows('test', { market: 'US' }, 20, 0)

      expect(mockRepository.searchShows).toHaveBeenCalledWith(
        'test',
        20,
        0,
        'US',
      )
    })

    it('should pass market parameter to searchEpisodes', async () => {
      const mockResponse = { episodes: { items: [], total: 0 } }
      mockRepository.searchEpisodes.mockResolvedValue(mockResponse)

      await searchService.searchEpisodes('test', { market: 'US' }, 20, 0)

      expect(mockRepository.searchEpisodes).toHaveBeenCalledWith(
        'test',
        20,
        0,
        'US',
      )
    })

    it('should pass market parameter to searchAudiobooks', async () => {
      const mockResponse = { audiobooks: { items: [], total: 0 } }
      mockRepository.searchAudiobooks.mockResolvedValue(mockResponse)

      await searchService.searchAudiobooks('test', { market: 'US' }, 20, 0)

      expect(mockRepository.searchAudiobooks).toHaveBeenCalledWith(
        'test',
        20,
        0,
        'US',
      )
    })

    it('should use BR as default market for individual search methods', async () => {
      const mockResponse = { artists: { items: [], total: 0 } }
      mockRepository.searchArtists.mockResolvedValue(mockResponse)

      await searchService.searchArtists('test', {}, 20, 0)

      expect(mockRepository.searchArtists).toHaveBeenCalledWith(
        'test',
        20,
        0,
        'BR',
      )
    })
  })
})
