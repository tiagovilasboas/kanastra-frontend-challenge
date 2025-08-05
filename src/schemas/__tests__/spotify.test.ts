import { validateSpotifyTokenResponse } from '../spotify'

describe('Spotify Schemas', () => {
  describe('validateSpotifyTokenResponse', () => {
    it('should validate correct token response', () => {
      const validTokenResponse = {
        access_token: 'BQ...',
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: 'AQ...',
        scope: 'user-read-private user-read-email',
      }

      const result = validateSpotifyTokenResponse(validTokenResponse)

      expect(result).toEqual(validTokenResponse)
    })

    it('should validate token response without refresh_token', () => {
      const validTokenResponse = {
        access_token: 'BQ...',
        token_type: 'Bearer',
        expires_in: 3600,
        scope: 'user-read-private',
      }

      const result = validateSpotifyTokenResponse(validTokenResponse)

      expect(result).toEqual(validTokenResponse)
    })

    it('should validate client credentials token response', () => {
      const validTokenResponse = {
        access_token: 'BQ...',
        token_type: 'Bearer',
        expires_in: 3600,
      }

      const result = validateSpotifyTokenResponse(validTokenResponse)

      expect(result).toEqual(validTokenResponse)
    })

    it('should throw error for missing access_token', () => {
      const invalidTokenResponse = {
        token_type: 'Bearer',
        expires_in: 3600,
      }

      expect(() => validateSpotifyTokenResponse(invalidTokenResponse)).toThrow()
    })

    it('should throw error for missing token_type', () => {
      const invalidTokenResponse = {
        access_token: 'BQ...',
        expires_in: 3600,
      }

      expect(() => validateSpotifyTokenResponse(invalidTokenResponse)).toThrow()
    })

    it('should throw error for missing expires_in', () => {
      const invalidTokenResponse = {
        access_token: 'BQ...',
        token_type: 'Bearer',
      }

      expect(() => validateSpotifyTokenResponse(invalidTokenResponse)).toThrow()
    })

    it('should throw error for invalid access_token type', () => {
      const invalidTokenResponse = {
        access_token: 123,
        token_type: 'Bearer',
        expires_in: 3600,
      }

      expect(() => validateSpotifyTokenResponse(invalidTokenResponse)).toThrow()
    })

    it('should throw error for invalid token_type', () => {
      const invalidTokenResponse = {
        access_token: 'BQ...',
        token_type: 'Invalid',
        expires_in: 3600,
      }

      expect(() => validateSpotifyTokenResponse(invalidTokenResponse)).toThrow()
    })

    it('should throw error for invalid expires_in type', () => {
      const invalidTokenResponse = {
        access_token: 'BQ...',
        token_type: 'Bearer',
        expires_in: '3600',
      }

      expect(() => validateSpotifyTokenResponse(invalidTokenResponse)).toThrow()
    })

    it('should accept negative expires_in (Zod allows it)', () => {
      const tokenResponse = {
        access_token: 'BQ...',
        token_type: 'Bearer',
        expires_in: -3600,
      }

      const result = validateSpotifyTokenResponse(tokenResponse)
      expect(result.expires_in).toBe(-3600)
    })

    it('should throw error for invalid refresh_token type', () => {
      const invalidTokenResponse = {
        access_token: 'BQ...',
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: 123,
      }

      expect(() => validateSpotifyTokenResponse(invalidTokenResponse)).toThrow()
    })

    it('should throw error for invalid scope type', () => {
      const invalidTokenResponse = {
        access_token: 'BQ...',
        token_type: 'Bearer',
        expires_in: 3600,
        scope: 123,
      }

      expect(() => validateSpotifyTokenResponse(invalidTokenResponse)).toThrow()
    })

    it('should throw error for null values', () => {
      const invalidTokenResponse = {
        access_token: null,
        token_type: 'Bearer',
        expires_in: 3600,
      }

      expect(() => validateSpotifyTokenResponse(invalidTokenResponse)).toThrow()
    })

    it('should throw error for undefined values', () => {
      const invalidTokenResponse = {
        access_token: undefined,
        token_type: 'Bearer',
        expires_in: 3600,
      }

      expect(() => validateSpotifyTokenResponse(invalidTokenResponse)).toThrow()
    })

    it('should accept empty string access_token (Zod allows it)', () => {
      const tokenResponse = {
        access_token: '',
        token_type: 'Bearer',
        expires_in: 3600,
      }

      const result = validateSpotifyTokenResponse(tokenResponse)
      expect(result.access_token).toBe('')
    })

    it('should handle additional properties gracefully', () => {
      const validTokenResponse = {
        access_token: 'BQ...',
        token_type: 'Bearer',
        expires_in: 3600,
        extra_property: 'should be ignored',
      }

      const result = validateSpotifyTokenResponse(validTokenResponse)

      expect(result.access_token).toBe('BQ...')
      expect(result.token_type).toBe('Bearer')
      expect(result.expires_in).toBe(3600)
      // Extra property should be stripped
      expect((result as any).extra_property).toBeUndefined()
    })

    it('should handle edge case with zero expires_in', () => {
      const validTokenResponse = {
        access_token: 'BQ...',
        token_type: 'Bearer',
        expires_in: 0,
      }

      const result = validateSpotifyTokenResponse(validTokenResponse)

      expect(result.expires_in).toBe(0)
    })

    it('should handle very large expires_in values', () => {
      const validTokenResponse = {
        access_token: 'BQ...',
        token_type: 'Bearer',
        expires_in: 999999999,
      }

      const result = validateSpotifyTokenResponse(validTokenResponse)

      expect(result.expires_in).toBe(999999999)
    })
  })
}) 