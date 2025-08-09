import { Filter } from 'lucide-react'
import { useEffect, useRef } from 'react'

import { Input } from '@/components/ui/input'

export interface MobileFilterOverlayProps {
  isOpen: boolean
  onClose: () => void
  value: string
  onChange: (value: string) => void
  placeholder: string
}

export function MobileFilterOverlay({
  isOpen,
  onClose,
  value,
  onChange,
  placeholder,
}: MobileFilterOverlayProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose()
        }
      }
      document.addEventListener('keydown', handleEscape)
      return () => {
        document.removeEventListener('keydown', handleEscape)
      }
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] lg:hidden">
      {/* Overlay Content - Only at top, no backdrop blur */}
      <div className="bg-background border-b border-border w-full shadow-lg">
        <div className="flex items-center gap-3 p-4 w-full">
          {/* Filter Input */}
          <div className="flex-1 relative w-full">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder={placeholder}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && value.trim()) {
                  onClose()
                }
              }}
              className="pl-10 h-12 text-base bg-muted/50 border-border focus:bg-background w-full"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
