import { useCallback, useEffect, useRef, useState } from 'react'

import { spotifyRepository } from '@/repositories'
import { useSearchStore } from '@/stores/searchStore'
import { SpotifyAlbum, SpotifyArtist, SpotifyTrack } from '@/types/spotify'
import { CookieManager } from '@/utils/cookies'
import { logger } from '@/utils/logger'

interface UseSpotifySearchReturn {
  isLoading: boolean
  isLoadingMore: boolean
  error: string | null
  searchResults: (SpotifyArtist | SpotifyTrack | SpotifyAlbum)[]
  artists: SpotifyArtist[]
  tracks: SpotifyTrack[]
  albums: SpotifyAlbum[]
  genres: string[]
  clearSearch: () => void
  hasMore: boolean
  loadMore: () => void
  totalResults: number
}

// Helper function to extract unique genres from artists
const extractGenresFromArtists = (artists: SpotifyArtist[]): string[] => {
  const allGenres = artists.flatMap((artist) => artist.genres || [])
  const uniqueGenres = [...new Set(allGenres)]
  return uniqueGenres.sort()
}

// Helper function to separate results by type
const separateResults = (
  artists: SpotifyArtist[],
  tracks: SpotifyTrack[],
  albums: SpotifyAlbum[],
  query: string,
) => {
  const queryLower = query.toLowerCase()

  // Extract all genres from artists
  const allGenres = extractGenresFromArtists(artists)

  // Filter genres that match the query
  const matchingGenres = allGenres.filter((genre) =>
    genre.toLowerCase().includes(queryLower),
  )

  return {
    artists,
    tracks,
    albums,
    genres: matchingGenres,
  }
}

export function useSpotifySearch(): UseSpotifySearchReturn {
  const { searchQuery } = useSearchStore()
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [artists, setArtists] = useState<SpotifyArtist[]>([])
  const [tracks, setTracks] = useState<SpotifyTrack[]>([])
  const [albums, setAlbums] = useState<SpotifyAlbum[]>([])
  const [page, setPage] = useState(0)
  const [limit] = useState(20)
  const [hasMore, setHasMore] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [totalResults, setTotalResults] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // Debounce effect
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    if (searchQuery.trim()) {
      debounceRef.current = setTimeout(() => {
        logger.debug('Debounced search triggered', { searchQuery })
        setDebouncedQuery(searchQuery)
        setPage(0)
        setError(null)
      }, 500)
    } else {
      setDebouncedQuery('')
      setArtists([])
      setTracks([])
      setAlbums([])
      setPage(0)
      setHasMore(false)
      setError(null)
    }
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [searchQuery])

  // Fetch results when debouncedQuery or page changes
  useEffect(() => {
    let cancelled = false
    async function fetchResults() {
      if (!debouncedQuery.trim()) {
        setArtists([])
        setTracks([])
        setAlbums([])
        setHasMore(false)
        setIsLoading(false)
        setTotalResults(0)
        setError(null)
        return
      }

      if (page === 0) {
        setIsLoading(true)
        setError(null)
      }

      const offset = page * limit
      logger.debug('Fetching search results', {
        query: debouncedQuery,
        page,
        limit,
        offset,
        currentArtists: artists.length,
        currentTracks: tracks.length,
        currentAlbums: albums.length,
      })

      try {
        // Check for token in both cookie and localStorage
        const token =
          CookieManager.getAccessToken() ||
          localStorage.getItem('spotify_token')
        let artistsResponse, tracksResponse, albumsResponse

        logger.debug('Search attempt', {
          hasUserToken: !!token,
          hasCookieToken: !!CookieManager.getAccessToken(),
          hasLocalStorageToken: !!localStorage.getItem('spotify_token'),
          query: debouncedQuery,
          page,
          limit,
          offset,
        })

        if (token) {
          logger.debug('Using user token for search')
          // Search for all types in parallel
          const [artistsRes, tracksRes, albumsRes] = await Promise.all([
            spotifyRepository.searchAdvanced(
              debouncedQuery,
              'artist',
              undefined,
              limit,
              offset,
            ),
            spotifyRepository.searchAdvanced(
              debouncedQuery,
              'track',
              undefined,
              limit,
              offset,
            ),
            spotifyRepository.searchAdvanced(
              debouncedQuery,
              'album',
              undefined,
              limit,
              offset,
            ),
          ])
          artistsResponse = artistsRes
          tracksResponse = tracksRes
          albumsResponse = albumsRes
        } else {
          logger.debug('No user token, getting client token')
          try {
            await spotifyRepository.getClientToken()
            logger.debug('Client token obtained successfully')
          } catch (tokenError) {
            logger.error('Failed to get client token', tokenError)
            throw tokenError
          }

          logger.debug('Using client token for search')
          // Search for all types in parallel
          const [artistsRes, tracksRes, albumsRes] = await Promise.all([
            spotifyRepository.searchAdvanced(
              debouncedQuery,
              'artist',
              undefined,
              limit,
              offset,
            ),
            spotifyRepository.searchAdvanced(
              debouncedQuery,
              'track',
              undefined,
              limit,
              offset,
            ),
            spotifyRepository.searchAdvanced(
              debouncedQuery,
              'album',
              undefined,
              limit,
              offset,
            ),
          ])
          artistsResponse = artistsRes
          tracksResponse = tracksRes
          albumsResponse = albumsRes
        }

        if (cancelled) return

        const newArtists = artistsResponse.artists?.items || []
        const newTracks = tracksResponse.tracks?.items || []
        const newAlbums = albumsResponse.albums?.items || []

        const totalArtists = artistsResponse.artists?.total || 0
        const totalTracks = tracksResponse.tracks?.total || 0
        const totalAlbums = albumsResponse.albums?.total || 0
        const total = totalArtists + totalTracks + totalAlbums

        logger.debug('Search results fetched successfully', {
          query: debouncedQuery,
          page,
          offset,
          newArtistsCount: newArtists.length,
          newTracksCount: newTracks.length,
          newAlbumsCount: newAlbums.length,
          totalResults: total,
          hasMore:
            offset +
              Math.max(newArtists.length, newTracks.length, newAlbums.length) <
            Math.max(totalArtists, totalTracks, totalAlbums),
        })

        setTotalResults(total)
        const newHasMore =
          offset +
            Math.max(newArtists.length, newTracks.length, newAlbums.length) <
          Math.max(totalArtists, totalTracks, totalAlbums)
        setHasMore(newHasMore)

        setError(null)

        if (page === 0) {
          setArtists(newArtists)
          setTracks(newTracks)
          setAlbums(newAlbums)
        } else {
          setArtists((prev) => {
            const existingIds = new Set(prev.map((artist) => artist.id))
            const uniqueNewArtists = newArtists.filter(
              (artist: SpotifyArtist) => !existingIds.has(artist.id),
            )
            return [...prev, ...uniqueNewArtists]
          })
          setTracks((prev) => {
            const existingIds = new Set(prev.map((track) => track.id))
            const uniqueNewTracks = newTracks.filter(
              (track: SpotifyTrack) => !existingIds.has(track.id),
            )
            return [...prev, ...uniqueNewTracks]
          })
          setAlbums((prev) => {
            const existingIds = new Set(prev.map((album) => album.id))
            const uniqueNewAlbums = newAlbums.filter(
              (album: SpotifyAlbum) => !existingIds.has(album.id),
            )
            return [...prev, ...uniqueNewAlbums]
          })
        }

        // Reset loading state if no more results
        if (!newHasMore) {
          setIsLoadingMore(false)
        }
      } catch (error) {
        logger.error('Search failed', error)

        if (cancelled) return

        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error occurred'
        setError(errorMessage)

        // Clear results on error
        if (page === 0) {
          setArtists([])
          setTracks([])
          setAlbums([])
          setTotalResults(0)
          setHasMore(false)
        }
      } finally {
        setIsLoading(false)
        setIsLoadingMore(false)
      }
    }
    fetchResults()
    return () => {
      cancelled = true
    }
  }, [
    debouncedQuery,
    page,
    limit,
    artists.length,
    tracks.length,
    albums.length,
  ])

  const clearSearch = useCallback(() => {
    logger.debug('clearSearch called')
    setArtists([])
    setTracks([])
    setAlbums([])
    setPage(0)
    setHasMore(false)
    setTotalResults(0)
    setIsLoadingMore(false)
    setError(null)
  }, [])

  const loadMore = useCallback(() => {
    if (!hasMore || isLoadingMore) return
    logger.debug('Loading more results', {
      currentPage: page,
      currentArtists: artists.length,
      currentTracks: tracks.length,
      currentAlbums: albums.length,
      totalResults,
      hasMore,
    })
    setIsLoadingMore(true)
    setPage((prev) => prev + 1)
  }, [
    hasMore,
    isLoadingMore,
    page,
    artists.length,
    tracks.length,
    albums.length,
    totalResults,
  ])

  // Separate results into artists, tracks, albums, and genres
  const { genres } = separateResults(artists, tracks, albums, debouncedQuery)

  // Combine all results for display
  const searchResults = [...artists, ...tracks, ...albums]

  // Debug logs
  logger.debug('Search results separated', {
    totalResults: searchResults.length,
    artistsCount: artists.length,
    tracksCount: tracks.length,
    albumsCount: albums.length,
    genresCount: genres.length,
    hasMore,
    query: debouncedQuery,
  })

  return {
    isLoading,
    isLoadingMore,
    error,
    searchResults,
    artists,
    tracks,
    albums,
    genres,
    clearSearch,
    hasMore,
    loadMore,
    totalResults,
  }
}
