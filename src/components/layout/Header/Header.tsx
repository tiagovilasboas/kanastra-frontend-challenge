import { Music } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { LanguageSelector } from '@/components/ui/LanguageSelector'

import styles from './Header.module.css'

export function Header() {
  const { t } = useTranslation()

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <a href="/" className={styles.headerBrand}>
          <Music className={styles.headerBrandIcon} />
          {t('common:brand')}
        </a>
        
        <div className={styles.headerActions}>
          <LanguageSelector />
        </div>
      </div>
    </header>
  )
} 