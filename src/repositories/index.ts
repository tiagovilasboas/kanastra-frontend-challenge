import { SpotifyRepository } from './spotify/SpotifyRepository'

export * from './base/BaseRepository'
export { SpotifyRepository } from './spotify/SpotifyRepository'

export const spotifyRepository = new SpotifyRepository()
