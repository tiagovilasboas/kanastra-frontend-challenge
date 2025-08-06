import { describe, expect, it } from 'vitest'

import { SearchQueryBuilder } from '../SearchService'

describe('SearchQueryBuilder', () => {
  describe('buildAdvancedQuery', () => {
    it('should build query with genre filter', () => {
      const result = SearchQueryBuilder.buildAdvancedQuery('rock', {
        genres: ['alternative', 'indie'],
      })
      expect(result).toBe('rock genre:alternative genre:indie')
    })

    it('should build query with year range filter', () => {
      const result = SearchQueryBuilder.buildAdvancedQuery('album', {
        yearFrom: 2020,
        yearTo: 2023,
      })
      expect(result).toBe('album year:2020-2023')
    })

    it('should build query with single year filter', () => {
      const result = SearchQueryBuilder.buildAdvancedQuery('album', {
        yearFrom: 2020,
      })
      expect(result).toBe('album year:2020')
    })

    it('should build query with year to filter', () => {
      const result = SearchQueryBuilder.buildAdvancedQuery('album', {
        yearTo: 2023,
      })
      expect(result).toBe('album year:2023')
    })

    it('should build query with genre and year filters', () => {
      const result = SearchQueryBuilder.buildAdvancedQuery('rock', {
        genres: ['alternative'],
        yearFrom: 2020,
        yearTo: 2023,
      })
      expect(result).toBe('rock genre:alternative year:2020-2023')
    })

    it('should not include popularity filter', () => {
      const result = SearchQueryBuilder.buildAdvancedQuery('rock', {
        genres: ['alternative'],
        yearFrom: 2020,
        yearTo: 2023,
      })
      expect(result).not.toContain('popularity:')
    })

    it('should trim whitespace from base query', () => {
      const result = SearchQueryBuilder.buildAdvancedQuery('  rock  ', {
        genres: ['alternative'],
      })
      expect(result).toBe('rock genre:alternative')
    })

    it('should return trimmed result', () => {
      const result = SearchQueryBuilder.buildAdvancedQuery('rock', {
        genres: ['alternative'],
        yearFrom: 2020,
      })
      expect(result).toBe('rock genre:alternative year:2020')
      expect(result).not.toMatch(/^\s+|\s+$/) // No leading/trailing whitespace
    })

    it('should handle empty filters', () => {
      const result = SearchQueryBuilder.buildAdvancedQuery('rock', {})
      expect(result).toBe('rock')
    })

    it('should handle empty genre array', () => {
      const result = SearchQueryBuilder.buildAdvancedQuery('rock', {
        genres: [],
      })
      expect(result).toBe('rock')
    })
  })

  describe('validateQuery', () => {
    it('should validate empty query', () => {
      const result = SearchQueryBuilder.validateQuery('')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Query não pode estar vazia')
    })

    it('should validate whitespace-only query', () => {
      const result = SearchQueryBuilder.validateQuery('   ')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Query não pode estar vazia')
    })

    it('should validate short query', () => {
      const result = SearchQueryBuilder.validateQuery('a')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Query deve ter pelo menos 2 caracteres')
    })

    it('should validate long query', () => {
      const longQuery = 'a'.repeat(101)
      const result = SearchQueryBuilder.validateQuery(longQuery)
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Query muito longa')
    })

    it('should validate valid query', () => {
      const result = SearchQueryBuilder.validateQuery('rock')
      expect(result.isValid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should validate query with filters', () => {
      const result = SearchQueryBuilder.validateQuery(
        'rock genre:alternative year:2020',
      )
      expect(result.isValid).toBe(true)
      expect(result.error).toBeUndefined()
    })
  })
})
