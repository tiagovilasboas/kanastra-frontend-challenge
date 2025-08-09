/**
 * Utilitários para otimização de carregamento de imagens do Spotify
 */

export interface SpotifyImage {
  url: string
  width?: number
  height?: number
}

/**
 * Seleciona o tamanho de imagem mais apropriado baseado no contexto
 */
export function getOptimalImageUrl(
  images: SpotifyImage[] | undefined,
  context: 'thumbnail' | 'card' | 'header' | 'list',
): string | undefined {
  if (!images || images.length === 0) return undefined

  // Ordena as imagens por tamanho (maior para menor)
  const sortedImages = [...images].sort((a, b) => {
    const aSize = (a.width || 0) * (a.height || 0)
    const bSize = (b.width || 0) * (b.height || 0)
    return bSize - aSize
  })

  // Define tamanhos ideais baseados na análise real de performance
  // Tamanhos considerando displays reais + retina (2x)
  const targetSizes = {
    thumbnail: 64, // TrackListItem: 40px display = 64px é perfeito
    list: 64, // Listas pequenas: 64px display = 64px é perfeito
    card: 200, // Cards home: 182px display = 200px é suficiente (economia vs 300px)
    header: 300, // Headers: 192px display = 300px é suficiente (economia vs 640px)
  }

  const targetSize = targetSizes[context]

  // Encontra a imagem mais próxima do tamanho ideal (preferencialmente maior)
  const optimalImage =
    sortedImages.find((img) => (img.width || 0) >= targetSize) ||
    sortedImages[sortedImages.length - 1] // fallback para a menor

  // Log para debug (apenas em desenvolvimento)
  if (process.env.NODE_ENV === 'development') {
    console.debug(
      `🖼️ Image optimization: ${context} (target: ${targetSize}px) → selected: ${optimalImage?.width}x${optimalImage?.height}px`,
    )
  }

  return optimalImage?.url
}

/**
 * Preload de imagens críticas
 */
export function preloadCriticalImages(imageUrls: string[]): void {
  imageUrls.forEach((url) => {
    if (url) {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = url
      document.head.appendChild(link)
    }
  })
}

/**
 * Hook para preload de imagens com intersection observer
 */
export function useImagePreload() {
  const preloadedUrls = new Set<string>()

  const preloadImage = (url: string) => {
    if (!url || preloadedUrls.has(url)) return

    preloadedUrls.add(url)
    const img = new Image()
    img.src = url
  }

  return { preloadImage }
}

/**
 * Otimiza URLs de imagens do Spotify adicionando parâmetros de compressão
 * Nota: Spotify não suporta redimensionamento via query params, mas podemos
 * implementar um proxy de imagens ou service worker para otimização
 */
export function optimizeSpotifyImageUrl(url: string): string {
  if (!url) return url

  // Por enquanto, retorna a URL original
  // Em implementação futura, pode-se adicionar um proxy de imagens
  return url
}

/**
 * Cache de imagens no Service Worker
 */
export function cacheSpotifyImages(imageUrls: string[]): void {
  if ('serviceWorker' in navigator && 'caches' in window) {
    caches.open('spotify-images-v1').then((cache) => {
      imageUrls.forEach((url) => {
        if (url) {
          cache.add(url).catch(() => {
            // Silently fail para não quebrar a aplicação
          })
        }
      })
    })
  }
}

/**
 * Detecta se a imagem está no viewport para lazy loading
 */
export function createImageIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
): IntersectionObserver {
  return new IntersectionObserver(callback, {
    rootMargin: '50px', // Carrega 50px antes de entrar no viewport
    threshold: 0.1,
  })
}

/**
 * Converte Spotify images array para URLs otimizadas por contexto
 */
export function getSpotifyImageUrls(images: SpotifyImage[] | undefined) {
  return {
    thumbnail: getOptimalImageUrl(images, 'thumbnail'),
    card: getOptimalImageUrl(images, 'card'),
    header: getOptimalImageUrl(images, 'header'),
    list: getOptimalImageUrl(images, 'list'),
  }
}

/**
 * Analisa as imagens disponíveis e retorna estatísticas
 * Útil para debug e otimização
 */
export function analyzeSpotifyImages(images: SpotifyImage[] | undefined): {
  total: number
  sizes: Array<{ width: number; height: number; url: string }>
  optimalForContexts: Record<
    string,
    { width: number; height: number; url: string } | null
  >
} {
  if (!images || images.length === 0) {
    return {
      total: 0,
      sizes: [],
      optimalForContexts: {
        thumbnail: null,
        list: null,
        card: null,
        header: null,
      },
    }
  }

  const sizes = images
    .map((img) => ({
      width: img.width || 0,
      height: img.height || 0,
      url: img.url,
    }))
    .sort((a, b) => b.width * b.height - a.width * a.height)

  const contexts = ['thumbnail', 'list', 'card', 'header'] as const
  const optimalForContexts: Record<
    string,
    { width: number; height: number; url: string } | null
  > = {}

  contexts.forEach((context) => {
    const url = getOptimalImageUrl(images, context)
    const imageInfo = images.find((img) => img.url === url)
    optimalForContexts[context] = imageInfo
      ? {
          width: imageInfo.width || 0,
          height: imageInfo.height || 0,
          url: imageInfo.url,
        }
      : null
  })

  return {
    total: images.length,
    sizes,
    optimalForContexts,
  }
}
