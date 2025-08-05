import { SpotifyArtist } from '@/types/spotify'

export function validateArtist(artist: unknown): artist is SpotifyArtist {
  if (!artist || typeof artist !== 'object') return false

  const artistObj = artist as Record<string, unknown>

  return (
    typeof artistObj.id === 'string' &&
    typeof artistObj.name === 'string' &&
    Array.isArray(artistObj.images) &&
    typeof artistObj.popularity === 'number' &&
    artistObj.followers !== undefined &&
    typeof (artistObj.followers as Record<string, unknown>).total ===
      'number' &&
    Array.isArray(artistObj.genres)
  )
}

export function validateSearchQuery(query: unknown): query is string {
  return typeof query === 'string' && query.trim().length >= 2
}

export function validatePaginationParams(
  params: unknown,
): params is { page: number; limit: number } {
  if (!params || typeof params !== 'object') return false

  const paramsObj = params as Record<string, unknown>

  return (
    typeof paramsObj.page === 'number' &&
    typeof paramsObj.limit === 'number' &&
    paramsObj.page > 0 &&
    paramsObj.limit > 0
  )
}

// Funções de validação adicionais para os testes
export function validateEmail(email: unknown): boolean {
  if (typeof email !== 'string') return false

  // More strict email validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return (
    emailRegex.test(email) &&
    !email.includes('..') &&
    !email.includes('@.') &&
    !email.startsWith('.') &&
    !email.endsWith('.') &&
    email.split('@')[1]?.includes('.')
  )
}

export function validateRequired(value: unknown): boolean {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  if (typeof value === 'boolean') return true
  if (typeof value === 'number') return true
  if (typeof value === 'object') return Object.keys(value as object).length > 0
  return false
}

export function validateMinLength(value: unknown, minLength: number): boolean {
  if (typeof value === 'string') return value.length >= minLength
  if (Array.isArray(value)) return value.length >= minLength
  return false
}

export function validateMaxLength(value: unknown, maxLength: number): boolean {
  if (typeof value === 'string') return value.length <= maxLength
  if (Array.isArray(value)) return value.length <= maxLength
  return false
}

export function validateUrl(url: unknown): boolean {
  if (typeof url !== 'string') return false

  try {
    const urlObj = new URL(url)
    return (
      (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') &&
      urlObj.hostname.length > 0 &&
      !urlObj.hostname.startsWith('.') &&
      !urlObj.hostname.endsWith('.') &&
      !url.includes(' ') &&
      urlObj.hostname.includes('.')
    )
  } catch {
    return false
  }
}

export function validateSpotifyUrl(url: unknown): boolean {
  if (typeof url !== 'string') return false

  try {
    const urlObj = new URL(url)
    return (
      urlObj.hostname === 'open.spotify.com' &&
      urlObj.protocol === 'https:' &&
      (urlObj.pathname.startsWith('/artist/') ||
        urlObj.pathname.startsWith('/track/') ||
        urlObj.pathname.startsWith('/album/') ||
        urlObj.pathname.startsWith('/playlist/')) &&
      urlObj.pathname.split('/').length >= 3 &&
      urlObj.pathname.split('/')[2]?.length > 0
    )
  } catch {
    return false
  }
}
