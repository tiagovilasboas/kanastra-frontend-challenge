import PropTypes from 'prop-types'
import React from 'react'

import { useDOM } from '@/hooks/useDOM'

interface StructuredDataProps {
  type: 'website' | 'article' | 'artist'
  title: string
  description: string
  url: string
  image?: string
  artistName?: string
  artistImage?: string
  artistFollowers?: number
  artistGenres?: string[]
}

export const StructuredData: React.FC<StructuredDataProps> = ({
  type,
  title,
  description,
  url,
  image,
  artistName,
  artistImage,
  artistFollowers,
  artistGenres,
}) => {
  const { addStructuredData, removeStructuredData } = useDOM()

  // Use useMemo to update structured data when props change
  React.useMemo(() => {
    let structuredData: Record<string, unknown> = {}

    if (type === 'website') {
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: title,
        description: description,
        url: url,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${url}search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      }
    } else if (type === 'article') {
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description: description,
        image: image,
        url: url,
        publisher: {
          '@type': 'Organization',
          name: 'Spotify Artist Explorer',
          logo: {
            '@type': 'ImageObject',
            url: '/spotify-icon.svg',
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': url,
        },
      }
    } else if (type === 'artist') {
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'MusicGroup',
        name: artistName,
        description: description,
        image: artistImage,
        url: url,
        genre: artistGenres,
        ...(artistFollowers && {
          interactionStatistic: {
            '@type': 'InteractionCounter',
            interactionType: 'https://schema.org/FollowAction',
            userInteractionCount: artistFollowers,
          },
        }),
        sameAs: [
          'https://open.spotify.com',
        ],
      }
    }

    addStructuredData(structuredData)
  }, [type, title, description, url, image, artistName, artistImage, artistFollowers, artistGenres, addStructuredData])

  // Cleanup on unmount using useLayoutEffect
  React.useLayoutEffect(() => {
    return () => {
      removeStructuredData()
    }
  }, [removeStructuredData])

  return null
}

StructuredData.propTypes = {
  type: PropTypes.oneOf(['website', 'article', 'artist']).isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  image: PropTypes.string,
  artistName: PropTypes.string,
  artistImage: PropTypes.string,
  artistFollowers: PropTypes.number,
  artistGenres: PropTypes.arrayOf(PropTypes.string),
} 