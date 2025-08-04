import { Search, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

interface SearchInputProps {
  onSearch: (query: string) => void
  placeholder?: string
  disabled?: boolean
  navigateOnFocus?: boolean
}

export function SearchInput({
  onSearch,
  placeholder = 'O que você quer ouvir?',
  disabled = false,
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

  return (
    <div className="relative w-full">
      {/* Search Icon */}
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors duration-200 group-focus-within:text-[#1DB954]">
        <Search className="w-5 h-5" />
      </div>

      {/* Input Field */}
      <input
        data-testid="search-input"
        type="text"
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full bg-gray-800 border border-gray-600 rounded-xl pl-10 pr-10 py-3 text-white font-medium text-base transition-all duration-200 placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:border-[#1DB954] focus:bg-gray-700 focus:shadow-[0_0_0_2px_rgba(29,185,84,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
      />

      {/* Clear Button */}
      {value && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-none border-none text-gray-400 cursor-pointer p-1 rounded transition-all duration-200 hover:text-white hover:bg-gray-700 hover:scale-105 focus-visible:outline-2 focus-visible:outline-[#1DB954] focus-visible:outline-offset-2"
          aria-label={t('searchInput:clearSearch', 'Clear search')}
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}
