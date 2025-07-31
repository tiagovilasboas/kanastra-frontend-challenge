import { createTheme, MantineProvider } from '@mantine/core'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { useAppStore } from '@/stores/appStore'

type AppProviderProps = {
  children: React.ReactNode
}

const theme = createTheme({
  primaryColor: 'blue',
  fontFamily: 'Inter, sans-serif',
})

export function AppProvider({ children }: AppProviderProps) {
  const { theme: appTheme } = useAppStore()
  const { i18n } = useTranslation()
  const { language } = useAppStore()

  // Sync i18n language with Zustand store
  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language)
    }
  }, [language, i18n])

  return (
    <MantineProvider theme={theme} forceColorScheme={appTheme}>
      {children}
    </MantineProvider>
  )
}
