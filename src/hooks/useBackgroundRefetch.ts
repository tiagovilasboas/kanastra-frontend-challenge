import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect } from 'react'

import { queryKeys } from '@/config/react-query'

interface BackgroundRefetchOptions {
  enabled?: boolean
  interval?: number // in milliseconds
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function useBackgroundRefetch(options: BackgroundRefetchOptions = {}) {
  const {
    enabled = true,
    interval = 5 * 60 * 1000, // 5 minutes default
    onSuccess,
    onError,
  } = options

  const queryClient = useQueryClient()

  // Background refetch for critical data
  const refetchCriticalData = useCallback(async () => {
    try {
      // Refetch authentication status
      await queryClient.refetchQueries({
        queryKey: queryKeys.auth.all,
        type: 'active',
      })

      // Refetch current artist data if any
      await queryClient.refetchQueries({
        queryKey: queryKeys.artists.all,
        type: 'active',
      })

      onSuccess?.()
    } catch (error) {
      onError?.(error as Error)
    }
  }, [queryClient, onSuccess, onError])

  // Set up background refetch interval
  useEffect(() => {
    if (!enabled) return

    const intervalId = setInterval(refetchCriticalData, interval)

    return () => clearInterval(intervalId)
  }, [enabled, interval, refetchCriticalData])

  // Refetch on window focus for critical data
  const refetchOnFocus = useCallback(async () => {
    if (!enabled) return

    try {
      // Only refetch if window was hidden for more than 1 minute
      const now = Date.now()
      const lastFocus = sessionStorage.getItem('lastWindowFocus')
      const timeSinceLastFocus = lastFocus ? now - parseInt(lastFocus) : 0

      if (timeSinceLastFocus > 60 * 1000) {
        await refetchCriticalData()
      }

      sessionStorage.setItem('lastWindowFocus', now.toString())
    } catch (error) {
      onError?.(error as Error)
    }
  }, [enabled, refetchCriticalData, onError])

  useEffect(() => {
    if (!enabled) return

    const handleFocus = () => {
      refetchOnFocus()
    }

    window.addEventListener('focus', handleFocus)

    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [enabled, refetchOnFocus])

  // Refetch on network reconnect
  const refetchOnReconnect = useCallback(async () => {
    if (!enabled) return

    try {
      await refetchCriticalData()
    } catch (error) {
      onError?.(error as Error)
    }
  }, [enabled, refetchCriticalData, onError])

  useEffect(() => {
    if (!enabled) return

    const handleOnline = () => {
      refetchOnReconnect()
    }

    window.addEventListener('online', handleOnline)

    return () => {
      window.removeEventListener('online', handleOnline)
    }
  }, [enabled, refetchOnReconnect])

  return {
    refetchCriticalData,
    refetchOnFocus,
    refetchOnReconnect,
  }
}
