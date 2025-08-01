import { renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'

import { useSpotifyAuth } from '../useSpotifyAuth'
import { spotifyRepository } from '@/repositories'

// Mock dependencies
vi.mock('@/repositories', () => ({
  spotifyRepository: {
    setAccessToken: vi.fn(),
    logout: vi.fn(),
    extractCodeFromUrl: vi.fn(),
    getAuthUrl: vi.fn(),
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

describe('useSpotifyAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        href: 'http://localhost:3000',
      },
      writable: true,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('initialization', () => {
    it('should initialize with no authentication when no token exists', () => {
      const { result } = renderHook(() => useSpotifyAuth(), {
        wrapper: createWrapper(),
      })

      expect(result.current.isAuthenticated).toBe(false)
    })

    it('should initialize with authentication when token exists in localStorage', () => {
      const mockToken = 'mock-access-token'
      localStorage.setItem('spotify_token', mockToken)

      const { result } = renderHook(() => useSpotifyAuth(), {
        wrapper: createWrapper(),
      })

      expect(result.current.isAuthenticated).toBe(true)
      expect(mockSpotifyRepository.setAccessToken).toHaveBeenCalledWith(mockToken)
    })
  })

  describe('login', () => {
    it('should generate auth URL and redirect', async () => {
      const mockAuthUrl = 'https://accounts.spotify.com/authorize?client_id=123'
      mockSpotifyRepository.getAuthUrl.mockResolvedValue(mockAuthUrl)

      const { result } = renderHook(() => useSpotifyAuth(), {
        wrapper: createWrapper(),
      })

      await act(async () => {
        await result.current.login()
      })

      expect(mockSpotifyRepository.getAuthUrl).toHaveBeenCalled()
      expect(window.location.href).toBe(mockAuthUrl)
    })

    it('should handle login errors gracefully', async () => {
      const mockError = new Error('Auth URL generation failed')
      mockSpotifyRepository.getAuthUrl.mockRejectedValue(mockError)

      const { result } = renderHook(() => useSpotifyAuth(), {
        wrapper: createWrapper(),
      })

      await act(async () => {
        await result.current.login()
      })

      expect(mockSpotifyRepository.getAuthUrl).toHaveBeenCalled()
      // Should not throw error, just log it
      expect(result.current.isAuthenticated).toBe(false)
    })
  })

  describe('logout', () => {
    it('should clear authentication state and redirect', () => {
      // Setup authenticated state
      localStorage.setItem('spotify_token', 'mock-token')

      const { result } = renderHook(() => useSpotifyAuth(), {
        wrapper: createWrapper(),
      })

      act(() => {
        result.current.logout()
      })

      expect(mockSpotifyRepository.logout).toHaveBeenCalled()
      expect(result.current.isAuthenticated).toBe(false)
      expect(localStorage.getItem('spotify_token')).toBeNull()
    })
  })

  describe('handleCallback', () => {
    it('should handle successful callback with code', async () => {
      const mockCode = 'mock-auth-code'
      const mockToken = 'mock-access-token'
      const mockUrl = `http://localhost:3000/callback?code=${mockCode}&state=123`

      mockSpotifyRepository.extractCodeFromUrl.mockReturnValue({
        code: mockCode,
        state: '123',
      })

      // Mock the token exchange (this would be handled by the repository)
      // For this test, we'll just verify the callback is called

      const { result } = renderHook(() => useSpotifyAuth(), {
        wrapper: createWrapper(),
      })

      await act(async () => {
        await result.current.handleCallback(mockUrl)
      })

      expect(mockSpotifyRepository.extractCodeFromUrl).toHaveBeenCalledWith(mockUrl)
    })

    it('should handle callback without code', async () => {
      const mockUrl = 'http://localhost:3000/callback?error=access_denied'

      mockSpotifyRepository.extractCodeFromUrl.mockReturnValue({
        code: null,
        state: null,
      })

      const { result } = renderHook(() => useSpotifyAuth(), {
        wrapper: createWrapper(),
      })

      await act(async () => {
        await result.current.handleCallback(mockUrl)
      })

      expect(mockSpotifyRepository.extractCodeFromUrl).toHaveBeenCalledWith(mockUrl)
      expect(result.current.isAuthenticated).toBe(false)
    })

    it('should handle callback errors', async () => {
      const mockUrl = 'http://localhost:3000/callback?code=invalid'
      const mockError = new Error('Token exchange failed')

      mockSpotifyRepository.extractCodeFromUrl.mockReturnValue({
        code: 'invalid',
        state: '123',
      })

      // Mock the token exchange to throw an error
      // This would be handled by the repository in real implementation

      const { result } = renderHook(() => useSpotifyAuth(), {
        wrapper: createWrapper(),
      })

      await act(async () => {
        await result.current.handleCallback(mockUrl)
      })

      expect(mockSpotifyRepository.extractCodeFromUrl).toHaveBeenCalledWith(mockUrl)
      expect(result.current.isAuthenticated).toBe(false)
    })
  })

  describe('localStorage synchronization', () => {
    it('should listen for localStorage changes', () => {
      const { result } = renderHook(() => useSpotifyAuth(), {
        wrapper: createWrapper(),
      })

      // Simulate localStorage change from another tab
      act(() => {
        const storageEvent = new StorageEvent('storage', {
          key: 'spotify_token',
          newValue: 'new-token-from-other-tab',
          oldValue: null,
          storageArea: localStorage,
        })
        window.dispatchEvent(storageEvent)
      })

      expect(result.current.isAuthenticated).toBe(true)
      expect(mockSpotifyRepository.setAccessToken).toHaveBeenCalledWith('new-token-from-other-tab')
    })

    it('should ignore localStorage changes for other keys', () => {
      const { result } = renderHook(() => useSpotifyAuth(), {
        wrapper: createWrapper(),
      })

      // Simulate localStorage change for different key
      act(() => {
        const storageEvent = new StorageEvent('storage', {
          key: 'other_key',
          newValue: 'some-value',
          oldValue: null,
          storageArea: localStorage,
        })
        window.dispatchEvent(storageEvent)
      })

      expect(result.current.isAuthenticated).toBe(false)
      expect(mockSpotifyRepository.setAccessToken).not.toHaveBeenCalled()
    })
  })
}) 