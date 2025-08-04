import { Globe } from 'lucide-react'
import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from './button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu'

const languages = [
  {
    code: 'pt',
    name: 'Português',
    flag: '🇧🇷'
  },
  {
    code: 'en',
    name: 'English',
    flag: '🇺🇸'
  }
] as const

export const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation()

  const currentLanguage = useMemo(() => 
    languages.find(lang => lang.code === i18n.language) || languages[0], 
    [i18n.language]
  )

  const handleLanguageChange = useCallback((languageCode: string) => {
    i18n.changeLanguage(languageCode)
  }, [i18n])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">{currentLanguage.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`cursor-pointer ${
              i18n.language === language.code ? 'bg-accent' : ''
            }`}
          >
            <span className="mr-2">{language.flag}</span>
            <span>{language.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 