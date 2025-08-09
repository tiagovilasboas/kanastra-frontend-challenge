import { useCallback, useEffect, useRef } from 'react'

interface UseKeyboardNavigationOptions {
  isEnabled?: boolean
  onEscape?: () => void
  onEnter?: () => void
  onArrowUp?: () => void
  onArrowDown?: () => void
  onArrowLeft?: () => void
  onArrowRight?: () => void
  onTab?: (event: KeyboardEvent) => void
  trapFocus?: boolean
  autoFocus?: boolean
}

interface UseKeyboardNavigationReturn {
  ref: React.RefObject<HTMLElement | null>
  focusFirst: () => void
  focusLast: () => void
  focusNext: () => void
  focusPrevious: () => void
}

export function useKeyboardNavigation(
  options: UseKeyboardNavigationOptions = {},
): UseKeyboardNavigationReturn {
  const {
    isEnabled = true,
    onEscape,
    onEnter,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onTab,
    trapFocus = false,
    autoFocus = false,
  } = options

  const ref = useRef<HTMLElement | null>(null)

  // Get all focusable elements within the container
  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!ref.current) return []

    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ].join(', ')

    return Array.from(ref.current.querySelectorAll(focusableSelectors))
  }, [])

  // Focus management functions
  const focusFirst = useCallback(() => {
    const elements = getFocusableElements()
    if (elements.length > 0) {
      elements[0].focus()
    }
  }, [getFocusableElements])

  const focusLast = useCallback(() => {
    const elements = getFocusableElements()
    if (elements.length > 0) {
      elements[elements.length - 1].focus()
    }
  }, [getFocusableElements])

  const focusNext = useCallback(() => {
    const elements = getFocusableElements()
    const currentIndex = elements.indexOf(document.activeElement as HTMLElement)

    if (currentIndex >= 0) {
      const nextIndex = (currentIndex + 1) % elements.length
      elements[nextIndex].focus()
    } else {
      focusFirst()
    }
  }, [getFocusableElements, focusFirst])

  const focusPrevious = useCallback(() => {
    const elements = getFocusableElements()
    const currentIndex = elements.indexOf(document.activeElement as HTMLElement)

    if (currentIndex >= 0) {
      const prevIndex =
        currentIndex === 0 ? elements.length - 1 : currentIndex - 1
      elements[prevIndex].focus()
    } else {
      focusLast()
    }
  }, [getFocusableElements, focusLast])

  // Keyboard event handler
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isEnabled) return

      switch (event.key) {
        case 'Escape':
          if (onEscape) {
            event.preventDefault()
            onEscape()
          }
          break

        case 'Enter':
          if (onEnter) {
            event.preventDefault()
            onEnter()
          }
          break

        case 'ArrowUp':
          if (onArrowUp) {
            event.preventDefault()
            onArrowUp()
          }
          break

        case 'ArrowDown':
          if (onArrowDown) {
            event.preventDefault()
            onArrowDown()
          }
          break

        case 'ArrowLeft':
          if (onArrowLeft) {
            event.preventDefault()
            onArrowLeft()
          }
          break

        case 'ArrowRight':
          if (onArrowRight) {
            event.preventDefault()
            onArrowRight()
          }
          break

        case 'Tab':
          if (trapFocus) {
            const elements = getFocusableElements()
            if (elements.length === 0) return

            const currentIndex = elements.indexOf(
              document.activeElement as HTMLElement,
            )

            if (event.shiftKey) {
              // Shift + Tab (backward)
              if (currentIndex <= 0) {
                event.preventDefault()
                focusLast()
              }
            } else {
              // Tab (forward)
              if (currentIndex >= elements.length - 1) {
                event.preventDefault()
                focusFirst()
              }
            }
          }

          if (onTab) {
            onTab(event)
          }
          break
      }
    },
    [
      isEnabled,
      onEscape,
      onEnter,
      onArrowUp,
      onArrowDown,
      onArrowLeft,
      onArrowRight,
      onTab,
      trapFocus,
      getFocusableElements,
      focusFirst,
      focusLast,
    ],
  )

  // Set up event listeners
  useEffect(() => {
    const element = ref.current
    if (!element || !isEnabled) return

    element.addEventListener('keydown', handleKeyDown)

    return () => {
      element.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown, isEnabled])

  // Auto focus on mount
  useEffect(() => {
    if (autoFocus && isEnabled) {
      focusFirst()
    }
  }, [autoFocus, isEnabled, focusFirst])

  return {
    ref,
    focusFirst,
    focusLast,
    focusNext,
    focusPrevious,
  }
}

// Specialized hook for overlay/modal keyboard navigation
export function useOverlayKeyboardNavigation(
  isOpen: boolean,
  onClose: () => void,
) {
  return useKeyboardNavigation({
    isEnabled: isOpen,
    onEscape: onClose,
    trapFocus: true,
    autoFocus: true,
  })
}

// Specialized hook for grid/list keyboard navigation
export function useGridKeyboardNavigation(
  columns: number,
  onSelect?: (index: number) => void,
) {
  const currentIndex = useRef(0)
  const maxIndex = useRef(0)

  const setMaxIndex = useCallback((max: number) => {
    maxIndex.current = max - 1
  }, [])

  const setCurrentIndex = useCallback((index: number) => {
    currentIndex.current = Math.max(0, Math.min(index, maxIndex.current))
  }, [])

  return {
    ...useKeyboardNavigation({
      onArrowUp: () => {
        const newIndex = Math.max(0, currentIndex.current - columns)
        setCurrentIndex(newIndex)
        onSelect?.(newIndex)
      },
      onArrowDown: () => {
        const newIndex = Math.min(
          maxIndex.current,
          currentIndex.current + columns,
        )
        setCurrentIndex(newIndex)
        onSelect?.(newIndex)
      },
      onArrowLeft: () => {
        const newIndex = Math.max(0, currentIndex.current - 1)
        setCurrentIndex(newIndex)
        onSelect?.(newIndex)
      },
      onArrowRight: () => {
        const newIndex = Math.min(maxIndex.current, currentIndex.current + 1)
        setCurrentIndex(newIndex)
        onSelect?.(newIndex)
      },
      onEnter: () => {
        onSelect?.(currentIndex.current)
      },
    }),
    setMaxIndex,
    setCurrentIndex,
    currentIndex: currentIndex.current,
  }
}
