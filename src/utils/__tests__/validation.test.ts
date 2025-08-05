import { SpotifyArtist } from '@/types/spotify'

import {
  validateArtist,
  validateEmail,
  validateMaxLength,
  validateMinLength,
  validatePaginationParams,
  validateRequired,
  validateSearchQuery,
  validateSpotifyUrl,
  validateUrl,
} from '../validation'

describe('validation', () => {
  describe('validateArtist', () => {
    const validArtist: SpotifyArtist = {
      id: 'artist-123',
      name: 'Test Artist',
      images: [
        { url: 'https://example.com/image.jpg', width: 300, height: 300 },
      ],
      popularity: 85,
      followers: { total: 1000000 },
      genres: ['pop', 'rock'],
      external_urls: { spotify: 'https://open.spotify.com/artist/123' },
      href: 'https://api.spotify.com/v1/artists/123',
      type: 'artist',
      uri: 'spotify:artist:123',
    }

    it('should validate a correct artist object', () => {
      expect(validateArtist(validArtist)).toBe(true)
    })

    it('should reject null or undefined', () => {
      expect(validateArtist(null)).toBe(false)
      expect(validateArtist(undefined)).toBe(false)
    })

    it('should reject non-object values', () => {
      expect(validateArtist('string')).toBe(false)
      expect(validateArtist(123)).toBe(false)
      expect(validateArtist(true)).toBe(false)
      expect(validateArtist([])).toBe(false)
    })

    it('should reject artist without required fields', () => {
      const invalidArtist = { ...validArtist }
      delete (invalidArtist as any).id
      expect(validateArtist(invalidArtist)).toBe(false)

      const invalidArtist2 = { ...validArtist }
      delete (invalidArtist2 as any).name
      expect(validateArtist(invalidArtist2)).toBe(false)
    })

    it('should reject artist with wrong field types', () => {
      const invalidArtist = { ...validArtist, id: 123 }
      expect(validateArtist(invalidArtist)).toBe(false)

      const invalidArtist2 = { ...validArtist, popularity: 'high' }
      expect(validateArtist(invalidArtist2)).toBe(false)
    })

    it('should reject artist with invalid followers structure', () => {
      const invalidArtist = { ...validArtist, followers: 'many' }
      expect(validateArtist(invalidArtist)).toBe(false)

      const invalidArtist2 = { ...validArtist, followers: { total: 'many' } }
      expect(validateArtist(invalidArtist2)).toBe(false)
    })

    it('should reject artist with non-array genres', () => {
      const invalidArtist = { ...validArtist, genres: 'pop,rock' }
      expect(validateArtist(invalidArtist)).toBe(false)
    })
  })

  describe('validateSearchQuery', () => {
    it('should validate non-empty strings', () => {
      expect(validateSearchQuery('valid query')).toBe(true)
      expect(validateSearchQuery('a')).toBe(true)
      expect(validateSearchQuery('query with spaces')).toBe(true)
    })

    it('should reject empty or whitespace-only strings', () => {
      expect(validateSearchQuery('')).toBe(false)
      expect(validateSearchQuery('   ')).toBe(false)
      expect(validateSearchQuery('\t\n')).toBe(false)
    })

    it('should reject non-string values', () => {
      expect(validateSearchQuery(null)).toBe(false)
      expect(validateSearchQuery(undefined)).toBe(false)
      expect(validateSearchQuery(123)).toBe(false)
      expect(validateSearchQuery({})).toBe(false)
      expect(validateSearchQuery([])).toBe(false)
    })
  })

  describe('validatePaginationParams', () => {
    it('should validate correct pagination parameters', () => {
      expect(validatePaginationParams({ page: 1, limit: 10 })).toBe(true)
      expect(validatePaginationParams({ page: 5, limit: 50 })).toBe(true)
    })

    it('should reject null or undefined', () => {
      expect(validatePaginationParams(null)).toBe(false)
      expect(validatePaginationParams(undefined)).toBe(false)
    })

    it('should reject non-object values', () => {
      expect(validatePaginationParams('string')).toBe(false)
      expect(validatePaginationParams(123)).toBe(false)
      expect(validatePaginationParams([])).toBe(false)
    })

    it('should reject missing required fields', () => {
      expect(validatePaginationParams({ page: 1 })).toBe(false)
      expect(validatePaginationParams({ limit: 10 })).toBe(false)
      expect(validatePaginationParams({})).toBe(false)
    })

    it('should reject non-numeric values', () => {
      expect(validatePaginationParams({ page: '1', limit: 10 })).toBe(false)
      expect(validatePaginationParams({ page: 1, limit: '10' })).toBe(false)
    })

    it('should reject zero or negative values', () => {
      expect(validatePaginationParams({ page: 0, limit: 10 })).toBe(false)
      expect(validatePaginationParams({ page: 1, limit: 0 })).toBe(false)
      expect(validatePaginationParams({ page: -1, limit: 10 })).toBe(false)
      expect(validatePaginationParams({ page: 1, limit: -5 })).toBe(false)
    })
  })

  describe('validateEmail', () => {
    it('should validate correct email formats', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name@domain.co.uk')).toBe(true)
      expect(validateEmail('user+tag@example.org')).toBe(true)
      expect(validateEmail('123@numbers.com')).toBe(true)
    })

    it('should reject invalid email formats', () => {
      expect(validateEmail('invalid-email')).toBe(false)
      expect(validateEmail('@example.com')).toBe(false)
      expect(validateEmail('user@')).toBe(false)
      expect(validateEmail('user@.com')).toBe(false)
      expect(validateEmail('user..name@example.com')).toBe(false)
      expect(validateEmail('.user@example.com')).toBe(false)
      expect(validateEmail('user@example.com.')).toBe(false)
      expect(validateEmail('user@example')).toBe(false)
    })

    it('should reject non-string values', () => {
      expect(validateEmail(null)).toBe(false)
      expect(validateEmail(undefined)).toBe(false)
      expect(validateEmail(123)).toBe(false)
      expect(validateEmail({})).toBe(false)
    })
  })

  describe('validateRequired', () => {
    it('should validate truthy values', () => {
      expect(validateRequired('string')).toBe(true)
      expect(validateRequired(123)).toBe(true)
      expect(validateRequired(true)).toBe(true)
      expect(validateRequired(false)).toBe(true)
      expect(validateRequired({ key: 'value' })).toBe(true)
      expect(validateRequired([1, 2, 3])).toBe(true)
    })

    it('should reject null and undefined', () => {
      expect(validateRequired(null)).toBe(false)
      expect(validateRequired(undefined)).toBe(false)
    })

    it('should reject empty strings', () => {
      expect(validateRequired('')).toBe(false)
      expect(validateRequired('   ')).toBe(false)
    })

    it('should reject empty arrays', () => {
      expect(validateRequired([])).toBe(false)
    })

    it('should reject empty objects', () => {
      expect(validateRequired({})).toBe(false)
    })
  })

  describe('validateMinLength', () => {
    it('should validate strings with sufficient length', () => {
      expect(validateMinLength('hello', 3)).toBe(true)
      expect(validateMinLength('test', 4)).toBe(true)
      expect(validateMinLength('a', 1)).toBe(true)
    })

    it('should validate arrays with sufficient length', () => {
      expect(validateMinLength([1, 2, 3], 2)).toBe(true)
      expect(validateMinLength(['a', 'b'], 2)).toBe(true)
    })

    it('should reject strings that are too short', () => {
      expect(validateMinLength('hi', 3)).toBe(false)
      expect(validateMinLength('', 1)).toBe(false)
    })

    it('should reject arrays that are too short', () => {
      expect(validateMinLength([1], 2)).toBe(false)
      expect(validateMinLength([], 1)).toBe(false)
    })

    it('should reject non-string and non-array values', () => {
      expect(validateMinLength(123, 2)).toBe(false)
      expect(validateMinLength({}, 2)).toBe(false)
      expect(validateMinLength(null, 2)).toBe(false)
    })
  })

  describe('validateMaxLength', () => {
    it('should validate strings within length limit', () => {
      expect(validateMaxLength('hello', 10)).toBe(true)
      expect(validateMaxLength('test', 4)).toBe(true)
      expect(validateMaxLength('', 5)).toBe(true)
    })

    it('should validate arrays within length limit', () => {
      expect(validateMaxLength([1, 2, 3], 5)).toBe(true)
      expect(validateMaxLength(['a', 'b'], 2)).toBe(true)
      expect(validateMaxLength([], 3)).toBe(true)
    })

    it('should reject strings that are too long', () => {
      expect(validateMaxLength('hello world', 5)).toBe(false)
      expect(validateMaxLength('test', 3)).toBe(false)
    })

    it('should reject arrays that are too long', () => {
      expect(validateMaxLength([1, 2, 3, 4], 3)).toBe(false)
      expect(validateMaxLength(['a', 'b', 'c'], 2)).toBe(false)
    })

    it('should reject non-string and non-array values', () => {
      expect(validateMaxLength(123, 2)).toBe(false)
      expect(validateMaxLength({}, 2)).toBe(false)
      expect(validateMaxLength(null, 2)).toBe(false)
    })
  })

  describe('validateUrl', () => {
    it('should validate correct URLs', () => {
      expect(validateUrl('https://example.com')).toBe(true)
      expect(validateUrl('http://example.org')).toBe(true)
      expect(validateUrl('https://sub.domain.co.uk/path')).toBe(true)
      expect(validateUrl('https://example.com:8080')).toBe(true)
      expect(validateUrl('https://example.com?param=value')).toBe(true)
    })

    it('should reject invalid URLs', () => {
      expect(validateUrl('not-a-url')).toBe(false)
      expect(validateUrl('ftp://example.com')).toBe(false)
      expect(validateUrl('https://')).toBe(false)
      expect(validateUrl('https://.com')).toBe(false)
      expect(validateUrl('https://example.')).toBe(false)
      expect(validateUrl('https:// example.com')).toBe(false)
    })

    it('should reject non-string values', () => {
      expect(validateUrl(null)).toBe(false)
      expect(validateUrl(123)).toBe(false)
      expect(validateUrl({})).toBe(false)
    })
  })

  describe('validateSpotifyUrl', () => {
    it('should validate correct Spotify URLs', () => {
      expect(validateSpotifyUrl('https://open.spotify.com/artist/123')).toBe(true)
      expect(validateSpotifyUrl('https://open.spotify.com/track/456')).toBe(true)
      expect(validateSpotifyUrl('https://open.spotify.com/album/789')).toBe(true)
      expect(validateSpotifyUrl('https://open.spotify.com/playlist/abc')).toBe(true)
    })

    it('should reject non-Spotify URLs', () => {
      expect(validateSpotifyUrl('https://example.com/artist/123')).toBe(false)
      expect(validateSpotifyUrl('http://open.spotify.com/artist/123')).toBe(false)
    })

    it('should reject invalid Spotify URLs', () => {
      expect(validateSpotifyUrl('https://open.spotify.com/')).toBe(false)
      expect(validateSpotifyUrl('https://open.spotify.com/artist/')).toBe(false)
      expect(validateSpotifyUrl('https://open.spotify.com/invalid/123')).toBe(false)
    })

    it('should reject non-string values', () => {
      expect(validateSpotifyUrl(null)).toBe(false)
      expect(validateSpotifyUrl(123)).toBe(false)
      expect(validateSpotifyUrl({})).toBe(false)
    })
  })
}) 