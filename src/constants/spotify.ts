export const SPOTIFY_CONFIG = {
  CLIENT_ID: 'c6c3457349a542d59b8e0dcc39c4047a',
  REDIRECT_URI: 'https://localhost:5173/callback',
  SCOPES: ['user-read-private', 'user-read-email'],
  BASE_URL: 'https://api.spotify.com/v1',
  AUTH_URL: 'https://accounts.spotify.com/authorize',
} as const

export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 50,
  DEFAULT_PAGE: 1,
} as const

export const POPULARITY_THRESHOLDS = {
  HIGH: 80,
  MEDIUM: 60,
  LOW: 40,
} as const

export const FOLLOWER_THRESHOLDS = {
  MILLION: 1000000,
  THOUSAND: 1000,
} as const

export const UI_CONSTANTS = {
  MAX_GENRES_DISPLAY: 3,
  SKELETON_ITEMS: 8,
  IMAGE_PLACEHOLDER: '/placeholder-artist.jpg',
} as const
