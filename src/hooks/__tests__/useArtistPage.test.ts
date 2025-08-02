import { renderHook, act, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'

import { useArtistPage } from '../useArtistPage'
import { spotifyRepository } from '@/repositories'

// Mock dependencies
vi.mock('@/repositories', () => ({
  spotifyRepository: {
    getArtistDetails: vi.fn(),
    getArtistTopTracks: vi.fn(),
    getArtistAlbums: vi.fn(),
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
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  )
}

describe('useArtistPage', () => {
  const mockArtistId = 'artist-123'

  const mockArtist = {
    id: mockArtistId,
    name: 'Drake',
    images: [],
    popularity: 95,
    followers: { total: 50000000 },
    genres: ['hip-hop', 'rap'],
  }

  const mockTracks = [
    {
      id: 'track-1',
      name: 'God\'s Plan',
      duration_ms: 198000,
      track_number: 1,
      disc_number: 1,
      explicit: false,
      popularity: 95,
      artists: [],
      album: { id: 'album-1', name: 'Scorpion', images: [], release_date: '2018-06-29', total_tracks: 25, album_type: 'album', artists: [] },
    },
  ]

  const mockAlbums = [
    {
      id: 'album-1',
      name: 'Scorpion',
      images: [],
      release_date: '2018-06-29',
      total_tracks: 25,
      album_type: 'album',
      artists: [],
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('initialization', () => {
    it('should initialize with default state', () => {
      const { result } = renderHook(() => useArtistPage(mockArtistId), {
        wrapper: createWrapper(),
      })

      expect(result.current.artist).toBeUndefined()
      expect(result.current.topTracks).toBeUndefined()
      expect(result.current.albums).toEqual([])
      expect(result.current.currentPage).toBe(1)
      expect(result.current.totalPages).toBe(0)
      expect(result.current.totalItems).toBe(0)
      expect(result.current.isLoadingArtist).toBe(true)
      expect(result.current.isLoadingTracks).toBe(true)
      expect(result.current.isLoadingAlbums).toBe(true)
      expect(result.current.artistError).toBeNull()
      expect(result.current.tracksError).toBeNull()
      expect(result.current.albumsError).toBeNull()
    })

    it('should handle undefined artistId', () => {
      const { result } = renderHook(() => useArtistPage(undefined), {
        wrapper: createWrapper(),
      })

      expect(result.current.artist).toBeUndefined()
      expect(result.current.topTracks).toBeUndefined()
      expect(result.current.albums).toEqual([])
    })
  })

  describe('data fetching', () => {
    it('should fetch artist details successfully', async () => {
      mockSpotifyRepository.getArtistDetails.mockResolvedValue(mockArtist)

      const { result } = renderHook(() => useArtistPage(mockArtistId), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isLoadingArtist).toBe(false)
      })

      expect(result.current.artist).toEqual(mockArtist)
      expect(result.current.artistError).toBeNull()
    })

    it('should fetch top tracks successfully', async () => {
      mockSpotifyRepository.getArtistTopTracks.mockResolvedValue({ tracks: mockTracks })

      const { result } = renderHook(() => useArtistPage(mockArtistId), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isLoadingTracks).toBe(false)
      })

      expect(result.current.topTracks).toEqual(mockTracks)
      expect(result.current.tracksError).toBeNull()
    })

    it('should fetch albums successfully', async () => {
      mockSpotifyRepository.getArtistAlbums.mockResolvedValue(mockAlbums)

      const { result } = renderHook(() => useArtistPage(mockArtistId), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isLoadingAlbums).toBe(false)
      })

      expect(result.current.albums).toEqual(mockAlbums)
      expect(result.current.albumsError).toBeNull()
    })
  })

  describe('error handling', () => {
    it('should handle artist details error', async () => {
      const mockError = new Error('Failed to fetch artist')
      mockSpotifyRepository.getArtistDetails.mockRejectedValue(mockError)

      const { result } = renderHook(() => useArtistPage(mockArtistId), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isLoadingArtist).toBe(false)
      })

      expect(result.current.artist).toBeUndefined()
      expect(result.current.artistError).toBeInstanceOf(Error)
      expect(result.current.artistError?.message).toBe('Failed to fetch artist')
    })

    it('should handle top tracks error', async () => {
      const mockError = new Error('Failed to fetch tracks')
      mockSpotifyRepository.getArtistTopTracks.mockRejectedValue(mockError)

      const { result } = renderHook(() => useArtistPage(mockArtistId), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isLoadingTracks).toBe(false)
      })

      expect(result.current.topTracks).toBeUndefined()
      expect(result.current.tracksError).toBeInstanceOf(Error)
      expect(result.current.tracksError?.message).toBe('Failed to fetch tracks')
    })

    it('should handle albums error', async () => {
      const mockError = new Error('Failed to fetch albums')
      mockSpotifyRepository.getArtistAlbums.mockRejectedValue(mockError)

      const { result } = renderHook(() => useArtistPage(mockArtistId), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isLoadingAlbums).toBe(false)
      })

      expect(result.current.albums).toEqual([])
      expect(result.current.albumsError).toBeInstanceOf(Error)
      expect(result.current.albumsError?.message).toBe('Failed to fetch albums')
    })
  })

  describe('pagination', () => {
    it('should handle page changes', () => {
      const { result } = renderHook(() => useArtistPage(mockArtistId), {
        wrapper: createWrapper(),
      })

      expect(result.current.currentPage).toBe(1)

      act(() => {
        result.current.handlePageChange(2)
      })

      expect(result.current.currentPage).toBe(2)
    })

    it('should calculate total pages correctly', async () => {
      const manyAlbums = Array.from({ length: 50 }, (_, i) => ({
        id: `album-${i}`,
        name: `Album ${i}`,
        images: [],
        release_date: '2023-01-01',
        total_tracks: 10,
        album_type: 'album',
        artists: [],
      }))

      mockSpotifyRepository.getArtistAlbums.mockResolvedValue(manyAlbums)

      const { result } = renderHook(() => useArtistPage(mockArtistId), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isLoadingAlbums).toBe(false)
      })

      // With 50 albums and 20 per page, should have 3 pages
      expect(result.current.totalPages).toBe(3)
      expect(result.current.totalItems).toBe(50)
    })

    it('should handle single page', async () => {
      mockSpotifyRepository.getArtistAlbums.mockResolvedValue(mockAlbums)

      const { result } = renderHook(() => useArtistPage(mockArtistId), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isLoadingAlbums).toBe(false)
      })

      expect(result.current.totalPages).toBe(1)
      expect(result.current.totalItems).toBe(1)
    })
  })

  describe('navigation', () => {
    it('should provide back to home function', () => {
      const { result } = renderHook(() => useArtistPage(mockArtistId), {
        wrapper: createWrapper(),
      })

      expect(typeof result.current.handleBackToHome).toBe('function')
    })
  })

  describe('data refresh', () => {
    it('should provide refresh function', () => {
      const { result } = renderHook(() => useArtistPage(mockArtistId), {
        wrapper: createWrapper(),
      })

      expect(typeof result.current.handleRefresh).toBe('function')
    })

    it('should refresh all data when called', async () => {
      mockSpotifyRepository.getArtistDetails.mockResolvedValue(mockArtist)
      mockSpotifyRepository.getArtistTopTracks.mockResolvedValue({ tracks: mockTracks })
      mockSpotifyRepository.getArtistAlbums.mockResolvedValue(mockAlbums)

      const { result } = renderHook(() => useArtistPage(mockArtistId), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isLoadingArtist).toBe(false)
      })

      // Reset mocks to verify they're called again
      vi.clearAllMocks()

      act(() => {
        result.current.handleRefresh()
      })

      // Should trigger refetch of all data
      expect(mockSpotifyRepository.getArtistDetails).toHaveBeenCalled()
      expect(mockSpotifyRepository.getArtistTopTracks).toHaveBeenCalled()
      expect(mockSpotifyRepository.getArtistAlbums).toHaveBeenCalled()
    })
  })

  describe('prefetching', () => {
    it('should provide prefetch function', () => {
      const { result } = renderHook(() => useArtistPage(mockArtistId), {
        wrapper: createWrapper(),
      })

      expect(typeof result.current.handlePrefetchNextPage).toBe('function')
    })

    it('should prefetch next page when available', async () => {
      const manyAlbums = Array.from({ length: 50 }, (_, i) => ({
        id: `album-${i}`,
        name: `Album ${i}`,
        images: [],
        release_date: '2023-01-01',
        total_tracks: 10,
        album_type: 'album',
        artists: [],
      }))

      mockSpotifyRepository.getArtistAlbums.mockResolvedValue(manyAlbums)

      const { result } = renderHook(() => useArtistPage(mockArtistId), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isLoadingAlbums).toBe(false)
      })

      // Reset mocks
      vi.clearAllMocks()

      act(() => {
        result.current.handlePrefetchNextPage()
      })

      // Should prefetch next page
      expect(mockSpotifyRepository.getArtistAlbums).toHaveBeenCalledWith(
        mockArtistId,
        ['album', 'single'],
        20,
        20 // offset for page 2
      )
    })

    it('should not prefetch when on last page', async () => {
      mockSpotifyRepository.getArtistAlbums.mockResolvedValue(mockAlbums)

      const { result } = renderHook(() => useArtistPage(mockArtistId), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isLoadingAlbums).toBe(false)
      })

      // Reset mocks
      vi.clearAllMocks()

      act(() => {
        result.current.handlePrefetchNextPage()
      })

      // Should not prefetch since there's only one page
      expect(mockSpotifyRepository.getArtistAlbums).not.toHaveBeenCalled()
    })
  })

  describe('cache invalidation', () => {
    it('should provide cache invalidation function', () => {
      const { result } = renderHook(() => useArtistPage(mockArtistId), {
        wrapper: createWrapper(),
      })

      expect(typeof result.current.handleInvalidateArtistData).toBe('function')
    })
  })

  describe('loading states', () => {
    it('should show loading states during initial fetch', () => {
      const { result } = renderHook(() => useArtistPage(mockArtistId), {
        wrapper: createWrapper(),
      })

      expect(result.current.isLoadingArtist).toBe(true)
      expect(result.current.isLoadingTracks).toBe(true)
      expect(result.current.isLoadingAlbums).toBe(true)
    })

    it('should hide loading states after successful fetch', async () => {
      mockSpotifyRepository.getArtistDetails.mockResolvedValue(mockArtist)
      mockSpotifyRepository.getArtistTopTracks.mockResolvedValue({ tracks: mockTracks })
      mockSpotifyRepository.getArtistAlbums.mockResolvedValue(mockAlbums)

      const { result } = renderHook(() => useArtistPage(mockArtistId), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isLoadingArtist).toBe(false)
        expect(result.current.isLoadingTracks).toBe(false)
        expect(result.current.isLoadingAlbums).toBe(false)
      })
    })
  })

  describe('edge cases', () => {
    it('should handle empty albums response', async () => {
      mockSpotifyRepository.getArtistAlbums.mockResolvedValue([])

      const { result } = renderHook(() => useArtistPage(mockArtistId), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isLoadingAlbums).toBe(false)
      })

      expect(result.current.albums).toEqual([])
      expect(result.current.totalPages).toBe(0)
      expect(result.current.totalItems).toBe(0)
    })

    it('should handle empty tracks response', async () => {
      mockSpotifyRepository.getArtistTopTracks.mockResolvedValue({ tracks: [] })

      const { result } = renderHook(() => useArtistPage(mockArtistId), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isLoadingTracks).toBe(false)
      })

      expect(result.current.topTracks).toEqual([])
    })

    it('should handle null responses', async () => {
      mockSpotifyRepository.getArtistDetails.mockResolvedValue(null)
      mockSpotifyRepository.getArtistTopTracks.mockResolvedValue(null)
      mockSpotifyRepository.getArtistAlbums.mockResolvedValue(null)

      const { result } = renderHook(() => useArtistPage(mockArtistId), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isLoadingArtist).toBe(false)
        expect(result.current.isLoadingTracks).toBe(false)
        expect(result.current.isLoadingAlbums).toBe(false)
      })

      expect(result.current.artist).toBeUndefined()
      expect(result.current.topTracks).toBeUndefined()
      expect(result.current.albums).toEqual([])
    })
  })

  describe('performance', () => {
    it('should not re-fetch data unnecessarily', async () => {
      mockSpotifyRepository.getArtistDetails.mockResolvedValue(mockArtist)

      const { result, rerender } = renderHook(() => useArtistPage(mockArtistId), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isLoadingArtist).toBe(false)
      })

      // Re-render with same artistId
      rerender()

      // Should not call the API again
      expect(mockSpotifyRepository.getArtistDetails).toHaveBeenCalledTimes(1)
    })
  })
}) 