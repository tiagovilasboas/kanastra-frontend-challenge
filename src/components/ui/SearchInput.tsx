import { useState, useRef, useEffect } from 'react'
import { TextInput } from '@mantine/core'
import { useTranslation } from 'react-i18next'

import { SpotifyIcon } from './SpotifyIcon'

export interface SearchInputProps {
  onSearch: (query: string) => void
  placeholder?: string
  debounceMs?: number
  disabled?: boolean
  className?: string
}

export const SearchInput = ({
  onSearch,
  placeholder,
  debounceMs = 300,
  disabled = false,
  className,
}: SearchInputProps) => {
  const { t } = useTranslation()
  const [value, setValue] = useState('')
  const debounceRef = useRef<NodeJS.Timeout>()

  // Debounce effect
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (value.trim()) {
      debounceRef.current = setTimeout(() => {
        onSearch(value.trim())
      }, debounceMs)
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [value, onSearch, debounceMs])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  const handleClear = () => {
    setValue('')
    onSearch('')
  }

  return (
    <div className={`search-container ${className || ''}`}>
      {/* Ícone de busca */}
      <div className="search-icon">
        <SpotifyIcon icon="search" size="md" />
      </div>

      {/* Input */}
      <TextInput
        value={value}
        onChange={handleChange}
        placeholder={placeholder || t('search:placeholder')}
        disabled={disabled}
        variant="unstyled"
        classNames={{
          input: 'input-spotify',
          wrapper: 'w-full',
        }}
      />

      {/* Botão de limpar */}
      {value && (
        <button
          onClick={handleClear}
          className="search-clear"
          type="button"
          aria-label={t('search:clear')}
        >
          <SpotifyIcon icon="close" size="sm" />
        </button>
      )}
    </div>
  )
} 