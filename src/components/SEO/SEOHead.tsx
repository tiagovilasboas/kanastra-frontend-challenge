import PropTypes from 'prop-types'
import { useEffect } from 'react'
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

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  image = '/og-image.jpg',
  url,
  type = 'website',
  artistName,
}) => {
  const { t } = useTranslation()

  useEffect(() => {
    // Update document title
    const baseTitle = 'Spotify Artist Explorer'

    // If title is provided, use it directly (it should already be properly formatted)
    // If no title but artistName is provided, format it
    // Otherwise use the base title
    const fullTitle =
      title || (artistName ? `${artistName} - ${baseTitle}` : baseTitle)

    document.title = fullTitle

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        description || t('seo:defaultDescription'),
      )
    }

    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]')
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords || t('seo:defaultKeywords'))
    }

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) {
      ogTitle.setAttribute('content', fullTitle)
    }

    const ogDescription = document.querySelector(
      'meta[property="og:description"]',
    )
    if (ogDescription) {
      ogDescription.setAttribute(
        'content',
        description || t('seo:defaultDescription'),
      )
    }

    const ogImage = document.querySelector('meta[property="og:image"]')
    if (ogImage) {
      ogImage.setAttribute('content', image)
    }

    const ogUrl = document.querySelector('meta[property="og:url"]')
    if (ogUrl && url) {
      ogUrl.setAttribute('content', url)
    }

    const ogType = document.querySelector('meta[property="og:type"]')
    if (ogType) {
      ogType.setAttribute('content', type)
    }

    // Update Twitter tags
    const twitterTitle = document.querySelector(
      'meta[property="twitter:title"]',
    )
    if (twitterTitle) {
      twitterTitle.setAttribute('content', fullTitle)
    }

    const twitterDescription = document.querySelector(
      'meta[property="twitter:description"]',
    )
    if (twitterDescription) {
      twitterDescription.setAttribute(
        'content',
        description || t('seo:defaultDescription'),
      )
    }

    const twitterImage = document.querySelector(
      'meta[property="twitter:image"]',
    )
    if (twitterImage) {
      twitterImage.setAttribute('content', image)
    }

    const twitterUrl = document.querySelector('meta[property="twitter:url"]')
    if (twitterUrl && url) {
      twitterUrl.setAttribute('content', url)
    }

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', url || window.location.href)
  }, [title, description, keywords, image, url, type, artistName, t])

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
