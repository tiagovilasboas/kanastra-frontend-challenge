import { useCallback, useEffect, useRef, useState } from 'react'

interface UseIntersectionObserverOptions {
  threshold?: number
  rootMargin?: string
  root?: Element | null
}

interface UseIntersectionObserverReturn {
  ref: React.RefObject<HTMLElement | null>
  isIntersecting: boolean
}

export function useIntersectionObserver(
  callback: (isIntersecting: boolean) => void,
  options: UseIntersectionObserverOptions = {},
): UseIntersectionObserverReturn {
  const ref = useRef<HTMLElement>(null)
  const [isIntersecting, setIsIntersecting] = useState(false)

  const { threshold = 0.1, rootMargin = '100px', root = null } = options

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries
      const intersecting = entry.isIntersecting
      setIsIntersecting(intersecting)
      callback(intersecting)
    },
    [callback],
  )

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
      root,
    })

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [handleIntersection, threshold, rootMargin, root])

  return { ref, isIntersecting }
}
