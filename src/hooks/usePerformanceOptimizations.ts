import { useEffect, useMemo, useState } from 'react'

/**
 * Hook para otimizações de performance em componentes
 */
export function usePerformanceOptimizations() {
  // Otimização: Defer non-critical operations
  useEffect(() => {
    // Precarregar recursos críticos
    const prefetchCriticalResources = () => {
      // Prefetch fonts
      const linkFonts = document.createElement('link')
      linkFonts.rel = 'prefetch'
      linkFonts.href =
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
      document.head.appendChild(linkFonts)

      // Prefetch Spotify API domain
      const linkSpotify = document.createElement('link')
      linkSpotify.rel = 'dns-prefetch'
      linkSpotify.href = 'https://api.spotify.com'
      document.head.appendChild(linkSpotify)

      // Prefetch images domain
      const linkImages = document.createElement('link')
      linkImages.rel = 'dns-prefetch'
      linkImages.href = 'https://i.scdn.co'
      document.head.appendChild(linkImages)
    }

    // Defer to next tick
    setTimeout(prefetchCriticalResources, 0)
  }, [])

  // Otimização: Detectar device type para otimizações específicas
  const deviceOptimizations = useMemo(() => {
    if (typeof window === 'undefined')
      return { isMobile: false, reducedMotion: false }

    const isMobile = window.innerWidth < 768
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    return { isMobile, reducedMotion }
  }, [])

  return { deviceOptimizations }
}

/**
 * Hook para otimizar intersection observer
 */
export function useOptimizedIntersectionObserver() {
  const observer = useMemo(() => {
    if (typeof window === 'undefined') return null

    return new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Trigger lazy loading
            const img = entry.target as HTMLImageElement
            if (img.dataset.src) {
              img.src = img.dataset.src
              img.removeAttribute('data-src')
            }
          }
        })
      },
      {
        rootMargin: '50px', // Preload 50px before visible
        threshold: 0.1,
      },
    )
  }, [])

  return observer
}

/**
 * Hook para debounce otimizado especificamente para search
 */
export function useOptimizedSearchDebounce(
  value: string,
  delay: number = 300,
): { debouncedValue: string; isSearching: boolean } {
  const [debouncedValue, setDebouncedValue] = useState(value)
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    setIsSearching(true)

    const handler = setTimeout(() => {
      setDebouncedValue(value)
      setIsSearching(false)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return { debouncedValue, isSearching }
}
