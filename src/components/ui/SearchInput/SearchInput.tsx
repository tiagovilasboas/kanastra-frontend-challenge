import { Search, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import styles from './SearchInput.module.css'

interface SearchInputProps {
  onSearch: (query: string) => void
  placeholder?: string
  disabled?: boolean
}

export function SearchInput({
  onSearch,
  placeholder = 'Search...',
  disabled = false,
}: SearchInputProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [value, setValue] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    onSearch(newValue)
  }

  const handleClear = () => {
    setValue('')
    onSearch('')
  }

  const handleFocus = () => {
    // Se não estivermos na HomePage, navegar de volta
    if (location.pathname !== '/') {
      navigate('/')
    }
  }

  return (
    <div className={styles.searchContainer}>
      <Search className={styles.searchIcon} size={20} />

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
    </div>
  )
}
