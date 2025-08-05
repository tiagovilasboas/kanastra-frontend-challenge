import { useCallback } from 'react'

interface UseDOMReturn {
  setDocumentTitle: (title: string) => void
  updateMetaTag: (name: string, content: string) => void
  updateOpenGraphTag: (property: string, content: string) => void
  updateTwitterTag: (property: string, content: string) => void
  setCanonicalUrl: (url: string) => void
  addStructuredData: (data: Record<string, unknown>) => void
  removeStructuredData: () => void
}

export function useDOM(): UseDOMReturn {
  const setDocumentTitle = useCallback((title: string): void => {
    try {
      document.title = title
    } catch (error) {
      console.error('Error setting document title:', error)
    }
  }, [])

  const updateMetaTag = useCallback((name: string, content: string): void => {
    try {
      let meta = document.querySelector(
        `meta[name="${name}"]`,
      ) as HTMLMetaElement
      if (!meta) {
        meta = document.createElement('meta')
        meta.name = name
        document.head.appendChild(meta)
      }
      meta.content = content
    } catch (error) {
      console.error('Error updating meta tag:', error)
    }
  }, [])

  const updateOpenGraphTag = useCallback(
    (property: string, content: string): void => {
      try {
        let meta = document.querySelector(
          `meta[property="og:${property}"]`,
        ) as HTMLMetaElement
        if (!meta) {
          meta = document.createElement('meta')
          meta.setAttribute('property', `og:${property}`)
          document.head.appendChild(meta)
        }
        meta.content = content
      } catch (error) {
        console.error('Error updating Open Graph tag:', error)
      }
    },
    [],
  )

  const updateTwitterTag = useCallback(
    (property: string, content: string): void => {
      try {
        let meta = document.querySelector(
          `meta[property="twitter:${property}"]`,
        ) as HTMLMetaElement
        if (!meta) {
          meta = document.createElement('meta')
          meta.setAttribute('property', `twitter:${property}`)
          document.head.appendChild(meta)
        }
        meta.content = content
      } catch (error) {
        console.error('Error updating Twitter tag:', error)
      }
    },
    [],
  )

  const setCanonicalUrl = useCallback((url: string): void => {
    try {
      let canonical = document.querySelector(
        'link[rel="canonical"]',
      ) as HTMLLinkElement
      if (!canonical) {
        canonical = document.createElement('link')
        canonical.rel = 'canonical'
        document.head.appendChild(canonical)
      }
      canonical.href = url
    } catch (error) {
      console.error('Error setting canonical URL:', error)
    }
  }, [])

  const addStructuredData = useCallback(
    (data: Record<string, unknown>): void => {
      try {
        // Remove existing structured data
        const existingScript = document.querySelector(
          'script[type="application/ld+json"]',
        )
        if (existingScript) {
          existingScript.remove()
        }

        // Add new structured data
        const script = document.createElement('script')
        script.type = 'application/ld+json'
        script.textContent = JSON.stringify(data)
        document.head.appendChild(script)
      } catch (error) {
        console.error('Error adding structured data:', error)
      }
    },
    [],
  )

  const removeStructuredData = useCallback((): void => {
    try {
      const script = document.querySelector(
        'script[type="application/ld+json"]',
      )
      if (script) {
        script.remove()
      }
    } catch (error) {
      console.error('Error removing structured data:', error)
    }
  }, [])

  return {
    setDocumentTitle,
    updateMetaTag,
    updateOpenGraphTag,
    updateTwitterTag,
    setCanonicalUrl,
    addStructuredData,
    removeStructuredData,
  }
}
