import { useState, useRef, useEffect } from 'react'
import { TextInput, ActionIcon } from '@mantine/core'
import { useTranslation } from 'react-i18next'

import { SpotifyIcon } from './SpotifyIcon'
import { spotifyStyles } from '@/lib/design-system/utils'

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
  const [isFocused, setIsFocused] = useState(false)
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

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  const searchInputStyles = {
    ...spotifyStyles.fontPrimary,
    ...spotifyStyles.textBase,
    ...spotifyStyles.transitionSpotify,
    backgroundColor: isFocused ? '#2a2a2a' : '#242424',
    border: 'none',
    borderRadius: '20px',
    padding: '12px 16px',
    paddingLeft: '48px', // Espaço para o ícone
    color: '#FFFFFF',
    width: '100%',
    '&:focus': {
      outline: 'none',
      backgroundColor: '#2a2a2a',
    },
    '&::placeholder': {
      color: '#B3B3B3',
    },
  }

  const iconContainerStyles = {
    position: 'absolute' as const,
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 1,
    color: isFocused ? '#1DB954' : '#B3B3B3',
    transition: 'color 0.2s ease-in-out',
  }

  const clearButtonStyles = {
    position: 'absolute' as const,
    right: '8px',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 1,
    backgroundColor: 'transparent',
    border: 'none',
    color: '#B3B3B3',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: '#404040',
      color: '#FFFFFF',
    },
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '400px',
      }}
      className={className}
    >
      {/* Ícone de busca */}
      <div style={iconContainerStyles}>
        <SpotifyIcon icon="search" size="md" />
      </div>

      {/* Input */}
      <TextInput
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder || t('search.placeholder')}
        disabled={disabled}
        variant="unstyled"
        styles={{
          input: searchInputStyles,
          wrapper: {
            width: '100%',
          },
        }}
      />

      {/* Botão de limpar */}
      {value && (
        <button
          onClick={handleClear}
          style={clearButtonStyles}
          type="button"
          aria-label={t('search.clear')}
        >
          <SpotifyIcon icon="close" size="sm" />
        </button>
      )}
    </div>
  )
} 