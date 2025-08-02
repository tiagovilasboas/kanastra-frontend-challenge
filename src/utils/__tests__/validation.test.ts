import { describe, expect, it } from 'vitest'

import { validateEmail, validateMaxLength, validateMinLength, validateRequired, validateSpotifyUrl,validateUrl } from '../validation'

describe('validation utilities', () => {
  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name@domain.co.uk')).toBe(true)
      expect(validateEmail('user+tag@example.org')).toBe(true)
      expect(validateEmail('123@numbers.com')).toBe(true)
      expect(validateEmail('user@subdomain.example.com')).toBe(true)
    })

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false)
      expect(validateEmail('test@')).toBe(false)
      expect(validateEmail('@example.com')).toBe(false)
      expect(validateEmail('test@.com')).toBe(false)
      expect(validateEmail('test..test@example.com')).toBe(false)
      expect(validateEmail('test@example..com')).toBe(false)
      expect(validateEmail('')).toBe(false)
      expect(validateEmail(' ')).toBe(false)
    })

    it('should handle edge cases', () => {
      expect(validateEmail('test@example')).toBe(false)
      expect(validateEmail('test@example.c')).toBe(false)
      expect(validateEmail('test@example.com.')).toBe(false)
      expect(validateEmail('.test@example.com')).toBe(false)
    })

    it('should handle special characters', () => {
      expect(validateEmail('test+filter@example.com')).toBe(true)
      expect(validateEmail('test.filter@example.com')).toBe(true)
      expect(validateEmail('test_filter@example.com')).toBe(true)
      expect(validateEmail('test-filter@example.com')).toBe(true)
    })
  })

  describe('validateRequired', () => {
    it('should validate non-empty values', () => {
      expect(validateRequired('test')).toBe(true)
      expect(validateRequired('0')).toBe(true)
      expect(validateRequired('false')).toBe(true)
      expect(validateRequired(' ')).toBe(true)
      expect(validateRequired(0)).toBe(true)
      expect(validateRequired(false)).toBe(true)
      expect(validateRequired([])).toBe(true)
      expect(validateRequired({})).toBe(true)
    })

    it('should reject empty values', () => {
      expect(validateRequired('')).toBe(false)
      expect(validateRequired(null)).toBe(false)
      expect(validateRequired(undefined)).toBe(false)
    })

    it('should handle edge cases', () => {
      expect(validateRequired('\n')).toBe(true)
      expect(validateRequired('\t')).toBe(true)
      expect(validateRequired('   ')).toBe(true)
    })
  })

  describe('validateMinLength', () => {
    it('should validate strings with minimum length', () => {
      expect(validateMinLength('test', 3)).toBe(true)
      expect(validateMinLength('test', 4)).toBe(true)
      expect(validateMinLength('test', 2)).toBe(true)
    })

    it('should reject strings below minimum length', () => {
      expect(validateMinLength('test', 5)).toBe(false)
      expect(validateMinLength('test', 10)).toBe(false)
      expect(validateMinLength('', 1)).toBe(false)
    })

    it('should handle edge cases', () => {
      expect(validateMinLength('', 0)).toBe(true)
      expect(validateMinLength('test', 0)).toBe(true)
      expect(validateMinLength('test', -1)).toBe(true)
    })

    it('should work with arrays', () => {
      expect(validateMinLength([1, 2, 3], 2)).toBe(true)
      expect(validateMinLength([1, 2, 3], 3)).toBe(true)
      expect(validateMinLength([1, 2, 3], 4)).toBe(false)
    })
  })

  describe('validateMaxLength', () => {
    it('should validate strings with maximum length', () => {
      expect(validateMaxLength('test', 5)).toBe(true)
      expect(validateMaxLength('test', 4)).toBe(true)
      expect(validateMaxLength('test', 10)).toBe(true)
    })

    it('should reject strings above maximum length', () => {
      expect(validateMaxLength('test', 3)).toBe(false)
      expect(validateMaxLength('test', 2)).toBe(false)
      expect(validateMaxLength('testing', 5)).toBe(false)
    })

    it('should handle edge cases', () => {
      expect(validateMaxLength('', 0)).toBe(true)
      expect(validateMaxLength('test', 0)).toBe(false)
      expect(validateMaxLength('test', -1)).toBe(false)
    })

    it('should work with arrays', () => {
      expect(validateMaxLength([1, 2, 3], 5)).toBe(true)
      expect(validateMaxLength([1, 2, 3], 3)).toBe(true)
      expect(validateMaxLength([1, 2, 3], 2)).toBe(false)
    })
  })

  describe('validateUrl', () => {
    it('should validate correct URLs', () => {
      expect(validateUrl('https://example.com')).toBe(true)
      expect(validateUrl('http://example.com')).toBe(true)
      expect(validateUrl('https://example.com/path')).toBe(true)
      expect(validateUrl('https://example.com/path?param=value')).toBe(true)
      expect(validateUrl('https://example.com/path#fragment')).toBe(true)
      expect(validateUrl('https://subdomain.example.com')).toBe(true)
      expect(validateUrl('https://example.co.uk')).toBe(true)
    })

    it('should reject invalid URLs', () => {
      expect(validateUrl('not-a-url')).toBe(false)
      expect(validateUrl('example.com')).toBe(false)
      expect(validateUrl('ftp://example.com')).toBe(false)
      expect(validateUrl('https://')).toBe(false)
      expect(validateUrl('')).toBe(false)
      expect(validateUrl(' ')).toBe(false)
    })

    it('should handle edge cases', () => {
      expect(validateUrl('https://example')).toBe(false)
      expect(validateUrl('https://example.')).toBe(false)
      expect(validateUrl('https://.example.com')).toBe(false)
    })

    it('should handle special characters in URLs', () => {
      expect(validateUrl('https://example.com/path with spaces')).toBe(false)
      expect(validateUrl('https://example.com/path%20with%20spaces')).toBe(true)
      expect(validateUrl('https://example.com/path-with-dashes')).toBe(true)
      expect(validateUrl('https://example.com/path_with_underscores')).toBe(true)
    })
  })

  describe('validateSpotifyUrl', () => {
    it('should validate correct Spotify URLs', () => {
      expect(validateSpotifyUrl('https://open.spotify.com/artist/123')).toBe(true)
      expect(validateSpotifyUrl('https://open.spotify.com/track/456')).toBe(true)
      expect(validateSpotifyUrl('https://open.spotify.com/album/789')).toBe(true)
      expect(validateSpotifyUrl('https://open.spotify.com/playlist/abc')).toBe(true)
      expect(validateSpotifyUrl('https://open.spotify.com/artist/123?si=xyz')).toBe(true)
    })

    it('should reject non-Spotify URLs', () => {
      expect(validateSpotifyUrl('https://example.com')).toBe(false)
      expect(validateSpotifyUrl('https://spotify.com/artist/123')).toBe(false)
      expect(validateSpotifyUrl('http://open.spotify.com/artist/123')).toBe(false)
      expect(validateSpotifyUrl('https://open.spotify.com')).toBe(false)
    })

    it('should reject invalid URLs', () => {
      expect(validateSpotifyUrl('not-a-url')).toBe(false)
      expect(validateSpotifyUrl('')).toBe(false)
      expect(validateSpotifyUrl(' ')).toBe(false)
    })

    it('should handle edge cases', () => {
      expect(validateSpotifyUrl('https://open.spotify.com/')).toBe(false)
      expect(validateSpotifyUrl('https://open.spotify.com/artist/')).toBe(false)
      expect(validateSpotifyUrl('https://open.spotify.com/artist')).toBe(false)
    })
  })

  describe('validation composition', () => {
    it('should combine multiple validations', () => {
      const validateEmailField = (value: string) => {
        if (!validateRequired(value)) return 'Email is required'
        if (!validateEmail(value)) return 'Invalid email format'
        if (!validateMaxLength(value, 100)) return 'Email too long'
        return null
      }

      expect(validateEmailField('')).toBe('Email is required')
      expect(validateEmailField('invalid')).toBe('Invalid email format')
      expect(validateEmailField('a'.repeat(101) + '@example.com')).toBe('Email too long')
      expect(validateEmailField('valid@example.com')).toBe(null)
    })

    it('should validate form fields', () => {
      const validateForm = (data: { email: string; password: string; name: string }) => {
        const errors: Record<string, string> = {}

        if (!validateRequired(data.email)) {
          errors.email = 'Email is required'
        } else if (!validateEmail(data.email)) {
          errors.email = 'Invalid email format'
        }

        if (!validateRequired(data.password)) {
          errors.password = 'Password is required'
        } else if (!validateMinLength(data.password, 8)) {
          errors.password = 'Password must be at least 8 characters'
        }

        if (!validateRequired(data.name)) {
          errors.name = 'Name is required'
        } else if (!validateMinLength(data.name, 2)) {
          errors.name = 'Name must be at least 2 characters'
        }

        return errors
      }

      const validData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'John Doe',
      }

      const invalidData = {
        email: 'invalid-email',
        password: '123',
        name: 'J',
      }

      expect(validateForm(validData)).toEqual({})
      expect(validateForm(invalidData)).toEqual({
        email: 'Invalid email format',
        password: 'Password must be at least 8 characters',
        name: 'Name must be at least 2 characters',
      })
    })
  })

  describe('performance', () => {
    it('should handle large strings efficiently', () => {
      const largeString = 'a'.repeat(10000)
      
      const start = performance.now()
      validateMinLength(largeString, 1000)
      validateMaxLength(largeString, 20000)
      const end = performance.now()
      
      expect(end - start).toBeLessThan(10) // Should complete in less than 10ms
    })

    it('should handle multiple validations efficiently', () => {
      const email = 'test@example.com'
      
      const start = performance.now()
      for (let i = 0; i < 1000; i++) {
        validateRequired(email)
        validateEmail(email)
        validateMinLength(email, 5)
        validateMaxLength(email, 100)
      }
      const end = performance.now()
      
      expect(end - start).toBeLessThan(100) // Should complete in less than 100ms
    })
  })

  describe('edge cases and error handling', () => {
    it('should handle null and undefined gracefully', () => {
      expect(validateRequired(null)).toBe(false)
      expect(validateRequired(undefined)).toBe(false)
      expect(validateMinLength(null as any, 5)).toBe(false)
      expect(validateMaxLength(undefined as any, 10)).toBe(false)
      expect(validateEmail(null as any)).toBe(false)
      expect(validateUrl(undefined as any)).toBe(false)
    })

    it('should handle non-string inputs', () => {
      expect(validateMinLength(123 as any, 2)).toBe(false)
      expect(validateMaxLength({} as any, 10)).toBe(false)
      expect(validateEmail(123 as any)).toBe(false)
      expect(validateUrl({} as any)).toBe(false)
    })

    it('should handle special characters in validation', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('test+filter@example.com')).toBe(true)
      expect(validateEmail('test.filter@example.com')).toBe(true)
      expect(validateEmail('test_filter@example.com')).toBe(true)
      expect(validateEmail('test-filter@example.com')).toBe(true)
    })
  })
}) 