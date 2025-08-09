import { Search } from 'lucide-react'
import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { Input } from '@/components/ui/input'
import { useOverlayKeyboardNavigation } from '@/hooks/useKeyboardNavigation'

export interface MobileSearchOverlayProps {
  isOpen: boolean
  onClose: () => void
  searchQuery: string
  onSearchChange: (value: string) => void
  onSearchKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void
  searchPlaceholder?: string
}

export function MobileSearchOverlay({
  isOpen,
  onClose,
  searchQuery,
  onSearchChange,
  onSearchKeyPress,
  searchPlaceholder,
}: MobileSearchOverlayProps) {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)

  // Enhanced keyboard navigation with accessibility features
  const { ref: overlayRef } = useOverlayKeyboardNavigation(isOpen, onClose)

  // Focus management and body scroll prevention
  useEffect(() => {
    if (isOpen) {
      // Focus input when overlay opens
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100) // Small delay to ensure DOM is ready

      // Prevent body scroll
      document.body.style.overflow = 'hidden'

      // Add aria-hidden to main content for screen readers
      const mainContent = document.getElementById('root')
      if (mainContent) {
        mainContent.setAttribute('aria-hidden', 'true')
      }
    } else {
      // Restore body scroll
      document.body.style.overflow = 'unset'

      // Remove aria-hidden from main content
      const mainContent = document.getElementById('root')
      if (mainContent) {
        mainContent.removeAttribute('aria-hidden')
      }
    }

    return () => {
      document.body.style.overflow = 'unset'
      const mainContent = document.getElementById('root')
      if (mainContent) {
        mainContent.removeAttribute('aria-hidden')
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      ref={overlayRef as React.RefObject<HTMLDivElement>}
      className="fixed inset-0 z-[100] lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-search-title"
      aria-describedby="mobile-search-description"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Overlay Content */}
      <div className="relative z-10 bg-background border-b border-border w-full">
        <div className="flex items-center gap-3 p-4 w-full">
          {/* Search Field - 100% width */}
          <div className="flex-1 relative w-full">
            {/* Screen reader only title */}
            <h2 id="mobile-search-title" className="sr-only">
              {t('search:mobileSearchTitle', 'Mobile Search')}
            </h2>
            <p id="mobile-search-description" className="sr-only">
              {t(
                'search:mobileSearchDesc',
                'Search for artists, albums or songs. Press Escape to close.',
              )}
            </p>

            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              ref={inputRef}
              data-testid="mobile-search-input"
              placeholder={
                searchPlaceholder ||
                t('search:placeholder', 'Pesquisar artistas, álbuns ou músicas')
              }
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyPress={(e) => {
                onSearchKeyPress(e)
                // If Enter is pressed and there's a query, close the overlay
                if (e.key === 'Enter' && searchQuery.trim()) {
                  onClose()
                }
              }}
              className="pl-10 h-12 text-base bg-muted/50 border-border focus:bg-background w-full"
              aria-label={t('search:searchInputLabel', 'Search input')}
              aria-describedby="mobile-search-description"
              autoComplete="off"
              spellCheck="false"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
