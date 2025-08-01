import { FOLLOWER_THRESHOLDS, POPULARITY_THRESHOLDS } from '@/constants/spotify'

export function formatFollowers(followers: number): string {
  if (followers >= FOLLOWER_THRESHOLDS.MILLION) {
    return `${(followers / FOLLOWER_THRESHOLDS.MILLION).toFixed(1)}M`
  }
  if (followers >= FOLLOWER_THRESHOLDS.THOUSAND) {
    return `${(followers / FOLLOWER_THRESHOLDS.THOUSAND).toFixed(1)}K`
  }
  return followers.toString()
}

export function getPopularityColor(popularity: number): string {
  if (popularity >= POPULARITY_THRESHOLDS.HIGH) return '#1DB954'
  if (popularity >= POPULARITY_THRESHOLDS.MEDIUM) return '#fbbf24'
  if (popularity >= POPULARITY_THRESHOLDS.LOW) return '#f59e0b'
  return '#ef4444'
}

export function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
