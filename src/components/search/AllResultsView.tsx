import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import {
  AlbumsSection,
  ArtistsSection,
  AudiobooksSection,
  EpisodesSection,
  PlaylistsSection,
  ShowsSection,
  TracksSection,
} from '@/components/search'
import {
  BestResultCard,
  SearchResultsLayout,
  TracksListSection,
} from '@/components/ui'
import { useSpotifyInfiniteByType } from '@/hooks/useSpotifyInfiniteByType'
import { useSearchStore } from '@/stores/searchStore'
import {
  SpotifyAlbum,
  SpotifyArtist,
  SpotifyAudiobook,
  SpotifyEpisode,
  SpotifyPlaylist,
  SpotifySearchType,
  SpotifyShow,
  SpotifyTrack,
} from '@/types/spotify'

interface AllResultsViewProps {
  market?: string
}

export const AllResultsView: React.FC<AllResultsViewProps> = ({
  market = 'BR',
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { searchQuery } = useSearchStore()

  const handleSectionClick = (type: string) => {
    const queryParams = new URLSearchParams({
      q: searchQuery,
      market: market,
    })
    navigate(`/search/${type}?${queryParams.toString()}`)
  }

  // Hooks para cada seção com pageSize=6
  const artistsQuery = useSpotifyInfiniteByType({
    q: searchQuery,
    type: SpotifySearchType.ARTIST,
    market,
    pageSize: 6,
  })

  const albumsQuery = useSpotifyInfiniteByType({
    q: searchQuery,
    type: SpotifySearchType.ALBUM,
    market,
    pageSize: 6,
  })

  const tracksQuery = useSpotifyInfiniteByType({
    q: searchQuery,
    type: SpotifySearchType.TRACK,
    market,
    pageSize: 6,
  })

  const playlistsQuery = useSpotifyInfiniteByType({
    q: searchQuery,
    type: SpotifySearchType.PLAYLIST,
    market,
    pageSize: 6,
  })

  const showsQuery = useSpotifyInfiniteByType({
    q: searchQuery,
    type: SpotifySearchType.SHOW,
    market,
    pageSize: 6,
  })

  const episodesQuery = useSpotifyInfiniteByType({
    q: searchQuery,
    type: SpotifySearchType.EPISODE,
    market,
    pageSize: 6,
  })

  const audiobooksQuery = useSpotifyInfiniteByType({
    q: searchQuery,
    type: SpotifySearchType.AUDIOBOOK,
    market,
    pageSize: 6,
  })

  // Get best result
  const getBestResult = () => {
    const artists = artistsQuery.flatItems as SpotifyArtist[]
    const albums = albumsQuery.flatItems as SpotifyAlbum[]
    const playlists = playlistsQuery.flatItems as SpotifyPlaylist[]

    // Priorizar playlist se existir
    if (playlists.length > 0) {
      const playlist = playlists[0]
      return {
        imageUrl: playlist.images[0]?.url || '',
        title: playlist.name,
        subtitle: `Playlist • ${playlist.owner.display_name}`,
        type: 'Playlist',
        onClick: () => navigate(`/playlist/${playlist.id}`),
      }
    }

    // Depois artista
    if (artists.length > 0) {
      const artist = artists[0]
      return {
        imageUrl: artist.images[0]?.url || '',
        title: artist.name,
        subtitle: t('search:artist', 'Artista'),
        type: t('search:artist', 'Artista'),
        onClick: () => navigate(`/artist/${artist.id}`),
      }
    }

    // Depois álbum
    if (albums.length > 0) {
      const album = albums[0]
      return {
        imageUrl: album.images[0]?.url || '',
        title: album.name,
        subtitle: album.artists.map((a) => a.name).join(', '),
        type: 'Álbum',
        onClick: () => navigate(`/album/${album.id}`),
      }
    }

    return undefined
  }

  const bestResult = getBestResult()
  const tracks = tracksQuery.flatItems as SpotifyTrack[]

  return (
    <SearchResultsLayout
      bestResult={
        bestResult && (
          <BestResultCard
            imageUrl={bestResult.imageUrl}
            title={bestResult.title}
            subtitle={bestResult.subtitle}
            type={bestResult.type}
            onClick={bestResult.onClick}
          />
        )
      }
      tracksSection={
        tracks.length > 0 && (
          <TracksListSection
            tracks={tracks}
            onTrackClick={(trackId) => {
              // Implementar navegação para a música
              console.log('Track clicked:', trackId)
            }}
          />
        )
      }
    >
      {/* Artists Section */}
      <ArtistsSection
        artists={artistsQuery.flatItems as SpotifyArtist[]}
        isLoading={artistsQuery.isFetching}
        onSectionClick={() => handleSectionClick('artist')}
      />

      {/* Albums Section */}
      <AlbumsSection
        albums={albumsQuery.flatItems as SpotifyAlbum[]}
        isLoading={albumsQuery.isFetching}
        onSectionClick={() => handleSectionClick('album')}
      />

      {/* Tracks Section - Only show if not in top section */}
      {tracks.length === 0 && (
        <TracksSection
          tracks={tracks}
          isLoading={tracksQuery.isFetching}
          onSectionClick={() => handleSectionClick('track')}
        />
      )}

      {/* Playlists Section */}
      <PlaylistsSection
        playlists={playlistsQuery.flatItems as SpotifyPlaylist[]}
        isLoading={playlistsQuery.isFetching}
        onSectionClick={() => handleSectionClick('playlist')}
      />

      {/* Shows Section */}
      <ShowsSection
        shows={showsQuery.flatItems as SpotifyShow[]}
        isLoading={showsQuery.isFetching}
        onSectionClick={() => handleSectionClick('show')}
      />

      {/* Episodes Section */}
      <EpisodesSection
        episodes={episodesQuery.flatItems as SpotifyEpisode[]}
        isLoading={episodesQuery.isFetching}
        onSectionClick={() => handleSectionClick('episode')}
      />

      {/* Audiobooks Section */}
      <AudiobooksSection
        audiobooks={audiobooksQuery.flatItems as SpotifyAudiobook[]}
        isLoading={audiobooksQuery.isFetching}
        onSectionClick={() => handleSectionClick('audiobook')}
      />
    </SearchResultsLayout>
  )
}
