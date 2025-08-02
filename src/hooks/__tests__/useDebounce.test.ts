import { act,renderHook } from '@testing-library/react'
import { afterEach,beforeEach, describe, expect, it, vi } from 'vitest'

import { useDebounce } from '../useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('basic functionality', () => {
    it('should return the initial value immediately', () => {
      const { result } = renderHook(() => useDebounce('initial', { delay: 500 }))

      expect(result.current).toBe('initial')
    })

    it('should debounce value changes', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, { delay }),
        { initialProps: { value: 'initial', delay: 500 } }
      )

      expect(result.current).toBe('initial')

      // Change value
      rerender({ value: 'changed', delay: 500 })
      expect(result.current).toBe('initial') // Should still be old value

      // Fast forward time
      act(() => {
        vi.advanceTimersByTime(500)
      })

      expect(result.current).toBe('changed') // Now should be new value
    })

    it('should use default delay of 300ms', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value),
        { initialProps: { value: 'initial' } }
      )

      rerender({ value: 'changed' })
      expect(result.current).toBe('initial')

      act(() => {
        vi.advanceTimersByTime(300)
      })

      expect(result.current).toBe('changed')
    })
  })

  describe('multiple rapid changes', () => {
    it('should only update after delay from last change', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, { delay }),
        { initialProps: { value: 'initial', delay: 500 } }
      )

      // Multiple rapid changes
      rerender({ value: 'change1', delay: 500 })
      act(() => vi.advanceTimersByTime(100))

      rerender({ value: 'change2', delay: 500 })
      act(() => vi.advanceTimersByTime(100))

      rerender({ value: 'change3', delay: 500 })
      act(() => vi.advanceTimersByTime(100))

      rerender({ value: 'final', delay: 500 })

      expect(result.current).toBe('initial') // Should still be initial

      // Wait for the full delay from the last change
      act(() => {
        vi.advanceTimersByTime(500)
      })

      expect(result.current).toBe('final') // Should be the last value
    })

    it('should cancel previous timers on new changes', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, { delay }),
        { initialProps: { value: 'initial', delay: 500 } }
      )

      rerender({ value: 'change1', delay: 500 })
      act(() => vi.advanceTimersByTime(400)) // Almost at the delay

      rerender({ value: 'change2', delay: 500 })
      act(() => vi.advanceTimersByTime(100)) // Should reset the timer

      expect(result.current).toBe('initial') // Should still be initial

      act(() => {
        vi.advanceTimersByTime(400) // Complete the delay from change2
      })

      expect(result.current).toBe('change2') // Should be change2, not change1
    })
  })

  describe('different delay values', () => {
    it('should work with short delays', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, { delay }),
        { initialProps: { value: 'initial', delay: 100 } }
      )

      rerender({ value: 'changed', delay: 100 })
      expect(result.current).toBe('initial')

      act(() => {
        vi.advanceTimersByTime(100)
      })

      expect(result.current).toBe('changed')
    })

    it('should work with long delays', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, { delay }),
        { initialProps: { value: 'initial', delay: 2000 } }
      )

      rerender({ value: 'changed', delay: 2000 })
      expect(result.current).toBe('initial')

      act(() => {
        vi.advanceTimersByTime(2000)
      })

      expect(result.current).toBe('changed')
    })

    it('should work with zero delay', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, { delay }),
        { initialProps: { value: 'initial', delay: 0 } }
      )

      rerender({ value: 'changed', delay: 0 })
      expect(result.current).toBe('initial')

      act(() => {
        vi.advanceTimersByTime(0)
      })

      expect(result.current).toBe('changed')
    })
  })

  describe('edge cases', () => {
    it('should handle undefined value', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, { delay }),
        { initialProps: { value: 'initial', delay: 500 } }
      )

      rerender({ value: undefined, delay: 500 })
      expect(result.current).toBe('initial')

      act(() => {
        vi.advanceTimersByTime(500)
      })

      expect(result.current).toBeUndefined()
    })

    it('should handle null value', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, { delay }),
        { initialProps: { value: 'initial', delay: 500 } }
      )

      rerender({ value: null, delay: 500 })
      expect(result.current).toBe('initial')

      act(() => {
        vi.advanceTimersByTime(500)
      })

      expect(result.current).toBeNull()
    })

    it('should handle empty string', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, { delay }),
        { initialProps: { value: 'initial', delay: 500 } }
      )

      rerender({ value: '', delay: 500 })
      expect(result.current).toBe('initial')

      act(() => {
        vi.advanceTimersByTime(500)
      })

      expect(result.current).toBe('')
    })

    it('should handle negative delay', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, { delay }),
        { initialProps: { value: 'initial', delay: -100 } }
      )

      rerender({ value: 'changed', delay: -100 })
      expect(result.current).toBe('initial')

      act(() => {
        vi.advanceTimersByTime(100) // Use positive time
      })

      expect(result.current).toBe('changed')
    })
  })

  describe('complex values', () => {
    it('should work with numbers', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, { delay }),
        { initialProps: { value: 0, delay: 500 } }
      )

      rerender({ value: 42, delay: 500 })
      expect(result.current).toBe(0)

      act(() => {
        vi.advanceTimersByTime(500)
      })

      expect(result.current).toBe(42)
    })

    it('should work with objects', () => {
      const initialObj = { name: 'initial' }
      const changedObj = { name: 'changed' }

      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, { delay }),
        { initialProps: { value: initialObj, delay: 500 } }
      )

      rerender({ value: changedObj, delay: 500 })
      expect(result.current).toBe(initialObj)

      act(() => {
        vi.advanceTimersByTime(500)
      })

      expect(result.current).toBe(changedObj)
    })

    it('should work with arrays', () => {
      const initialArray = [1, 2, 3]
      const changedArray = [4, 5, 6]

      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, { delay }),
        { initialProps: { value: initialArray, delay: 500 } }
      )

      rerender({ value: changedArray, delay: 500 })
      expect(result.current).toBe(initialArray)

      act(() => {
        vi.advanceTimersByTime(500)
      })

      expect(result.current).toBe(changedArray)
    })

    it('should work with boolean values', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, { delay }),
        { initialProps: { value: false, delay: 500 } }
      )

      rerender({ value: true, delay: 500 })
      expect(result.current).toBe(false)

      act(() => {
        vi.advanceTimersByTime(500)
      })

      expect(result.current).toBe(true)
    })
  })

  describe('cleanup', () => {
    it('should clear timeout on unmount', () => {
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')

      const { unmount, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, { delay }),
        { initialProps: { value: 'initial', delay: 500 } }
      )

      rerender({ value: 'changed', delay: 500 })

      unmount()

      expect(clearTimeoutSpy).toHaveBeenCalled()
    })

    it('should clear timeout when delay changes', () => {
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')

      const { rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, { delay }),
        { initialProps: { value: 'initial', delay: 500 } }
      )

      rerender({ value: 'changed', delay: 1000 }) // Different delay

      expect(clearTimeoutSpy).toHaveBeenCalled()
    })
  })

  describe('performance', () => {
    it('should not create unnecessary timers', () => {
      const setTimeoutSpy = vi.spyOn(global, 'setTimeout')

      const { rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, { delay }),
        { initialProps: { value: 'initial', delay: 500 } }
      )

      // Multiple changes should only create one timer
      rerender({ value: 'change1', delay: 500 })
      rerender({ value: 'change2', delay: 500 })
      rerender({ value: 'change3', delay: 500 })

      // Should only call setTimeout once per change (minus the initial render)
      expect(setTimeoutSpy).toHaveBeenCalledTimes(3)
    })
  })

  describe('real-world scenarios', () => {
    it('should simulate search input debouncing', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, { delay }),
        { initialProps: { value: '', delay: 300 } }
      )

      // Simulate user typing quickly
      rerender({ value: 'd', delay: 300 })
      act(() => vi.advanceTimersByTime(100))

      rerender({ value: 'dr', delay: 300 })
      act(() => vi.advanceTimersByTime(100))

      rerender({ value: 'dra', delay: 300 })
      act(() => vi.advanceTimersByTime(100))

      rerender({ value: 'drak', delay: 300 })
      act(() => vi.advanceTimersByTime(100))

      rerender({ value: 'drake', delay: 300 })

      expect(result.current).toBe('') // Should still be empty

      act(() => {
        vi.advanceTimersByTime(300)
      })

      expect(result.current).toBe('drake') // Should be the final value
    })

    it('should handle window resize debouncing', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, { delay }),
        { initialProps: { value: 1920, delay: 150 } }
      )

      // Simulate rapid window resizing
      rerender({ value: 1800, delay: 150 })
      act(() => vi.advanceTimersByTime(50))

      rerender({ value: 1600, delay: 150 })
      act(() => vi.advanceTimersByTime(50))

      rerender({ value: 1400, delay: 150 })

      expect(result.current).toBe(1920) // Should still be initial

      act(() => {
        vi.advanceTimersByTime(150)
      })

      expect(result.current).toBe(1400) // Should be the final value
    })
  })
}) 