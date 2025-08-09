import { useEffect, useMemo, useRef, useState } from 'react'

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // 🚀 Otimização: Memoizar delay para evitar re-criações desnecessárias
  const memoizedDelay = useMemo(() => delay, [delay])

  useEffect(() => {
    // Limpar timeout anterior se existir
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // 🚀 Otimização: Usar ref para evitar closures desnecessários
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value)
    }, memoizedDelay)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [value, memoizedDelay])

  return debouncedValue
}

// 🚀 Hook otimizado especificamente para search
export function useSearchDebounce(
  searchQuery: string,
  delay: number = 300,
): { debouncedQuery: string; isDebouncing: boolean } {
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery)
  const [isDebouncing, setIsDebouncing] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  useEffect(() => {
    // Se query estiver vazia, atualizar imediatamente
    if (!searchQuery.trim()) {
      setDebouncedQuery('')
      setIsDebouncing(false)
      return
    }

    setIsDebouncing(true)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedQuery(searchQuery)
      setIsDebouncing(false)
    }, delay)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [searchQuery, delay])

  return { debouncedQuery, isDebouncing }
}
