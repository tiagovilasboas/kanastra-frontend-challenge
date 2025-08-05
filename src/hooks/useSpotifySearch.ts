import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { SpotifyRepository } from '@/repositories/spotify/SpotifyRepository'
import { useAppStore } from '@/stores/appStore'
import { useSearchStore } from '@/stores/searchStore'
import { errorHandler } from '@/utils/errorHandler'
import { validateSearchQuery } from '@/utils/validation'

const spotifyRepo = new SpotifyRepository()

// Debounce delay em ms (como no repositório da Betalent)
const DEBOUNCE_DELAY = 300

export const useSpotifySearch = () => {
  const { t } = useTranslation()
  const { searchQuery } = useSearchStore()
  const { setLoading, setError } = useAppStore()
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery)

  // Debounce effect para otimizar performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, DEBOUNCE_DELAY)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const {
    data: searchResults,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['spotify-search', debouncedQuery],
    queryFn: async () => {
      if (!validateSearchQuery(debouncedQuery)) {
        throw new Error(t('search:errors.invalidQuery', 'Invalid search query'))
      }

      setLoading(true)
      setError(null)

      try {
        const results = await spotifyRepo.searchAdvanced(
          debouncedQuery,
          'artist',
          undefined,
          20,
          0,
        )

        return results
      } catch (err) {
        const errorMessage = errorHandler.handleApiError(err)
        setError(errorMessage.message || 'Search failed')
        throw err
      } finally {
        setLoading(false)
      }
    },
    enabled: !!debouncedQuery && validateSearchQuery(debouncedQuery),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })

  const search = useCallback(
    async (query: string) => {
      if (!validateSearchQuery(query)) {
        setError(t('search:errors.invalidQuery', 'Invalid search query'))
        return
      }

      try {
        await refetch()
      } catch (err) {
        console.error('Search error:', err)
      }
    },
    [refetch, setError, t],
  )

  return {
    searchResults,
    isLoading,
    error,
    search,
    debouncedQuery,
  }
}
