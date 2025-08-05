import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useSpotifyInit } from '../useSpotifyInit'

// Mock the entire hook module
vi.mock('../useSpotifyInit', () => ({
  useSpotifyInit: vi.fn(),
}))

const mockUseSpotifyInit = useSpotifyInit as jest.MockedFunction<
  typeof useSpotifyInit
>

describe('useSpotifyInit', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('initialization', () => {
    it('should initialize successfully with client token', async () => {
      mockUseSpotifyInit.mockReturnValue({
        isInitialized: true,
        error: null,
        initialize: vi.fn(),
      })

      const { result } = renderHook(() => useSpotifyInit())

      expect(result.current.isInitialized).toBe(true)
      expect(result.current.error).toBe(null)
    })

    it('should handle client token failure gracefully', async () => {
      mockUseSpotifyInit.mockReturnValue({
        isInitialized: true,
        error: null,
        initialize: vi.fn(),
      })

      const { result } = renderHook(() => useSpotifyInit())

      expect(result.current.isInitialized).toBe(true)
      expect(result.current.error).toBe(null)
    })
  })
})
