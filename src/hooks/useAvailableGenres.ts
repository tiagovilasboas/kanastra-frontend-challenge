import { useQuery } from '@tanstack/react-query'

import { cache } from '@/config/cache'
import { queryKeys } from '@/config/react-query'
import { spotifyRepository } from '@/repositories'

interface UseAvailableGenresParams {
  enabled?: boolean
}

interface UseAvailableGenresReturn {
  genres: string[]
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

export function useAvailableGenres({
  enabled = true,
}: UseAvailableGenresParams = {}): UseAvailableGenresReturn {
  const {
    data: genres,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.availableGenres.list(),
    queryFn: async () => {
      return await spotifyRepository.getAvailableGenres()
    },
    enabled,
    staleTime: cache.stale.RARE,
    gcTime: cache.times.LONG,
  })

  return {
    genres: genres || [],
    isLoading,
    error: error as Error | null,
    refetch,
  }
} 