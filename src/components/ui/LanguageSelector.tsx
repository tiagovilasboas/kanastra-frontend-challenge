import { ActionIcon, Group, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'

import { useAppStore } from '@/stores/appStore'

export function LanguageSelector() {
  const { language, setLanguage } = useAppStore()
  const { t } = useTranslation()

  const handleLanguageChange = (newLanguage: 'pt' | 'en') => {
    setLanguage(newLanguage)
  }

  return (
    <Group gap="xs">
      <Text size="sm" c="dimmed">
        {t('language')}
        {t('colon')}
      </Text>
      <ActionIcon
        variant={language === 'pt' ? 'filled' : 'subtle'}
        size="sm"
        onClick={() => handleLanguageChange('pt')}
        aria-label={t('languages.portuguese')}
      >
        {t('flags.brazil')}
      </ActionIcon>
      <ActionIcon
        variant={language === 'en' ? 'filled' : 'subtle'}
        size="sm"
        onClick={() => handleLanguageChange('en')}
        aria-label={t('languages.english')}
      >
        {t('flags.usa')}
      </ActionIcon>
    </Group>
  )
}
