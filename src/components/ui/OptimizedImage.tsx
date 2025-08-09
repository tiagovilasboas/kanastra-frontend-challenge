import React, { useEffect, useRef, useState } from 'react'

import {
  createImageIntersectionObserver,
  getOptimalImageUrl,
} from '@/utils/imageOptimization'

import { PlaceholderImage } from './PlaceholderImage'

interface OptimizedImageProps {
  images?: Array<{ url: string; width?: number; height?: number }>
  alt: string
  context: 'thumbnail' | 'card' | 'header' | 'list'
  className?: string
  priority?: boolean // Para imagens críticas (above the fold)
  placeholder?: 'blur' | 'icon'
  placeholderType?:
    | 'album'
    | 'artist'
    | 'playlist'
    | 'show'
    | 'episode'
    | 'audiobook'
  onLoad?: () => void
  onError?: () => void
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  images,
  alt,
  context,
  className = '',
  priority = false,
  placeholder = 'icon',
  placeholderType = 'album',
  onLoad,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [shouldLoad, setShouldLoad] = useState(priority)
  const imgRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const imageUrl = getOptimalImageUrl(images, context)

  // Intersection Observer para lazy loading
  useEffect(() => {
    if (priority || !containerRef.current) return

    const observer = createImageIntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setShouldLoad(true)
          observer.disconnect()
        }
      })
    })

    observer.observe(containerRef.current)

    return () => observer.disconnect()
  }, [priority])

  // Preload para imagens críticas
  useEffect(() => {
    if (priority && imageUrl) {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = imageUrl
      document.head.appendChild(link)
    }
  }, [priority, imageUrl])

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
    onError?.()
  }

  // Se não há imagem ou houve erro, mostra placeholder
  if (!imageUrl || hasError) {
    return (
      <div
        ref={containerRef}
        className={`relative overflow-hidden ${className}`}
        style={{
          // Garantir que placeholders circulares sejam sempre quadrados
          aspectRatio: className.includes('rounded-full') ? '1/1' : undefined,
        }}
      >
        <PlaceholderImage type={placeholderType} className="w-full h-full" />
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        // Garantir que containers circulares sejam sempre quadrados
        aspectRatio: className.includes('rounded-full') ? '1/1' : undefined,
      }}
    >
      {/* Placeholder enquanto carrega */}
      {isLoading && placeholder === 'icon' && (
        <div className="absolute inset-0 z-10">
          <PlaceholderImage type={placeholderType} className="w-full h-full" />
        </div>
      )}

      {/* Blur placeholder */}
      {isLoading && placeholder === 'blur' && (
        <div
          className={`absolute inset-0 z-10 bg-muted animate-pulse ${className}`}
        />
      )}

      {/* Imagem principal */}
      {shouldLoad && (
        <img
          ref={imgRef}
          src={imageUrl}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          } ${className}`}
          style={{
            // Garantir que imagens circulares sejam sempre quadradas
            aspectRatio: className.includes('rounded-full') ? '1/1' : undefined,
          }}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'low'}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  )
}
