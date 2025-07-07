import { useLocalStorage } from '@mantine/hooks'
import { createContext, useContext } from 'react'

type ColorScheme = 'light' | 'dark'
interface ColorSchemeContextValue {
  colorScheme: ColorScheme
  toggleColorScheme: () => void
}

const ColorSchemeContext = createContext<ColorSchemeContextValue | undefined>(
  undefined,
)

export function ColorSchemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: 'light',
    getInitialValueInEffect: true,
  })

  const toggleColorScheme = () =>
    setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')

  return (
    <ColorSchemeContext.Provider value={{ colorScheme, toggleColorScheme }}>
      {children}
    </ColorSchemeContext.Provider>
  )
}

export function useColorScheme() {
  const context = useContext(ColorSchemeContext)
  if (!context) {
    throw new Error('useColorScheme must be used within a ColorSchemeProvider')
  }
  return context
}
