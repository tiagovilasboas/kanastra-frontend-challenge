import { beforeEach, describe, expect, it, vi } from 'vitest'

import { SpotifySearchType } from '@/types/spotify'

import { SearchResultProcessor } from '../SearchService'

describe('SearchResultProcessor', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('processResults - hasMore calculation', () => {
    it('should calculate hasMore correctly with offset', () => {
      // Test case: total=10, offset=5, items.length=5
      // hasMore should be false because (5 + 5) >= 10
      const mockResponse = {
        artists: {
          items: Array(5).fill({ id: 'artist1', name: 'Artist 1' }),
          total: 10,
        },
      }

      const result = SearchResultProcessor.processResults(
        mockResponse,
        SpotifySearchType.ARTIST,
        { offset: 5 },
      )

      expect(result.hasMore).toBe(false)
      expect(result.total).toBe(10)
      expect(result.items).toHaveLength(5)
    })

    it('should calculate hasMore correctly when more items available', () => {
      // Test case: total=15, offset=5, items.length=5
      // hasMore should be true because (5 + 5) < 15
      const mockResponse = {
        artists: {
          items: Array(5).fill({ id: 'artist1', name: 'Artist 1' }),
          total: 15,
        },
      }

      const result = SearchResultProcessor.processResults(
        mockResponse,
        SpotifySearchType.ARTIST,
        { offset: 5 },
      )

      expect(result.hasMore).toBe(true)
      expect(result.total).toBe(15)
      expect(result.items).toHaveLength(5)
    })

    it('should calculate hasMore correctly with no offset', () => {
      // Test case: total=10, offset=0, items.length=5
      // hasMore should be true because (0 + 5) < 10
      const mockResponse = {
        artists: {
          items: Array(5).fill({ id: 'artist1', name: 'Artist 1' }),
          total: 10,
        },
      }

      const result = SearchResultProcessor.processResults(
        mockResponse,
        SpotifySearchType.ARTIST,
        { offset: 0 },
      )

      expect(result.hasMore).toBe(true)
      expect(result.total).toBe(10)
      expect(result.items).toHaveLength(5)
    })

    it('should handle empty response correctly', () => {
      const mockResponse = {
        artists: {
          items: [],
          total: 0,
        },
      }

      const result = SearchResultProcessor.processResults(
        mockResponse,
        SpotifySearchType.ARTIST,
        { offset: 0 },
      )

      expect(result.hasMore).toBe(false)
      expect(result.total).toBe(0)
      expect(result.items).toHaveLength(0)
    })

    it('should handle missing data correctly', () => {
      const mockResponse = {}

      const result = SearchResultProcessor.processResults(
        mockResponse,
        SpotifySearchType.ARTIST,
        { offset: 0 },
      )

      expect(result.hasMore).toBe(false)
      expect(result.total).toBe(0)
      expect(result.items).toHaveLength(0)
    })
  })

  describe('processMultipleTypesResponse', () => {
    it('should process multiple types with correct hasMore calculation', () => {
      const mockResponse = {
        artists: {
          items: Array(5).fill({ id: 'artist1', name: 'Artist 1' }),
          total: 10,
        },
        albums: {
          items: Array(3).fill({ id: 'album1', name: 'Album 1' }),
          total: 3,
        },
      }

      const result = SearchResultProcessor.processMultipleTypesResponse(
        mockResponse,
        [SpotifySearchType.ARTIST, SpotifySearchType.ALBUM],
        5,
        0,
      )

      // Artists: (0 + 5) < 10 = true
      expect(result.artists.hasMore).toBe(true)
      expect(result.artists.total).toBe(10)
      expect(result.artists.items).toHaveLength(5)

      // Albums: (0 + 3) >= 3 = false
      expect(result.albums.hasMore).toBe(false)
      expect(result.albums.total).toBe(3)
      expect(result.albums.items).toHaveLength(3)
    })
  })
})
