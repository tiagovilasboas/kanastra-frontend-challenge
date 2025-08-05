import { beforeEach,describe, expect, it, vi } from 'vitest'

import { useSearchStore } from '../searchStore'

describe('useSearchStore', () => {
  beforeEach(() => {
    // Reset store to initial state
    useSearchStore.setState({ searchQuery: '' })
  })

  describe('initial state', () => {
    it('should have empty search query by default', () => {
      const { searchQuery } = useSearchStore.getState()
      expect(searchQuery).toBe('')
    })
  })

  describe('setSearchQuery', () => {
    it('should set search query to a simple string', () => {
      const { setSearchQuery } = useSearchStore.getState()
      
      setSearchQuery('test query')
      
      const { searchQuery } = useSearchStore.getState()
      expect(searchQuery).toBe('test query')
    })

    it('should set search query to empty string', () => {
      const { setSearchQuery } = useSearchStore.getState()
      
      setSearchQuery('')
      
      const { searchQuery } = useSearchStore.getState()
      expect(searchQuery).toBe('')
    })

    it('should set search query with special characters', () => {
      const { setSearchQuery } = useSearchStore.getState()
      
      setSearchQuery('test query with special chars: !@#$%^&*()')
      
      const { searchQuery } = useSearchStore.getState()
      expect(searchQuery).toBe('test query with special chars: !@#$%^&*()')
    })

    it('should set search query with numbers', () => {
      const { setSearchQuery } = useSearchStore.getState()
      
      setSearchQuery('artist 123')
      
      const { searchQuery } = useSearchStore.getState()
      expect(searchQuery).toBe('artist 123')
    })

    it('should set search query with unicode characters', () => {
      const { setSearchQuery } = useSearchStore.getState()
      
      setSearchQuery('artista com acentos: áéíóú')
      
      const { searchQuery } = useSearchStore.getState()
      expect(searchQuery).toBe('artista com acentos: áéíóú')
    })

    it('should overwrite previous search query', () => {
      const { setSearchQuery } = useSearchStore.getState()
      
      setSearchQuery('first query')
      setSearchQuery('second query')
      
      const { searchQuery } = useSearchStore.getState()
      expect(searchQuery).toBe('second query')
    })
  })

  describe('clearSearch', () => {
    it('should clear search query to empty string', () => {
      const { setSearchQuery, clearSearch } = useSearchStore.getState()
      
      setSearchQuery('test query')
      clearSearch()
      
      const { searchQuery } = useSearchStore.getState()
      expect(searchQuery).toBe('')
    })

    it('should clear search query when already empty', () => {
      const { clearSearch } = useSearchStore.getState()
      
      clearSearch()
      
      const { searchQuery } = useSearchStore.getState()
      expect(searchQuery).toBe('')
    })

    it('should clear search query with special characters', () => {
      const { setSearchQuery, clearSearch } = useSearchStore.getState()
      
      setSearchQuery('complex query with !@#$%^&*() and numbers 123')
      clearSearch()
      
      const { searchQuery } = useSearchStore.getState()
      expect(searchQuery).toBe('')
    })
  })

  describe('state updates', () => {
    it('should maintain state between operations', () => {
      const { setSearchQuery, clearSearch } = useSearchStore.getState()
      
      setSearchQuery('first query')
      expect(useSearchStore.getState().searchQuery).toBe('first query')
      
      setSearchQuery('second query')
      expect(useSearchStore.getState().searchQuery).toBe('second query')
      
      clearSearch()
      expect(useSearchStore.getState().searchQuery).toBe('')
      
      setSearchQuery('final query')
      expect(useSearchStore.getState().searchQuery).toBe('final query')
    })

    it('should handle multiple rapid state changes', () => {
      const { setSearchQuery } = useSearchStore.getState()
      
      setSearchQuery('query 1')
      setSearchQuery('query 2')
      setSearchQuery('query 3')
      setSearchQuery('query 4')
      
      expect(useSearchStore.getState().searchQuery).toBe('query 4')
    })

    it('should handle clear and set operations in sequence', () => {
      const { setSearchQuery, clearSearch } = useSearchStore.getState()
      
      setSearchQuery('initial query')
      clearSearch()
      setSearchQuery('new query')
      clearSearch()
      setSearchQuery('final query')
      
      expect(useSearchStore.getState().searchQuery).toBe('final query')
    })
  })

  describe('edge cases', () => {
    it('should handle very long search queries', () => {
      const { setSearchQuery } = useSearchStore.getState()
      
      const longQuery = 'a'.repeat(1000)
      setSearchQuery(longQuery)
      
      const { searchQuery } = useSearchStore.getState()
      expect(searchQuery).toBe(longQuery)
    })

    it('should handle search query with only whitespace', () => {
      const { setSearchQuery } = useSearchStore.getState()
      
      setSearchQuery('   ')
      
      const { searchQuery } = useSearchStore.getState()
      expect(searchQuery).toBe('   ')
    })

    it('should handle search query with newlines', () => {
      const { setSearchQuery } = useSearchStore.getState()
      
      setSearchQuery('line 1\nline 2\nline 3')
      
      const { searchQuery } = useSearchStore.getState()
      expect(searchQuery).toBe('line 1\nline 2\nline 3')
    })

    it('should handle search query with tabs', () => {
      const { setSearchQuery } = useSearchStore.getState()
      
      setSearchQuery('tab\tseparated\tvalues')
      
      const { searchQuery } = useSearchStore.getState()
      expect(searchQuery).toBe('tab\tseparated\tvalues')
    })
  })
}) 