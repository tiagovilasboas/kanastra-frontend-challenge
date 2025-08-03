import { Camera, Search, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import styles from './SearchInput.module.css'

interface SearchInputProps {
  onSearch: (query: string) => void
  placeholder?: string
  disabled?: boolean
  showScanButton?: boolean
  onScanClick?: () => void
  navigateOnFocus?: boolean
}

export function SearchInput({
  onSearch,
  placeholder = 'O que você quer ouvir?',
  disabled = false,
  showScanButton = true,
  onScanClick,
  navigateOnFocus = true,
}: SearchInputProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [value, setValue] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    console.log('SearchInput handleChange called with:', newValue)
    setValue(newValue)
    onSearch(newValue)
  }

  const handleClear = () => {
    setValue('')
    onSearch('')
  }

  const handleFocus = () => {
    // Only navigate if navigateOnFocus is true and we're not on HomePage
    if (navigateOnFocus && location.pathname !== '/') {
      navigate('/')
    }
  }

  const handleScanClick = () => {
    if (onScanClick) {
      onScanClick()
    } else {
      // Default behavior - could open camera or show scan options
      console.log('Scan button clicked')
    }
  }

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchIconWrapper}>
        <Search className={styles.searchIcon} size={20} />
      </div>

      <input
        data-testid="search-input"
        type="text"
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        placeholder={placeholder}
        disabled={disabled}
        className={styles.searchInput}
      />

      <div className={styles.searchActions}>
        {value && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className={styles.clearButton}
            aria-label={t('searchInput:clearSearch', 'Clear search')}
          >
            <X size={16} />
          </button>
        )}

        {showScanButton && (
          <button
            type="button"
            onClick={handleScanClick}
            className={styles.scanButton}
            aria-label={t('searchInput:scanCode', 'Scan code')}
          >
            <Camera size={18} />
          </button>
        )}
      </div>
    </div>
  )
}
