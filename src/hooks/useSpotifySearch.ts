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
  // Album pagination
  albumsPage: number
  albumsTotalPages: number
  albumsPerPage: number
  setAlbumsPage: (page: number) => void
  loadAlbumsPage: (page: number) => void
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

  // Album pagination state
  const [albumsPage, setAlbumsPage] = useState(1)
  const [albumsTotalPages, setAlbumsTotalPages] = useState(0)
  const [albumsPerPage] = useState(20)
  const [albumsTotalResults, setAlbumsTotalResults] = useState(0)

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
        setAlbumsPage(1) // Reset album pagination
        setError(null)
      }, 500)
    } else {
      setDebouncedQuery('')
      setArtists([])
      setTracks([])
      setAlbums([])
      setPage(0)
      setAlbumsPage(1)
      setHasMore(false)
      setError(null)
    }
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [searchQuery])

  // Fetch results when debouncedQuery or page changes (for artists and tracks)
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
        currentAlbums: Array.isArray(albums) ? albums.length : 0,
      })

      try {
        // Check for token in both cookie and localStorage
        const token =
          CookieManager.getAccessToken() ||
          localStorage.getItem('spotify_token')
        let artistsResponse, tracksResponse

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
          // Search for artists and tracks in parallel (albums will be handled separately)
          const [artistsRes, tracksRes] = await Promise.all([
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
          ])
          artistsResponse = artistsRes
          tracksResponse = tracksRes
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
          // Search for artists and tracks in parallel
          const [artistsRes, tracksRes] = await Promise.all([
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
          ])
          artistsResponse = artistsRes
          tracksResponse = tracksRes
        }

        if (cancelled) return

        const newArtists = artistsResponse?.artists || []
        const newTracks = tracksResponse?.tracks || []

        // Update state based on page
        if (page === 0) {
          setArtists(newArtists)
          setTracks(newTracks)
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
        }

        // Calculate total results and hasMore
        const totalArtists = artistsResponse?.total || 0
        const totalTracks = tracksResponse?.total || 0
        const total = totalArtists + totalTracks + albumsTotalResults
        setTotalResults(total)

        const hasMoreArtists =
          artistsResponse?.offset + artistsResponse?.limit < totalArtists
        const hasMoreTracks =
          tracksResponse?.offset + tracksResponse?.limit < totalTracks
        setHasMore(hasMoreArtists || hasMoreTracks)

        setIsLoading(false)
        setIsLoadingMore(false)
        setError(null)

        logger.debug('Search results updated', {
          newArtists: newArtists.length,
          newTracks: newTracks.length,
          totalArtists,
          totalTracks,
          total,
          hasMore: hasMoreArtists || hasMoreTracks,
        })
      } catch (err) {
        if (cancelled) return
        const errorMessage =
          err instanceof Error ? err.message : 'Search failed'
        logger.error('Search error', err)
        setError(errorMessage)
        setIsLoading(false)
        setIsLoadingMore(false)
      }
    }

    fetchResults()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    debouncedQuery,
    page,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    albumsTotalResults || 0,
    limit,
    artists.length,
    tracks.length,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    Array.isArray(albums) ? albums.length : 0,
  ])

  // Fetch albums with pagination
  const loadAlbumsPage = useCallback(
    async (pageNumber: number) => {
      if (!debouncedQuery.trim()) return

      setIsLoadingMore(true)
      setError(null)

      try {
        const token =
          CookieManager.getAccessToken() ||
          localStorage.getItem('spotify_token')
        const offset = (pageNumber - 1) * albumsPerPage

        logger.debug('Loading albums page', {
          page: pageNumber,
          offset,
          limit: albumsPerPage,
          query: debouncedQuery,
        })

        let albumsResponse
        if (token) {
          albumsResponse = await spotifyRepository.searchAdvanced(
            debouncedQuery,
            'album',
            undefined,
            albumsPerPage,
            offset,
          )
        } else {
          await spotifyRepository.getClientToken()
          albumsResponse = await spotifyRepository.searchAdvanced(
            debouncedQuery,
            'album',
            undefined,
            albumsPerPage,
            offset,
          )
        }

        const newAlbums = albumsResponse?.albums || []
        setAlbums(newAlbums)
        setAlbumsTotalResults(albumsResponse?.total || 0)
        setAlbumsTotalPages(
          Math.ceil((albumsResponse?.total || 0) / albumsPerPage),
        )
        setAlbumsPage(pageNumber)

        // Update total results
        const totalArtists = artists.length
        const totalTracks = tracks.length
        const total = totalArtists + totalTracks + (albumsResponse?.total || 0)
        setTotalResults(total)

        setIsLoadingMore(false)
        setError(null)

        logger.debug('Albums page loaded', {
          page: pageNumber,
          albums: newAlbums.length,
          total: albumsResponse?.total || 0,
          totalPages: Math.ceil((albumsResponse?.total || 0) / albumsPerPage),
        })
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load albums'
        logger.error('Albums loading error', err)
        setError(errorMessage)
        setIsLoadingMore(false)
      }
    },
    [debouncedQuery, albumsPerPage, artists.length, tracks.length],
  )

  // Load initial albums page when query changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      loadAlbumsPage(1)
    }
  }, [debouncedQuery, loadAlbumsPage])

  const clearSearch = useCallback(() => {
    setDebouncedQuery('')
    setArtists([])
    setTracks([])
    setAlbums([])
    setPage(0)
    setAlbumsPage(1)
    setHasMore(false)
    setError(null)
    setTotalResults(0)
    setAlbumsTotalPages(0)
    setAlbumsTotalResults(0)
  }, [])

  const loadMore = useCallback(() => {
    if (!hasMore || isLoadingMore) return
    setPage((prev) => prev + 1)
    setIsLoadingMore(true)
  }, [hasMore, isLoadingMore])

  // Combine all results for the searchResults array
  const searchResults = [
    ...artists,
    ...tracks,
    ...(Array.isArray(albums) ? albums : []),
  ]

  return {
    isLoading,
    isLoadingMore,
    error,
    searchResults,
    artists,
    tracks,
    albums: Array.isArray(albums) ? albums : [],
    genres: separateResults(
      artists,
      tracks,
      Array.isArray(albums) ? albums : [],
      debouncedQuery,
    ).genres,
    clearSearch,
    hasMore,
    loadMore,
    totalResults,
    // Album pagination
    albumsPage,
    albumsTotalPages,
    albumsPerPage,
    setAlbumsPage,
    loadAlbumsPage,
  }
}
