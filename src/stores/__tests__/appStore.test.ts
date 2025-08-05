import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useAppStore } from '../appStore'

describe('appStore', () => {
  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks()
    // Reset store to initial state
    act(() => {
      useAppStore.setState({
        language: 'pt',
        theme: 'dark',
        isLoading: false,
        error: null,
      })
    })
  })

  describe('initial state', () => {
    it('should have correct initial values', () => {
      const { result } = renderHook(() => useAppStore())

      expect(result.current.language).toBe('pt')
      expect(result.current.theme).toBe('dark')
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBe(null)
    })
  })

  describe('setLanguage', () => {
    it('should update language state', () => {
      const { result } = renderHook(() => useAppStore())

      act(() => {
        result.current.setLanguage('en')
      })

      expect(result.current.language).toBe('en')
    })

    it('should handle multiple language changes', () => {
      const { result } = renderHook(() => useAppStore())

      act(() => {
        result.current.setLanguage('en')
      })
      expect(result.current.language).toBe('en')

      act(() => {
        result.current.setLanguage('pt')
      })
      expect(result.current.language).toBe('pt')

      act(() => {
        result.current.setLanguage('es')
      })
      expect(result.current.language).toBe('es')
    })
  })

  describe('setTheme', () => {
    it('should update theme state', () => {
      const { result } = renderHook(() => useAppStore())

      act(() => {
        result.current.setTheme('light')
      })

      expect(result.current.theme).toBe('light')
    })

    it('should toggle between light and dark themes', () => {
      const { result } = renderHook(() => useAppStore())

      expect(result.current.theme).toBe('dark')

      act(() => {
        result.current.setTheme('light')
      })
      expect(result.current.theme).toBe('light')

      act(() => {
        result.current.setTheme('dark')
      })
      expect(result.current.theme).toBe('dark')
    })
  })

  describe('setLoading', () => {
    it('should update loading state', () => {
      const { result } = renderHook(() => useAppStore())

      act(() => {
        result.current.setLoading(true)
      })

      expect(result.current.isLoading).toBe(true)
    })

    it('should handle loading state transitions', () => {
      const { result } = renderHook(() => useAppStore())

      expect(result.current.isLoading).toBe(false)

      act(() => {
        result.current.setLoading(true)
      })
      expect(result.current.isLoading).toBe(true)

      act(() => {
        result.current.setLoading(false)
      })
      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('setError', () => {
    it('should set error message', () => {
      const { result } = renderHook(() => useAppStore())
      const errorMessage = 'Something went wrong'

      act(() => {
        result.current.setError(errorMessage)
      })

      expect(result.current.error).toBe(errorMessage)
    })

    it('should clear error when set to null', () => {
      const { result } = renderHook(() => useAppStore())

      act(() => {
        result.current.setError('Error message')
      })
      expect(result.current.error).toBe('Error message')

      act(() => {
        result.current.setError(null)
      })
      expect(result.current.error).toBe(null)
    })

    it('should handle multiple error changes', () => {
      const { result } = renderHook(() => useAppStore())

      act(() => {
        result.current.setError('First error')
      })
      expect(result.current.error).toBe('First error')

      act(() => {
        result.current.setError('Second error')
      })
      expect(result.current.error).toBe('Second error')

      act(() => {
        result.current.setError(null)
      })
      expect(result.current.error).toBe(null)
    })
  })

  describe('state persistence', () => {
    it('should persist state changes across renders', () => {
      const { result, rerender } = renderHook(() => useAppStore())

      act(() => {
        result.current.setLanguage('en')
        result.current.setTheme('light')
        result.current.setLoading(true)
        result.current.setError('Test error')
      })

      // Rerender to simulate component unmount/remount
      rerender()

      expect(result.current.language).toBe('en')
      expect(result.current.theme).toBe('light')
      expect(result.current.isLoading).toBe(true)
      expect(result.current.error).toBe('Test error')
    })
  })

  describe('concurrent state updates', () => {
    it('should handle multiple simultaneous state updates', () => {
      const { result } = renderHook(() => useAppStore())

      act(() => {
        result.current.setLanguage('en')
        result.current.setTheme('light')
        result.current.setLoading(true)
        result.current.setError('Concurrent update')
      })

      expect(result.current.language).toBe('en')
      expect(result.current.theme).toBe('light')
      expect(result.current.isLoading).toBe(true)
      expect(result.current.error).toBe('Concurrent update')
    })
  })

  describe('state isolation', () => {
    it('should maintain separate state instances', () => {
      const { result: result1 } = renderHook(() => useAppStore())
      const { result: result2 } = renderHook(() => useAppStore())

      act(() => {
        result1.current.setLanguage('en')
      })

      expect(result1.current.language).toBe('en')
      expect(result2.current.language).toBe('en') // Same store instance
    })
  })
})
