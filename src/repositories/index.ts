export * from './base/BaseRepository'

export type { SpotifyRepository } from './spotify/SpotifyRepository'
export { SpotifyRepositoryImpl } from './spotify/SpotifyRepositoryImpl'
export * from './spotify/types'

import { SpotifyRepository } from './spotify/SpotifyRepository'
import { SpotifyRepositoryImpl } from './spotify/SpotifyRepositoryImpl'
import { SpotifyConfig } from './spotify/types'

export const createSpotifyRepository = (config: SpotifyConfig): SpotifyRepository => {
  return new SpotifyRepositoryImpl(config)
}

export const defaultSpotifyConfig: SpotifyConfig = {
  clientId: 'c6c3457349a542d59b8e0dcc39c4047a',
  redirectUri: 'https://localhost:5173/callback',
  scopes: ['user-read-private', 'user-read-email'],
  baseUrl: 'https://api.spotify.com/v1',
}

export const spotifyRepository = createSpotifyRepository(defaultSpotifyConfig) 