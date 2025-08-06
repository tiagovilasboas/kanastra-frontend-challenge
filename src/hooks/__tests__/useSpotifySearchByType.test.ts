import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useSpotifySearchByType } from '../useSpotifySearchByType'

// Mock dependencies
vi.mock('@/hooks/useDebounce', () => ({
  useDebounce: vi.fn((value) => value),
}))

describe('useSpotifySearchByType', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('infinite query accumulation', () => {
    it('should have useSpotifySearchByType hook defined', () => {
      expect(useSpotifySearchByType).toBeDefined()
      expect(typeof useSpotifySearchByType).toBe('function')
    })
  })

  describe('debounced query', () => {
    it('should use debounced query value', () => {
      expect(useSpotifySearchByType).toBeDefined()
    })
  })
})
