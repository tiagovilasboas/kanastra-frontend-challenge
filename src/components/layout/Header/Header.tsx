import { IconMusic } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

import { LanguageSelector } from '@/components/LanguageSelector'

import styles from './Header.module.css'

export function Header() {
  const { t } = useTranslation()

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <a href="/" className={styles.headerBrand}>
          <IconMusic className={styles.headerBrandIcon} />
          {t('common:brand')}
        </a>
        
        <div className={styles.headerActions}>
          <LanguageSelector />
        </div>
      </div>
    </header>
  )
} 