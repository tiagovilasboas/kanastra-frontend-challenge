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
  return typeof query === 'string' && query.trim().length > 0
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
