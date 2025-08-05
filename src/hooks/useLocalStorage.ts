import { useCallback } from 'react'

interface UseLocalStorageReturn {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
  clear: () => void
}

export function useLocalStorage(): UseLocalStorageReturn {
  const getItem = useCallback((key: string): string | null => {
    try {
      return localStorage.getItem(key)
    } catch (error) {
      console.error('Error accessing localStorage:', error)
      return null
    }
  }, [])

  const setItem = useCallback((key: string, value: string): void => {
    try {
      localStorage.setItem(key, value)
    } catch (error) {
      console.error('Error setting localStorage item:', error)
    }
  }, [])

  const removeItem = useCallback((key: string): void => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Error removing localStorage item:', error)
    }
  }, [])

  const clear = useCallback((): void => {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  }, [])

  return {
    getItem,
    setItem,
    removeItem,
    clear,
  }
}
