import {
  SpotifyAlbum,
  SpotifyArtist,
  SpotifyAudiobook,
  SpotifyEpisode,
  SpotifyPlaylist,
  SpotifyShow,
  SpotifyTrack,
} from '@/types/spotify'
import { getSpotifyImageUrls } from '@/utils/imageOptimization'

/**
 * DTOs (Data Transfer Objects) para representar dados da aplicação
 * independentemente das estruturas do Spotify SDK
 */

export interface ArtistDTO {
  id: string
  name: string
  imageUrl?: string
  imageUrls?: {
    thumbnail?: string
    card?: string
    header?: string
    list?: string
  }
  popularity?: number
  followersCount: number
  genres: string[]
  spotifyUrl?: string
}

export interface AlbumDTO {
  id: string
  name: string
  imageUrl?: string
  releaseDate: string
  totalTracks: number
  albumType: string
  artists: Array<{ id: string; name: string }>
  spotifyUrl?: string
}

export interface TrackDTO {
  id: string
  name: string
  imageUrl?: string
  duration: number
  explicit: boolean
  popularity?: number
  album: { id: string; name: string; imageUrl?: string }
  artists: Array<{ id: string; name: string }>
  spotifyUrl?: string
}

export interface PlaylistDTO {
  id: string
  name: string
  description: string
  imageUrl?: string
  owner: { id: string; name: string }
  isPublic: boolean
  isCollaborative: boolean
  tracksCount: number
  spotifyUrl?: string
}

export interface ShowDTO {
  id: string
  name: string
  description: string
  imageUrl?: string
  publisher: string
  totalEpisodes: number
  explicit: boolean
  spotifyUrl?: string
}

export interface EpisodeDTO {
  id: string
  name: string
  description: string
  imageUrl?: string
  duration: number
  releaseDate: string
  explicit: boolean
  show: { id: string; name: string }
  spotifyUrl?: string
}

export interface AudiobookDTO {
  id: string
  name: string
  description: string
  imageUrl?: string
  authors: Array<{ name: string }>
  narrators: Array<{ name: string }>
  publisher: string
  totalChapters: number
  explicit: boolean
  spotifyUrl?: string
}

/**
 * Mappers para converter estruturas do Spotify SDK para DTOs da aplicação
 */
export class SpotifyMapper {
  /**
   * Converte SpotifyArtist para ArtistDTO
   */
  static toArtistDTO(artist: SpotifyArtist): ArtistDTO {
    const imageUrls = getSpotifyImageUrls(artist.images)
    return {
      id: artist.id,
      name: artist.name,
      imageUrl: artist.images?.[0]?.url, // Mantém compatibilidade
      imageUrls, // URLs otimizadas por contexto
      popularity: artist.popularity,
      followersCount: artist.followers?.total || 0,
      genres: artist.genres || [],
      spotifyUrl: artist.external_urls?.spotify,
    }
  }

  /**
   * Converte SpotifyAlbum para AlbumDTO
   */
  static toAlbumDTO(album: SpotifyAlbum): AlbumDTO {
    return {
      id: album.id,
      name: album.name,
      imageUrl: album.images?.[0]?.url,
      releaseDate: album.release_date,
      totalTracks: album.total_tracks,
      albumType: album.album_type,
      artists:
        album.artists?.map((artist) => ({
          id: artist.id,
          name: artist.name,
        })) || [],
      spotifyUrl: album.external_urls?.spotify,
    }
  }

  /**
   * Converte SpotifyTrack para TrackDTO
   */
  static toTrackDTO(track: SpotifyTrack): TrackDTO {
    return {
      id: track.id,
      name: track.name,
      imageUrl: track.album?.images?.[0]?.url,
      duration: track.duration_ms,
      explicit: track.explicit,
      popularity: track.popularity,
      album: {
        id: track.album?.id || '',
        name: track.album?.name || '',
        imageUrl: track.album?.images?.[0]?.url,
      },
      artists:
        track.artists?.map((artist) => ({
          id: artist.id,
          name: artist.name,
        })) || [],
      spotifyUrl: track.external_urls?.spotify,
    }
  }

  /**
   * Converte SpotifyPlaylist para PlaylistDTO
   */
  static toPlaylistDTO(playlist: SpotifyPlaylist): PlaylistDTO {
    return {
      id: playlist.id,
      name: playlist.name,
      description: playlist.description,
      imageUrl: playlist.images?.[0]?.url,
      owner: {
        id: playlist.owner?.id || '',
        name: playlist.owner?.display_name || '',
      },
      isPublic: playlist.public,
      isCollaborative: playlist.collaborative,
      tracksCount: playlist.tracks?.total || 0,
      spotifyUrl: playlist.external_urls?.spotify,
    }
  }

  /**
   * Converte SpotifyShow para ShowDTO
   */
  static toShowDTO(show: SpotifyShow): ShowDTO {
    return {
      id: show.id,
      name: show.name,
      description: show.description,
      imageUrl: show.images?.[0]?.url,
      publisher: show.publisher,
      totalEpisodes: show.total_episodes,
      explicit: show.explicit,
      spotifyUrl: show.external_urls?.spotify,
    }
  }

  /**
   * Converte SpotifyEpisode para EpisodeDTO
   */
  static toEpisodeDTO(episode: SpotifyEpisode): EpisodeDTO {
    return {
      id: episode.id,
      name: episode.name,
      description: episode.description,
      imageUrl: episode.images?.[0]?.url,
      duration: episode.duration_ms,
      releaseDate: episode.release_date,
      explicit: episode.explicit,
      show: {
        id: episode.show?.id || '',
        name: episode.show?.name || '',
      },
      spotifyUrl: episode.external_urls?.spotify,
    }
  }

  /**
   * Converte SpotifyAudiobook para AudiobookDTO
   */
  static toAudiobookDTO(audiobook: SpotifyAudiobook): AudiobookDTO {
    return {
      id: audiobook.id,
      name: audiobook.name,
      description: audiobook.description,
      imageUrl: audiobook.images?.[0]?.url,
      authors: audiobook.authors || [],
      narrators: audiobook.narrators || [],
      publisher: audiobook.publisher,
      totalChapters: audiobook.total_chapters,
      explicit: audiobook.explicit,
      spotifyUrl: audiobook.external_urls?.spotify,
    }
  }

  /**
   * Converte arrays de itens do Spotify para DTOs
   */
  static toArtistDTOs(artists: SpotifyArtist[]): ArtistDTO[] {
    return artists.map((artist) => this.toArtistDTO(artist))
  }

  static toAlbumDTOs(albums: SpotifyAlbum[]): AlbumDTO[] {
    return albums.map((album) => this.toAlbumDTO(album))
  }

  static toTrackDTOs(tracks: SpotifyTrack[]): TrackDTO[] {
    return tracks.map((track) => this.toTrackDTO(track))
  }

  static toPlaylistDTOs(playlists: SpotifyPlaylist[]): PlaylistDTO[] {
    return playlists.map((playlist) => this.toPlaylistDTO(playlist))
  }

  static toShowDTOs(shows: SpotifyShow[]): ShowDTO[] {
    return shows.map((show) => this.toShowDTO(show))
  }

  static toEpisodeDTOs(episodes: SpotifyEpisode[]): EpisodeDTO[] {
    return episodes.map((episode) => this.toEpisodeDTO(episode))
  }

  static toAudiobookDTOs(audiobooks: SpotifyAudiobook[]): AudiobookDTO[] {
    return audiobooks.map((audiobook) => this.toAudiobookDTO(audiobook))
  }
}
