import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React from 'react'
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

  // Use useMemo to handle language changes
  React.useMemo(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language)
    }
  }, [language, i18n])

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SpotifyInitializer />
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

// Separate component to handle Spotify initialization after QueryClient is available
function SpotifyInitializer() {
  const { isInitialized, error } = useSpotifyInit()

  // Handle Spotify initialization errors
  React.useMemo(() => {
    if (!isInitialized && error) {
      console.error('Spotify initialization error:', error)
    }
  }, [isInitialized, error])

  return null
}
