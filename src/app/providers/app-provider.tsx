import { createTheme, MantineProvider } from '@mantine/core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { ErrorBoundary } from '@/components/ErrorBoundary'
import { useAppStore } from '@/stores/appStore'

type AppProviderProps = {
  children: React.ReactNode
}

const theme = createTheme({
  primaryColor: 'blue',
  fontFamily: 'Inter, sans-serif',
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})

export function AppProvider({ children }: AppProviderProps) {
  const { theme: appTheme } = useAppStore()
  const { i18n } = useTranslation()
  const { language } = useAppStore()

  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language)
    }
  }, [language, i18n])

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <MantineProvider theme={theme} forceColorScheme={appTheme}>
          {children}
        </MantineProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
