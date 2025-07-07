import { ActionIcon, Tooltip, useMantineColorScheme } from '@mantine/core'
import { IconMoon, IconSun } from '@tabler/icons-react'

export function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const dark = colorScheme === 'dark'

  return (
    <Tooltip label={dark ? 'Modo claro' : 'Modo escuro'}>
      <ActionIcon
        variant="light"
        color={dark ? 'yellow' : 'blue'}
        onClick={() => toggleColorScheme()}
        size="lg"
        aria-label="Alternar tema"
      >
        {dark ? <IconSun size={18} /> : <IconMoon size={18} />}
      </ActionIcon>
    </Tooltip>
  )
}
