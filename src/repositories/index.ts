// Export base repository types
export * from './base/BaseRepository'

// Export Spotify repository
export type { SpotifyRepository } from './spotify/SpotifyRepository'
export { SpotifyRepositoryImpl } from './spotify/SpotifyRepositoryImpl'
export * from './spotify/types'

// Repository factory
import { SpotifyRepository } from './spotify/SpotifyRepository'
import { SpotifyRepositoryImpl } from './spotify/SpotifyRepositoryImpl'
import { SpotifyConfig } from './spotify/types'

// Factory function to create Spotify repository
export const createSpotifyRepository = (config: SpotifyConfig): SpotifyRepository => {
  return new SpotifyRepositoryImpl(config)
}

// Default Spotify configuration
export const defaultSpotifyConfig: SpotifyConfig = {
  clientId: 'c6c3457349a542d59b8e0dcc39c4047a',
  redirectUri: 'https://localhost:5173/callback',
  scopes: ['user-read-private', 'user-read-email'],
  baseUrl: 'https://api.spotify.com/v1',
}

// Singleton instance
export const spotifyRepository = createSpotifyRepository(defaultSpotifyConfig) 