import PropTypes from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: 'website' | 'article'
  artistName?: string
}

// Hook customizado para SEO sem useEffect
function useSEOUpdate(props: SEOHeadProps) {
  const { t } = useTranslation()

  // Use React.useMemo to update SEO when props change
  React.useMemo(() => {
    const baseTitle = 'Spotify Artist Explorer'
    const fullTitle =
      props.title ||
      (props.artistName ? `${props.artistName} - ${baseTitle}` : baseTitle)

    // Update document title
    document.title = fullTitle

    // Update meta tags
    const updateMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`)
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('name', name)
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    }

    const updateOpenGraphTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="og:${property}"]`)
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('property', `og:${property}`)
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    }

    const updateTwitterTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="twitter:${name}"]`)
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('name', `twitter:${name}`)
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    }

    // Update meta tags
    updateMetaTag(
      'description',
      props.description || t('seo:defaultDescription'),
    )
    updateMetaTag('keywords', props.keywords || t('seo:defaultKeywords'))

    // Update Open Graph tags
    updateOpenGraphTag('title', fullTitle)
    updateOpenGraphTag(
      'description',
      props.description || t('seo:defaultDescription'),
    )
    updateOpenGraphTag('image', props.image || '/og-image.jpg')
    if (props.url) {
      updateOpenGraphTag('url', props.url)
    }
    updateOpenGraphTag('type', props.type || 'website')

    // Update Twitter tags
    updateTwitterTag('title', fullTitle)
    updateTwitterTag(
      'description',
      props.description || t('seo:defaultDescription'),
    )
    updateTwitterTag('image', props.image || '/og-image.jpg')
    if (props.url) {
      updateTwitterTag('url', props.url)
    }

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', props.url || window.location.href)
  }, [
    props.title,
    props.description,
    props.keywords,
    props.image,
    props.url,
    props.type,
    props.artistName,
    t,
  ])
}

export const SEOHead: React.FC<SEOHeadProps> = (props) => {
  useSEOUpdate(props)
  return null // This component doesn't render anything
}

SEOHead.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  image: PropTypes.string,
  url: PropTypes.string,
  type: PropTypes.oneOf(['website', 'article']),
  artistName: PropTypes.string,
}
