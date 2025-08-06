import { Filter } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Input } from './input'

interface SimpleFilterInputProps {
  value: string
  onChange: (value: string) => void
  placeholderKey: string // i18n key
  className?: string
  disabled?: boolean
}

// Simple icon + input filter reused across pages (artist albums, search filters, etc.)
export const SimpleFilterInput: React.FC<SimpleFilterInputProps> = ({
  value,
  onChange,
  placeholderKey,
  className = '',
  disabled = false,
}) => {
  const { t } = useTranslation()

  return (
    <div className={`relative ${className}`}>
      <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        disabled={disabled}
        value={value}
        placeholder={t(placeholderKey)}
        onChange={(e) => onChange(e.target.value)}
        className="w-48 sm:w-64 pl-10 bg-muted/50 border-0 focus:bg-background"
      />
    </div>
  )
}
