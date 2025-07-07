import { MantineColorScheme } from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'

export function useColorScheme() {
  const [colorScheme, setColorScheme] = useLocalStorage<MantineColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: 'light',
    getInitialValueInEffect: true,
  })

  const toggleColorScheme = (value?: MantineColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'))

  return { colorScheme, toggleColorScheme }
}
