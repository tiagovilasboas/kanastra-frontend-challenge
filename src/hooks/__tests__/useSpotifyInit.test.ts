import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { spotifyRepository } from '@/repositories'

import { useSpotifyInit } from '../useSpotifyInit'

// Mock dependencies
vi.mock('@/repositories', () => ({
  spotifyRepository: {
    getClientToken: vi.fn(),
  },
}))

vi.mock('@/utils/logger', () => ({
  logger: {
    debug: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}))

const mockSpotifyRepository = spotifyRepository as jest.Mocked<
  typeof spotifyRepository
>

describe('useSpotifyInit', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('initialization', () => {
    it('should initialize successfully with client token', async () => {
      mockSpotifyRepository.getClientToken.mockResolvedValue('mock-token')

      const { result } = renderHook(() => useSpotifyInit())

      // Initially not initialized
      expect(result.current.isInitialized).toBe(false)
      expect(result.current.error).toBe(null)

      // Wait for initialization
      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true)
      })

      expect(result.current.error).toBe(null)
      expect(mockSpotifyRepository.getClientToken).toHaveBeenCalled()
    })

    it('should handle client token failure gracefully', async () => {
      const tokenError = new Error('Failed to get client token')
      mockSpotifyRepository.getClientToken.mockRejectedValue(tokenError)

      const { result } = renderHook(() => useSpotifyInit())

      // Wait for initialization
      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true)
      })

      // Should still be initialized even with token error
      expect(result.current.isInitialized).toBe(true)
      expect(result.current.error).toBe(null) // No error should be set for token failures
      expect(mockSpotifyRepository.getClientToken).toHaveBeenCalled()
    })
  })
})
