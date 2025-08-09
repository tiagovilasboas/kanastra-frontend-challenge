import { useEffect } from 'react'

import {
  cacheSpotifyImages,
  preloadCriticalImages,
} from '@/utils/imageOptimization'

/**
 * Hook para preload de imagens críticas
 */
export function useImagePreload(
  criticalImageUrls: string[],
  shouldPreload = true,
) {
  useEffect(() => {
    if (!shouldPreload || criticalImageUrls.length === 0) return

    // Preload das imagens críticas (above-the-fold)
    preloadCriticalImages(criticalImageUrls)

    // Cache das imagens no service worker
    cacheSpotifyImages(criticalImageUrls)
  }, [criticalImageUrls, shouldPreload])
}

/**
 * Hook específico para preload de artistas populares
 */
export function usePopularArtistsImagePreload(
  artists: Array<{ images?: Array<{ url: string }> }>,
) {
  const imageUrls = artists
    .slice(0, 6) // Apenas os primeiros 6 artistas (acima da dobra)
    .map((artist) => artist.images?.[0]?.url)
    .filter(Boolean) as string[]

  useImagePreload(imageUrls, true)
}
