import { ActionIcon, Tooltip, useMantineColorScheme } from '@mantine/core'
import { IconMoon, IconSun } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

export function ThemeToggle() {
  const { t } = useTranslation()
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const dark = colorScheme === 'dark'

  return (
    <Tooltip label={dark ? t('theme.light') : t('theme.dark')}>
      <ActionIcon
        variant="light"
        color={dark ? 'yellow' : 'blue'}
        onClick={() => toggleColorScheme()}
        size="lg"
        aria-label={t('theme.toggle')}
      >
        {dark ? <IconSun size={18} /> : <IconMoon size={18} />}
      </ActionIcon>
    </Tooltip>
  )
}
