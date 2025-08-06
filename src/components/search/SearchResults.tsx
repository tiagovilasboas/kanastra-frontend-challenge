import React from 'react'

import {
  AlbumsSection,
  ArtistsSection,
  AudiobooksSection,
  EpisodesSection,
  PlaylistsSection,
  ShowsSection,
  TracksSection,
} from '@/components/search'
import { SearchCategory } from '@/components/search/SearchFilters'
import { useSpotifySearch } from '@/hooks/useSpotifySearch'
import { SpotifySearchType } from '@/types/spotify'

interface SearchResultsProps {
  selectedCategories: SearchCategory[]
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  selectedCategories,
}) => {
  const { results, searchState } = useSpotifySearch()

  console.log('SearchResults - results:', results)
  console.log('SearchResults - searchState:', searchState)
  console.log('SearchResults - selectedCategories:', selectedCategories)

  // Determine which sections to show based on selected categories
  const showArtists =
    selectedCategories.includes('all') ||
    selectedCategories.includes(SpotifySearchType.ARTIST)
  const showAlbums =
    selectedCategories.includes('all') ||
    selectedCategories.includes(SpotifySearchType.ALBUM)
  const showTracks =
    selectedCategories.includes('all') ||
    selectedCategories.includes(SpotifySearchType.TRACK)
  const showPlaylists =
    selectedCategories.includes('all') ||
    selectedCategories.includes(SpotifySearchType.PLAYLIST)
  const showShows =
    selectedCategories.includes('all') ||
    selectedCategories.includes(SpotifySearchType.SHOW)
  const showEpisodes =
    selectedCategories.includes('all') ||
    selectedCategories.includes(SpotifySearchType.EPISODE)
  const showAudiobooks =
    selectedCategories.includes('all') ||
    selectedCategories.includes(SpotifySearchType.AUDIOBOOK)

  console.log(
    'SearchResults - showArtists:',
    showArtists,
    'artists.items:',
    results.artists.items,
  )
  console.log(
    'SearchResults - showAlbums:',
    showAlbums,
    'albums.items:',
    results.albums.items,
  )
  console.log(
    'SearchResults - showTracks:',
    showTracks,
    'tracks.items:',
    results.tracks.items,
  )
  console.log(
    'SearchResults - showPlaylists:',
    showPlaylists,
    'playlists.items:',
    results.playlists.items,
  )
  console.log(
    'SearchResults - showShows:',
    showShows,
    'shows.items:',
    results.shows.items,
  )
  console.log(
    'SearchResults - showEpisodes:',
    showEpisodes,
    'episodes.items:',
    results.episodes.items,
  )
  console.log(
    'SearchResults - showAudiobooks:',
    showAudiobooks,
    'audiobooks.items:',
    results.audiobooks.items,
  )

  return (
    <div className="space-y-8">
      {showArtists && (
        <ArtistsSection
          artists={results.artists.items}
          isLoading={searchState.isLoading}
        />
      )}

      {showAlbums && (
        <AlbumsSection
          albums={results.albums.items}
          isLoading={searchState.isLoading}
        />
      )}

      {showTracks && (
        <TracksSection
          tracks={results.tracks.items}
          isLoading={searchState.isLoading}
        />
      )}

      {showPlaylists && (
        <PlaylistsSection
          playlists={results.playlists.items}
          isLoading={searchState.isLoading}
        />
      )}

      {showShows && (
        <ShowsSection
          shows={results.shows.items}
          isLoading={searchState.isLoading}
        />
      )}

      {showEpisodes && (
        <EpisodesSection
          episodes={results.episodes.items}
          isLoading={searchState.isLoading}
        />
      )}

      {showAudiobooks && (
        <AudiobooksSection
          audiobooks={results.audiobooks.items}
          isLoading={searchState.isLoading}
        />
      )}
    </div>
  )
}
