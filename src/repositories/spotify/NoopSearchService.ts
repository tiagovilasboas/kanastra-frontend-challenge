import { NotConfiguredError } from './NoopAuthService'

export class NoopSearchService {
  setAccessToken(): void {
    throw new NotConfiguredError('SpotifySearchService')
  }

  setClientToken(): void {
    throw new NotConfiguredError('SpotifySearchService')
  }

  hasAccessToken(): boolean {
    return false
  }

  hasClientToken(): boolean {
    return false
  }

  async searchAdvanced(): Promise<never> {
    throw new NotConfiguredError('SpotifySearchService')
  }

  async searchMultipleTypes(): Promise<never> {
    throw new NotConfiguredError('SpotifySearchService')
  }

  async searchArtists(): Promise<never> {
    throw new NotConfiguredError('SpotifySearchService')
  }

  async searchAlbums(): Promise<never> {
    throw new NotConfiguredError('SpotifySearchService')
  }

  async searchTracks(): Promise<never> {
    throw new NotConfiguredError('SpotifySearchService')
  }

  async searchPlaylists(): Promise<never> {
    throw new NotConfiguredError('SpotifySearchService')
  }

  async searchShows(): Promise<never> {
    throw new NotConfiguredError('SpotifySearchService')
  }

  async searchEpisodes(): Promise<never> {
    throw new NotConfiguredError('SpotifySearchService')
  }

  async searchAudiobooks(): Promise<never> {
    throw new NotConfiguredError('SpotifySearchService')
  }

  async searchArtistsPublic(): Promise<never> {
    throw new NotConfiguredError('SpotifySearchService')
  }

  async getAvailableGenres(): Promise<never> {
    throw new NotConfiguredError('SpotifySearchService')
  }

  async getArtistDetails(): Promise<never> {
    throw new NotConfiguredError('SpotifySearchService')
  }

  async getArtistTopTracks(): Promise<never> {
    throw new NotConfiguredError('SpotifySearchService')
  }

  async getArtistAlbums(): Promise<never> {
    throw new NotConfiguredError('SpotifySearchService')
  }

  async getTrackByISRC(): Promise<never> {
    throw new NotConfiguredError('SpotifySearchService')
  }

  async getAlbumByUPC(): Promise<never> {
    throw new NotConfiguredError('SpotifySearchService')
  }
}
