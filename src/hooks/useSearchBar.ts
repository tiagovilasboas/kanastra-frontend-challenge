import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useDebounce } from '@/hooks/useDebounce'
import { useSearchStore } from '@/stores/searchStore'

/**
 * Encapsula toda a lógica relacionada à barra de busca no Header.
 * Mantém o Header puramente apresentacional (SRP).
 */
export function useSearchBar() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { searchQuery, setSearchQuery, setDebouncedSearchQuery } =
    useSearchStore()

  const debouncedSearchQuery = useDebounce(searchQuery, 350)

  // sincroniza valor debounced no store
  useEffect(() => {
    setDebouncedSearchQuery(debouncedSearchQuery)
  }, [debouncedSearchQuery, setDebouncedSearchQuery])

  // handler de alteração no input
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchQuery(value)

      if (!value.trim()) {
        // limpa cache quando apaga
        queryClient.removeQueries({ queryKey: ['spotify-search'] })
        queryClient.removeQueries({ queryKey: ['spotify-search-by-type'] })
      }

      if (value.trim()) {
        const queryParams = new URLSearchParams({ q: value, market: 'BR' })
        navigate(`/search?${queryParams.toString()}`)
      }
    },
    [navigate, queryClient, setSearchQuery],
  )

  const handleSearchKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && searchQuery.trim()) {
        const queryParams = new URLSearchParams({
          q: searchQuery,
          market: 'BR',
        })
        navigate(`/search?${queryParams.toString()}`)
      }
    },
    [navigate, searchQuery],
  )

  return {
    searchQuery,
    handleSearchChange,
    handleSearchKeyPress,
  }
}
