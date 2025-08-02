import axios from 'axios'
import { afterEach,beforeEach, describe, expect, it, vi } from 'vitest'

import { getSpotifyConfig } from '@/config/environment'
import { errorHandler } from '@/utils/errorHandler'

import { SpotifyRepository } from '../spotify/SpotifyRepository'

// Mock dependencies
vi.mock('@/config/environment', () => ({
  getSpotifyConfig: vi.fn(),
}))

vi.mock('@/utils/errorHandler', () => ({
  errorHandler: {
    handleAuthError: vi.fn(),
    handleApiError: vi.fn(),
  },
}))

vi.mock('@/utils/logger', () => ({
  logger: {
    debug: vi.fn(),
    error: vi.fn(),
  },
}))

vi.mock('@/utils/cookies', () => ({
  CookieManager: {
    clearCodeVerifier: vi.fn(),
  },
}))

vi.mock('axios')

const mockGetSpotifyConfig = vi.mocked(getSpotifyConfig)
const mockErrorHandler = vi.mocked(errorHandler)
const mockAxios = vi.mocked(axios)

describe('SpotifyRepository', () => {
  let repository: SpotifyRepository

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()

    mockGetSpotifyConfig.mockReturnValue({
      clientId: 'test-client-id',
      clientSecret: 'test-client-secret',
      redirectUri: 'http://localhost:3000/callback',
      baseUrl: 'https://api.spotify.com/v1',
      scopes: ['user-read-private', 'user-read-email'],
    })

    repository = new SpotifyRepository()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('constructor', () => {
    it('should initialize with correct configuration', () => {
      expect(mockGetSpotifyConfig).toHaveBeenCalled()
      expect(repository).toBeInstanceOf(SpotifyRepository)
    })
  })

  describe('getAuthUrl', () => {
    it('should generate auth URL successfully', async () => {
      const mockAuthUrl = 'https://accounts.spotify.com/authorize?client_id=test'
      
      // Mock the auth service method
      const mockAuthService = {
        generateAuthUrl: vi.fn().mockResolvedValue(mockAuthUrl),
      }
      
      // Mock the private property
      Object.defineProperty(repository, 'authService', {
        value: mockAuthService,
        writable: true,
      })

      const result = await repository.getAuthUrl()

      expect(result).toBe(mockAuthUrl)
    })

    it('should handle auth URL generation errors', async () => {
      const mockError = new Error('Auth URL generation failed')
      
      const mockAuthService = {
        generateAuthUrl: vi.fn().mockRejectedValue(mockError),
      }
      
      // Mock the private property
      Object.defineProperty(repository, 'authService', {
        value: mockAuthService,
        writable: true,
      })

      mockErrorHandler.handleAuthError.mockReturnValue({
        code: 'AUTH_ERROR',
        message: 'Auth URL generation failed',
        timestamp: new Date(),
      })

      await expect(repository.getAuthUrl()).rejects.toThrow('Auth URL generation failed')
      expect(mockErrorHandler.handleAuthError).toHaveBeenCalledWith(mockError, 'SpotifyRepository.getAuthUrl')
    })
  })

  describe('exchangeCodeForToken', () => {
    it('should exchange code for token successfully', async () => {
      const mockCode = 'test-auth-code'
      const mockToken = 'test-access-token'
      const mockTokenResponse = {
        access_token: mockToken,
        token_type: 'Bearer',
        expires_in: 3600,
      }

      vi.spyOn(repository as any, 'authService', 'get').mockReturnValue({
        handleTokenExchange: vi.fn().mockResolvedValue(mockTokenResponse),
      })

      const result = await repository.exchangeCodeForToken(mockCode)

      expect(result).toBe(mockToken)
      expect(repository.getAccessToken()).toBe(mockToken)
      expect(localStorage.getItem('spotify_token')).toBe(mockToken)
    })

    it('should handle token exchange errors', async () => {
      const mockCode = 'invalid-code'
      const mockError = new Error('Token exchange failed')

      vi.spyOn(repository as any, 'authService', 'get').mockReturnValue({
        handleTokenExchange: vi.fn().mockRejectedValue(mockError),
      })

      mockErrorHandler.handleAuthError.mockReturnValue({
        code: 'AUTH_ERROR',
        message: 'Token exchange failed',
        timestamp: new Date(),
      })

      await expect(repository.exchangeCodeForToken(mockCode)).rejects.toThrow('Token exchange failed')
      expect(mockErrorHandler.handleAuthError).toHaveBeenCalledWith(mockError, 'SpotifyRepository.exchangeCodeForToken')
    })
  })

  describe('getClientToken', () => {
    it('should get client token successfully', async () => {
      const mockTokenResponse = {
        access_token: 'client-token',
        token_type: 'Bearer',
        expires_in: 3600,
      }

      mockAxios.post.mockResolvedValue({
        data: mockTokenResponse,
        status: 200,
      })

      const result = await repository.getClientToken()

      expect(result).toBe('client-token')
      expect(mockAxios.post).toHaveBeenCalledWith(
        'https://accounts.spotify.com/api/token',
        expect.any(URLSearchParams),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )
    })

    it('should handle client token errors', async () => {
      const mockError = new Error('Client credentials failed')

      mockAxios.post.mockRejectedValue(mockError)

      mockErrorHandler.handleAuthError.mockReturnValue({
        code: 'AUTH_ERROR',
        message: 'Client credentials failed',
        timestamp: new Date(),
      })

      await expect(repository.getClientToken()).rejects.toThrow('Client credentials failed')
      expect(mockErrorHandler.handleAuthError).toHaveBeenCalledWith(mockError, 'SpotifyRepository.getClientToken')
    })
  })

  describe('searchArtists', () => {
    it('should search artists successfully', async () => {
      const mockQuery = 'drake'
      const mockResponse = {
        artists: {
          items: [
            { id: '1', name: 'Drake', images: [], popularity: 95, followers: { total: 1000000 }, genres: ['hip-hop'] },
          ],
          total: 1,
          limit: 20,
          offset: 0,
          next: null,
          previous: null,
        },
      }

      vi.spyOn(repository as any, 'searchService', 'get').mockReturnValue({
        searchArtists: vi.fn().mockResolvedValue(mockResponse),
      })

      const result = await repository.searchArtists(mockQuery)

      expect(result).toEqual(mockResponse)
    })
  })

  describe('searchArtistsPublic', () => {
    it('should search artists publicly successfully', async () => {
      const mockQuery = 'drake'
      const mockResponse = {
        artists: {
          items: [
            { id: '1', name: 'Drake', images: [], popularity: 95, followers: { total: 1000000 }, genres: ['hip-hop'] },
          ],
          total: 1,
          limit: 20,
          offset: 0,
          next: null,
          previous: null,
        },
      }

      vi.spyOn(repository as any, 'searchService', 'get').mockReturnValue({
        searchArtistsPublic: vi.fn().mockResolvedValue(mockResponse),
      })

      const result = await repository.searchArtistsPublic(mockQuery)

      expect(result).toEqual(mockResponse)
    })
  })

  describe('getArtistDetails', () => {
    it('should get artist details successfully', async () => {
      const mockArtistId = 'artist-123'
      const mockArtist = {
        id: mockArtistId,
        name: 'Drake',
        images: [],
        popularity: 95,
        followers: { total: 1000000 },
        genres: ['hip-hop'],
      }

      vi.spyOn(repository as any, 'searchService', 'get').mockReturnValue({
        getArtistDetails: vi.fn().mockResolvedValue(mockArtist),
      })

      const result = await repository.getArtistDetails(mockArtistId)

      expect(result).toEqual(mockArtist)
    })
  })

  describe('getArtistTopTracks', () => {
    it('should get artist top tracks successfully', async () => {
      const mockArtistId = 'artist-123'
      const mockMarket = 'US'
      const mockResponse = {
        tracks: [
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
        ],
      }

      vi.spyOn(repository as any, 'searchService', 'get').mockReturnValue({
        getArtistTopTracks: vi.fn().mockResolvedValue(mockResponse),
      })

      const result = await repository.getArtistTopTracks(mockArtistId, mockMarket)

      expect(result).toEqual(mockResponse)
    })
  })

  describe('getArtistAlbums', () => {
    it('should get artist albums successfully', async () => {
      const mockArtistId = 'artist-123'
      const mockIncludeGroups = ['album', 'single']
      const mockLimit = 20
      const mockOffset = 0
      const mockResponse = [
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

      vi.spyOn(repository as any, 'searchService', 'get').mockReturnValue({
        getArtistAlbums: vi.fn().mockResolvedValue(mockResponse),
      })

      const result = await repository.getArtistAlbums(mockArtistId, mockIncludeGroups, mockLimit, mockOffset)

      expect(result).toEqual(mockResponse)
    })
  })

  describe('logout', () => {
    it('should clear all authentication data', () => {
      // Setup authenticated state
      repository.setAccessToken('test-token')
      localStorage.setItem('spotify_token', 'test-token')

      // Mock window.location
      const mockLocation = { href: 'http://localhost:3000' }
      Object.defineProperty(window, 'location', {
        value: mockLocation,
        writable: true,
      })

      repository.logout()

      expect(repository.getAccessToken()).toBeUndefined()
      expect(localStorage.getItem('spotify_token')).toBeNull()
      expect(mockLocation.href).toBe('http://localhost:3000/')
    })
  })

  describe('token management', () => {
    it('should set and get access token', () => {
      const mockToken = 'test-access-token'

      repository.setAccessToken(mockToken)

      expect(repository.getAccessToken()).toBe(mockToken)
      expect(localStorage.getItem('spotify_token')).toBe(mockToken)
    })

    it('should extract code from URL', () => {
      const mockUrl = 'http://localhost:3000/callback?code=test-code&state=test-state'
      const mockResult = { code: 'test-code', state: 'test-state' }

      vi.spyOn(repository as any, 'authService', 'get').mockReturnValue({
        extractCodeFromUrl: vi.fn().mockReturnValue(mockResult),
      })

      const result = repository.extractCodeFromUrl(mockUrl)

      expect(result).toEqual(mockResult)
    })
  })

  describe('axios interceptors', () => {
    it('should setup axios interceptors', () => {
      const mockAxiosInstance = {
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      }

      vi.spyOn(axios, 'create').mockReturnValue(mockAxiosInstance as any)

      // Create new instance to trigger interceptor setup
      new SpotifyRepository()

      expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled()
      expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled()
    })
  })
}) 