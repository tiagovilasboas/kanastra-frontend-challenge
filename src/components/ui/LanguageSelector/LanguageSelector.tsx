import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { useAppStore } from '@/stores/appStore'

import styles from './LanguageSelector.module.css'

interface LanguageSelectorProps {
  size?: 'default' | 'compact'
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  size = 'default',
}) => {
  const { t } = useTranslation()
  const { language, setLanguage } = useAppStore()

  const handleLanguageChange = useCallback((newLanguage: string) => {
    setLanguage(newLanguage)
  }, [setLanguage])

  const isCompact = size === 'compact'

  return (
    <div
      className={`${styles.languageSelector} ${isCompact ? styles.compact : ''}`}
      data-testid="language-selector"
    >
      <button
        className={`${styles.languageButton} ${isCompact ? styles.compact : ''} ${language === 'pt' ? styles.active : ''}`}
        onClick={() => handleLanguageChange('pt')}
        aria-label={t('app:languages.portuguese')}
        title={t('app:languages.portuguese')}
        type="button"
      >
        {t('app:languages.portuguese').substring(0, 2).toUpperCase()}
      </button>
      <div
        className={`${styles.separator} ${isCompact ? styles.compact : ''}`}
      />
      <button
        className={`${styles.languageButton} ${isCompact ? styles.compact : ''} ${language === 'en' ? styles.active : ''}`}
        onClick={() => handleLanguageChange('en')}
        aria-label={t('app:languages.english')}
        title={t('app:languages.english')}
        type="button"
      >
        {t('app:languages.english').substring(0, 2).toUpperCase()}
      </button>
    </div>
  )
}
