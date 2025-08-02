import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach,beforeEach, describe, expect, it, vi } from 'vitest'

import { spotifyRepository } from '@/repositories'

import { useSpotifySearch } from '../useSpotifySearch'

// Mock dependencies
vi.mock('@/repositories', () => ({
  spotifyRepository: {
    searchArtists: vi.fn(),
    searchArtistsPublic: vi.fn(),
    getClientToken: vi.fn(),
  },
}))

vi.mock('@/utils/logger', () => ({
  logger: {
    debug: vi.fn(),
    error: vi.fn(),
  },
}))

const mockSpotifyRepository = vi.mocked(spotifyRepository)

// Test wrapper with providers
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useSpotifySearch', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  describe('initialization', () => {
    it('should initialize with empty state', () => {
      const { result } = renderHook(() => useSpotifySearch(), {
        wrapper: createWrapper(),
      })

      expect(result.current.searchQuery).toBe('')
      expect(result.current.searchResults).toEqual([])
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })
  })

  describe('searchArtists', () => {
    it('should update search query immediately', () => {
      const { result } = renderHook(() => useSpotifySearch(), {
        wrapper: createWrapper(),
      })

      act(() => {
        result.current.searchArtists('drake')
      })

      expect(result.current.searchQuery).toBe('drake')
    })

    it('should debounce the search query', async () => {
      const { result } = renderHook(() => useSpotifySearch(), {
        wrapper: createWrapper(),
      })

      act(() => {
        result.current.searchArtists('d')
      })

      expect(result.current.searchQuery).toBe('d')

      act(() => {
        result.current.searchArtists('dr')
      })

      expect(result.current.searchQuery).toBe('dr')

      act(() => {
        result.current.searchArtists('dra')
      })

      expect(result.current.searchQuery).toBe('dra')

      act(() => {
        result.current.searchArtists('drake')
      })

      expect(result.current.searchQuery).toBe('drake')

      // Fast-forward time to trigger debounce
      act(() => {
        vi.advanceTimersByTime(300)
      })

      await waitFor(() => {
        expect(result.current.searchQuery).toBe('drake')
      }, { timeout: 1000 })
    })
  })

  describe('clearSearch', () => {
    it('should clear search query and results', () => {
      const { result } = renderHook(() => useSpotifySearch(), {
        wrapper: createWrapper(),
      })

      // Set initial search
      act(() => {
        result.current.searchArtists('drake')
      })

      expect(result.current.searchQuery).toBe('drake')

      // Clear search
      act(() => {
        result.current.clearSearch()
      })

      expect(result.current.searchQuery).toBe('')
      expect(result.current.searchResults).toEqual([])
    })
  })

  describe('authenticated search', () => {
    it('should use authenticated search when user token exists', async () => {
      const mockToken = 'user-access-token'
      const mockArtists = [
        { id: '1', name: 'Drake', images: [], popularity: 95, followers: { total: 1000000 }, genres: ['hip-hop'] },
      ]

      localStorage.setItem('spotify_token', mockToken)
      mockSpotifyRepository.searchArtists.mockResolvedValue({
        artists: { items: mockArtists, total: 1, limit: 20, offset: 0, next: null, previous: null },
      })

      const { result } = renderHook(() => useSpotifySearch(), {
        wrapper: createWrapper(),
      })

      act(() => {
        result.current.searchArtists('drake')
      })

      act(() => {
        vi.advanceTimersByTime(300)
      })

      await waitFor(() => {
        expect(mockSpotifyRepository.searchArtists).toHaveBeenCalledWith('drake')
        expect(mockSpotifyRepository.searchArtistsPublic).not.toHaveBeenCalled()
        expect(result.current.searchResults).toEqual(mockArtists)
      }, { timeout: 1000 })
    })

    it('should handle authenticated search errors', async () => {
      const mockToken = 'user-access-token'
      const mockError = new Error('Search failed')

      localStorage.setItem('spotify_token', mockToken)
      mockSpotifyRepository.searchArtists.mockRejectedValue(mockError)

      const { result } = renderHook(() => useSpotifySearch(), {
        wrapper: createWrapper(),
      })

      act(() => {
        result.current.searchArtists('drake')
      })

      act(() => {
        vi.advanceTimersByTime(500)
      })

      await waitFor(() => {
        expect(result.current.error).toBe('Search failed')
        expect(result.current.searchResults).toEqual([])
      })
    })
  })

  describe('public search', () => {
    it('should use public search when no user token exists', async () => {
      const mockArtists = [
        { id: '1', name: 'Drake', images: [], popularity: 95, followers: { total: 1000000 }, genres: ['hip-hop'] },
      ]

      mockSpotifyRepository.getClientToken.mockResolvedValue('client-token')
      mockSpotifyRepository.searchArtistsPublic.mockResolvedValue({
        artists: { items: mockArtists, total: 1, limit: 20, offset: 0, next: null, previous: null },
      })

      const { result } = renderHook(() => useSpotifySearch(), {
        wrapper: createWrapper(),
      })

      act(() => {
        result.current.searchArtists('drake')
      })

      act(() => {
        vi.advanceTimersByTime(500)
      })

      await waitFor(() => {
        expect(mockSpotifyRepository.getClientToken).toHaveBeenCalled()
        expect(mockSpotifyRepository.searchArtistsPublic).toHaveBeenCalledWith('drake')
        expect(mockSpotifyRepository.searchArtists).not.toHaveBeenCalled()
        expect(result.current.searchResults).toEqual(mockArtists)
      })
    })

    it('should handle public search errors', async () => {
      const mockError = new Error('Public search failed')

      mockSpotifyRepository.getClientToken.mockResolvedValue('client-token')
      mockSpotifyRepository.searchArtistsPublic.mockRejectedValue(mockError)

      const { result } = renderHook(() => useSpotifySearch(), {
        wrapper: createWrapper(),
      })

      act(() => {
        result.current.searchArtists('drake')
      })

      act(() => {
        vi.advanceTimersByTime(500)
      })

      await waitFor(() => {
        expect(result.current.error).toBe('Public search failed')
        expect(result.current.searchResults).toEqual([])
      })
    })

    it('should handle client token errors', async () => {
      const mockError = new Error('Client token failed')

      mockSpotifyRepository.getClientToken.mockRejectedValue(mockError)

      const { result } = renderHook(() => useSpotifySearch(), {
        wrapper: createWrapper(),
      })

      act(() => {
        result.current.searchArtists('drake')
      })

      act(() => {
        vi.advanceTimersByTime(500)
      })

      await waitFor(() => {
        expect(result.current.error).toBe('Client token failed')
        expect(result.current.searchResults).toEqual([])
      })
    })
  })

  describe('empty query handling', () => {
    it('should not search when query is empty', async () => {
      const { result } = renderHook(() => useSpotifySearch(), {
        wrapper: createWrapper(),
      })

      act(() => {
        result.current.searchArtists('')
      })

      act(() => {
        vi.advanceTimersByTime(500)
      })

      await waitFor(() => {
        expect(mockSpotifyRepository.searchArtists).not.toHaveBeenCalled()
        expect(mockSpotifyRepository.searchArtistsPublic).not.toHaveBeenCalled()
        expect(result.current.searchResults).toEqual([])
      })
    })

    it('should not search when query is only whitespace', async () => {
      const { result } = renderHook(() => useSpotifySearch(), {
        wrapper: createWrapper(),
      })

      act(() => {
        result.current.searchArtists('   ')
      })

      act(() => {
        vi.advanceTimersByTime(500)
      })

      await waitFor(() => {
        expect(mockSpotifyRepository.searchArtists).not.toHaveBeenCalled()
        expect(mockSpotifyRepository.searchArtistsPublic).not.toHaveBeenCalled()
        expect(result.current.searchResults).toEqual([])
      })
    })
  })

  describe('loading states', () => {
    it('should show loading state during search', async () => {
      const mockArtists = [
        { id: '1', name: 'Drake', images: [], popularity: 95, followers: { total: 1000000 }, genres: ['hip-hop'] },
      ]

      mockSpotifyRepository.getClientToken.mockResolvedValue('client-token')
      mockSpotifyRepository.searchArtistsPublic.mockResolvedValue({
        artists: { items: mockArtists, total: 1, limit: 20, offset: 0, next: null, previous: null },
      })

      const { result } = renderHook(() => useSpotifySearch(), {
        wrapper: createWrapper(),
      })

      act(() => {
        result.current.searchArtists('drake')
      })

      act(() => {
        vi.advanceTimersByTime(500)
      })

      // Should be loading initially
      expect(result.current.isLoading).toBe(true)

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
        expect(result.current.searchResults).toEqual(mockArtists)
      })
    })
  })
}) 