import { Global } from '@emotion/react'
import { createTheme, MantineProvider } from '@mantine/core'

import { useColorScheme } from '@/hooks/useColorScheme'

type ThemeProviderProps = {
  children: React.ReactNode
}

const theme = createTheme({})

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { colorScheme } = useColorScheme()
  const finalColorScheme: 'light' | 'dark' =
    colorScheme === 'dark' ? 'dark' : 'light'

  return (
    <MantineProvider theme={theme} forceColorScheme={finalColorScheme}>
      <Global
        styles={() => ({
          body: {
            backgroundColor: 'var(--mantine-color-body)',
          },
        })}
      />
      {children}
    </MantineProvider>
  )
}
