import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { ErrorBoundary } from '@/components/ErrorBoundary'
import { createQueryClient } from '@/config/react-query'
import { useSpotifyInit } from '@/hooks/useSpotifyInit'
import { useAppStore } from '@/stores/appStore'

type AppProviderProps = {
  children: React.ReactNode
}

const queryClient = createQueryClient()

export function AppProvider({ children }: AppProviderProps) {
  const { i18n } = useTranslation()
  const { language } = useAppStore()
  const { isInitialized, error } = useSpotifyInit()

  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language)
    }
  }, [language, i18n])

  // Initialize Spotify in background
  useEffect(() => {
    if (!isInitialized && error) {
      console.error('Spotify initialization error:', error)
    }
  }, [isInitialized, error])

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
