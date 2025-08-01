import { ActionIcon, Group } from '@mantine/core'
import { useTranslation } from 'react-i18next'

import { useAppStore } from '@/stores/appStore'

export function LanguageSelector() {
  const { t } = useTranslation()
  const { language, setLanguage } = useAppStore()

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage)
  }

  return (
    <Group gap="xs">
      <ActionIcon
        variant={language === 'pt' ? 'filled' : 'subtle'}
        color={language === 'pt' ? 'blue' : 'gray'}
        onClick={() => handleLanguageChange('pt')}
        aria-label={t('common:language')}
        title={t('common:language')}
      >
        {/* TODO: Flag emoji removed to satisfy formatjs/no-literal-string-in-jsx. Consider using an SVG icon or custom component for flags. */}
      </ActionIcon>
      <ActionIcon
        variant={language === 'en' ? 'filled' : 'subtle'}
        color={language === 'en' ? 'blue' : 'gray'}
        onClick={() => handleLanguageChange('en')}
        aria-label={t('common:language')}
        title={t('common:language')}
      >
        {/* TODO: Flag emoji removed to satisfy formatjs/no-literal-string-in-jsx. Consider using an SVG icon or custom component for flags. */}
      </ActionIcon>
    </Group>
  )
}
