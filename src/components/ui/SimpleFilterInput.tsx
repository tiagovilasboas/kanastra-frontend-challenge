import { Filter } from 'lucide-react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from './button'
import { Input } from './input'
import { MobileFilterOverlay } from './MobileFilterOverlay'

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
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  return (
    <>
      {/* Desktop Filter Input */}
      <div className={`relative hidden lg:block ${className}`}>
        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          disabled={disabled}
          value={value}
          placeholder={t(placeholderKey)}
          onChange={(e) => onChange(e.target.value)}
          className="w-48 sm:w-64 pl-10 bg-muted/50 border-0 focus:bg-background"
        />
      </div>

      {/* Mobile Filter Button */}
      <Button
        variant="outline"
        onClick={() => setIsMobileFilterOpen(true)}
        className={`lg:hidden flex items-center gap-2 ${className}`}
        disabled={disabled}
      >
        <Filter className="w-4 h-4" />
        <span className="text-sm">{value || t(placeholderKey)}</span>
      </Button>

      {/* Mobile Filter Overlay - No blur to see background content */}
      <MobileFilterOverlay
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        value={value}
        onChange={onChange}
        placeholder={t(placeholderKey)}
      />
    </>
  )
}
