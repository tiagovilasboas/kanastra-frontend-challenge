import { Group } from '@mantine/core'
import { useTranslation } from 'react-i18next'

import { LanguageSelector } from '@/components/LanguageSelector'
import { spotifyStyles } from '@/lib/design-system/utils'

interface HeaderProps {
  title?: string
}

export function Header({ title }: HeaderProps) {
  const { t } = useTranslation()

  return (
    <header
      style={{
        ...spotifyStyles.bgSecondary,
        ...spotifyStyles.pMd,
        height: '64px',
        borderBottom: '1px solid #282828',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(24, 24, 24, 0.95)',
      }}
    >
      <Group>
        <h1
          style={{
            ...spotifyStyles.textPrimary,
            ...spotifyStyles.fontWeightBold,
            ...spotifyStyles.text2xl,
            margin: 0,
            background: 'linear-gradient(135deg, #1DB954 0%, #1ed760 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {title || t('brand')}
        </h1>
      </Group>
      
      <Group>
        <LanguageSelector />
      </Group>
    </header>
  )
} 