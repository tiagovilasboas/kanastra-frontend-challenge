import { MantineProvider } from '@mantine/core'

import { useColorScheme } from '@/hooks/useColorScheme'

type ThemeProviderProps = {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { colorScheme } = useColorScheme()

  // Handle 'auto' case from local storage which is not supported by forceColorScheme
  const finalColorScheme =
    colorScheme === 'auto' ? 'light' : (colorScheme as 'light' | 'dark')

  return (
    <MantineProvider forceColorScheme={finalColorScheme}>
      {children}
    </MantineProvider>
  )
}
