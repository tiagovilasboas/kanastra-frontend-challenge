import { Group } from '@mantine/core'
import { useTranslation } from 'react-i18next'

import { LanguageSelector } from '@/components/LanguageSelector'

interface HeaderProps {
  title?: string
}

export function Header({ title }: HeaderProps) {
  const { t } = useTranslation()

  return (
    <header className="header-spotify">
      <Group>
        <h1 className="header-brand">
          {title || t('common:brand')}
        </h1>
      </Group>
      
      <Group>
        <LanguageSelector />
      </Group>
    </header>
  )
} 