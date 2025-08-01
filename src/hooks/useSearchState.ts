import { useCallback, useState } from 'react'

interface UseSearchStateReturn {
  searchQuery: string
  setSearchQuery: (query: string) => void
  clearSearch: () => void
}

export function useSearchState(): UseSearchStateReturn {
  const [searchQuery, setSearchQuery] = useState('')

  const clearSearch = useCallback(() => {
    setSearchQuery('')
  }, [])

  return {
    searchQuery,
    setSearchQuery,
    clearSearch,
  }
}
