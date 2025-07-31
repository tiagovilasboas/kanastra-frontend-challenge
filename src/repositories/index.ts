import { SpotifyRepository } from './spotify/SpotifyRepository'

export * from './base/BaseRepository'
export type { SpotifyConfig } from './spotify/SpotifyRepository'
export { SpotifyRepository } from './spotify/SpotifyRepository'

const defaultConfig = {
  clientId: 'c6c3457349a542d59b8e0dcc39c4047a',
  redirectUri: 'https://localhost:5173/callback',
  scopes: ['user-read-private', 'user-read-email'],
  baseUrl: 'https://api.spotify.com/v1',
}

export const spotifyRepository = new SpotifyRepository(defaultConfig) 