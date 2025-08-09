import { Search, X } from 'lucide-react'
import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

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

  // Focar no input quando o overlay abrir
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Fechar com ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevenir scroll do body
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Overlay Content */}
      <div className="relative z-10 bg-background border-b border-border">
        <div className="flex items-center gap-3 p-4">
          {/* Botão Voltar */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </Button>

          {/* Campo de Busca */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
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
                // Se Enter for pressionado e há uma query, fechar o overlay
                if (e.key === 'Enter' && searchQuery.trim()) {
                  onClose()
                }
              }}
              className="pl-10 h-12 text-base bg-muted/50 border-border focus:bg-background"
            />
          </div>
        </div>

        {/* Dica de uso */}
        {!searchQuery && (
          <div className="px-4 pb-4 text-sm text-muted-foreground">
            {t('search:mobileHint', 'Digite para buscar e pressione Enter')}
          </div>
        )}
      </div>
    </div>
  )
}
