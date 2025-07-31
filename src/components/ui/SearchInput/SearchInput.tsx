import { useRef, useState, useEffect } from 'react'
import { IconSearch, IconX } from '@tabler/icons-react'

import styles from './SearchInput.module.css'

interface SearchInputProps {
  onSearch: (query: string) => void
  placeholder?: string
  disabled?: boolean
  debounceMs?: number
}

export function SearchInput({
  onSearch,
  placeholder = 'Search...',
  disabled = false,
  debounceMs = 300,
}: SearchInputProps) {
  const [value, setValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined)

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (value.trim()) {
      setIsLoading(true)
      debounceRef.current = setTimeout(() => {
        onSearch(value)
        setIsLoading(false)
      }, debounceMs)
    } else {
      onSearch('')
      setIsLoading(false)
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [value, onSearch, debounceMs])

  const handleClear = () => {
    setValue('')
    onSearch('')
  }

  return (
    <div className={styles.searchContainer}>
      <IconSearch className={styles.searchIcon} size={20} />
      
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={styles.searchInput}
      />
      
      {isLoading && <div className={styles.searchLoading} />}
      
      {value && !isLoading && (
        <button
          type="button"
          onClick={handleClear}
          className={styles.searchClear}
          aria-label="Clear search"
        >
          <IconX size={12} />
        </button>
      )}
    </div>
  )
} 