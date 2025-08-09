import { useCallback, useMemo, useState } from 'react'

import { logger } from '@/utils/logger'

interface RetryConfig {
  maxAttempts?: number
  baseDelay?: number
  maxDelay?: number
  backoffFactor?: number
  retryCondition?: (error: Error) => boolean
}

interface RetryState {
  attempts: number
  isRetrying: boolean
  lastError: Error | null
}

interface UseRetryReturn<T> {
  execute: () => Promise<T>
  retry: () => Promise<T>
  reset: () => void
  state: RetryState
}

const DEFAULT_CONFIG: Required<RetryConfig> = {
  maxAttempts: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2,
  retryCondition: (error: Error) => {
    // Default: retry on network errors, timeout, and 5xx status codes
    const retryableErrors = ['NetworkError', 'TimeoutError', 'AbortError']
    const retryableStatus = ['500', '502', '503', '504', '429']

    return (
      retryableErrors.some((type) => error.name.includes(type)) ||
      retryableStatus.some((status) => error.message.includes(status)) ||
      error.message.includes('fetch')
    )
  },
}

export function useRetry<T>(
  asyncFunction: () => Promise<T>,
  config: RetryConfig = {},
): UseRetryReturn<T> {
  const finalConfig = useMemo(
    () => ({ ...DEFAULT_CONFIG, ...config }),
    [config],
  )

  const [state, setState] = useState<RetryState>({
    attempts: 0,
    isRetrying: false,
    lastError: null,
  })

  const calculateDelay = useCallback(
    (attempt: number): number => {
      const delay =
        finalConfig.baseDelay * Math.pow(finalConfig.backoffFactor, attempt)
      return Math.min(delay, finalConfig.maxDelay)
    },
    [finalConfig],
  )

  const sleep = useCallback((ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }, [])

  const executeWithRetry = useCallback(async (): Promise<T> => {
    let lastError: Error

    for (let attempt = 0; attempt <= finalConfig.maxAttempts; attempt++) {
      setState((prev) => ({
        ...prev,
        attempts: attempt,
        isRetrying: attempt > 0,
      }))

      try {
        logger.setContext({ retryAttempt: attempt })

        if (attempt > 0) {
          logger.info(`Retry attempt ${attempt}/${finalConfig.maxAttempts}`)
        }

        const result = await asyncFunction()

        // Success - reset state
        setState({
          attempts: 0,
          isRetrying: false,
          lastError: null,
        })

        logger.clearContext()
        return result
      } catch (error) {
        lastError = error as Error

        setState((prev) => ({
          ...prev,
          lastError,
        }))

        logger.warn(`Attempt ${attempt + 1} failed`, {
          error: lastError.message,
          attempt,
          maxAttempts: finalConfig.maxAttempts,
        })

        // Check if we should retry
        const shouldRetry =
          attempt < finalConfig.maxAttempts &&
          finalConfig.retryCondition(lastError)

        if (!shouldRetry) {
          setState((prev) => ({ ...prev, isRetrying: false }))
          logger.clearContext()
          throw lastError
        }

        // Wait before retry (except on last attempt)
        if (attempt < finalConfig.maxAttempts) {
          const delay = calculateDelay(attempt)
          logger.debug(`Waiting ${delay}ms before retry`)
          await sleep(delay)
        }
      }
    }

    setState((prev) => ({ ...prev, isRetrying: false }))
    logger.clearContext()
    throw lastError!
  }, [asyncFunction, finalConfig, calculateDelay, sleep])

  const reset = useCallback(() => {
    setState({
      attempts: 0,
      isRetrying: false,
      lastError: null,
    })
  }, [])

  return {
    execute: executeWithRetry,
    retry: executeWithRetry,
    reset,
    state,
  }
}

// Specialized hooks for common use cases
export function useApiRetry<T>(
  apiCall: () => Promise<T>,
  config?: RetryConfig,
): UseRetryReturn<T> {
  return useRetry(apiCall, {
    maxAttempts: 3,
    baseDelay: 1000,
    maxDelay: 5000,
    retryCondition: (error: Error) => {
      // Retry on network errors and server errors
      return (
        error.message.includes('fetch') ||
        error.message.includes('NetworkError') ||
        error.message.includes('5') ||
        error.message.includes('429')
      ) // Rate limit
    },
    ...config,
  })
}

export function useImageRetry<T>(
  imageLoader: () => Promise<T>,
  config?: RetryConfig,
): UseRetryReturn<T> {
  return useRetry(imageLoader, {
    maxAttempts: 2,
    baseDelay: 500,
    maxDelay: 2000,
    retryCondition: (error: Error) => {
      // Retry on image loading errors
      return (
        error.message.includes('load') ||
        error.message.includes('network') ||
        error.name === 'NetworkError'
      )
    },
    ...config,
  })
}
