import { ChevronDown, Globe } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useAppStore } from '@/stores/appStore'

const languages = [
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
]

export function LanguageSelector() {
  const { t } = useTranslation()
  const { language, setLanguage } = useAppStore()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentLanguage =
    languages.find((lang) => lang.code === language) || languages[0]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode)
    setIsOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setIsOpen(!isOpen)
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white hover:bg-gray-700 hover:border-gray-500 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-[#1DB954] focus-visible:outline-offset-2"
        aria-label={t('ui:languageSelector.ariaLabel', 'Selecionar idioma')}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">{currentLanguage.flag}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50">
          <ul
            role="listbox"
            className="py-2"
            aria-label={t(
              'ui:languageSelector.listLabel',
              'Idiomas disponíveis',
            )}
          >
            {languages.map((lang) => (
              <li
                key={lang.code}
                role="option"
                aria-selected={language === lang.code}
              >
                <button
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-left text-sm transition-colors duration-200 ${
                    language === lang.code
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <span className="text-base">{lang.flag}</span>
                  <span className="font-medium">{lang.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
