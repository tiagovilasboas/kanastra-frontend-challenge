import { useQuery } from '@tanstack/react-query'

import { cache, queryKeys } from '@/config/react-query'
import { spotifyRepository } from '@/repositories'
import { SpotifyArtist } from '@/schemas/spotify'

import { useSpotifyAuth } from './useSpotifyAuth'

interface UsePopularArtistsParams {
  limit?: number
  enabled?: boolean
}

interface UsePopularArtistsReturn {
  artists: SpotifyArtist[]
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

// Lista de artistas populares conhecidos para buscar detalhes
// This is a more realistic approach since Spotify API doesn't provide trending
const POPULAR_ARTIST_IDS = [
  '1uNFoZAHBGtllmzznpCI3s', // Justin Bieber
  '6eUKZXaKkcviH0Ku9w2n3V', // Ed Sheeran
  '0TnOYISbd1XYRBk9myaseg', // Michael Jackson
  '3HqSLMAZ3g3d5poNaI7GOU', // Ariana Grande
  '4gzpq5DPGxSnKTe4SA8HAU', // Coldplay
  '0du5cEVh5yTK9QJze8zA0C', // Bruno Mars
  '1vCWHaC5f2uS3yhpwWbIA6', // Avicii
  '5K4W6rqBFWDnAN6FQUkS6x', // Kanye West
  '7dGJo4pcD2V6oG8kP0tJRR', // Eminem
  '4YRxDV8wJFPHPTeXepOstw', // Drake
  '1mYsTxnqsietFxj1OgoGbG', // Rihanna
  '5f4QpKfy7ptCHwTqspnSJI', // Lady Gaga
  '2CIMQHirSU0MQqyYHq0eOx', // Deadmau5
  '0TnOYISbd1XYRBk9myaseg', // Michael Jackson
  '3HqSLMAZ3g3d5poNaI7GOU', // Ariana Grande
]

export function usePopularArtists({
  limit = 6,
  enabled = true,
}: UsePopularArtistsParams = {}): UsePopularArtistsReturn {
  const { checkAuthError } = useSpotifyAuth()

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.artists.popular(limit),
    queryFn: async () => {
      // Demo data for when Spotify API is not available
      const demoArtists: SpotifyArtist[] = [
        {
          id: 'demo-1',
          name: 'Justin Bieber',
          images: [
            {
              url: 'https://via.placeholder.com/300x300/1DB954/ffffff?text=JB',
              height: 300,
              width: 300,
            },
          ],
          popularity: 95,
          genres: ['pop', 'r&b'],
          followers: {
            href: null,
            total: 50000000,
          },
          external_urls: { spotify: '#' },
          href: '#',
          type: 'artist',
          uri: 'spotify:artist:demo-1',
        },
        {
          id: 'demo-2',
          name: 'Ed Sheeran',
          images: [
            {
              url: 'https://via.placeholder.com/300x300/1DB954/ffffff?text=ES',
              height: 300,
              width: 300,
            },
          ],
          popularity: 92,
          genres: ['pop', 'folk'],
          followers: {
            href: null,
            total: 45000000,
          },
          external_urls: { spotify: '#' },
          href: '#',
          type: 'artist',
          uri: 'spotify:artist:demo-2',
        },
        {
          id: 'demo-3',
          name: 'Ariana Grande',
          images: [
            {
              url: 'https://via.placeholder.com/300x300/1DB954/ffffff?text=AG',
              height: 300,
              width: 300,
            },
          ],
          popularity: 90,
          genres: ['pop', 'r&b'],
          followers: {
            href: null,
            total: 40000000,
          },
          external_urls: { spotify: '#' },
          href: '#',
          type: 'artist',
          uri: 'spotify:artist:demo-3',
        },
      ]

      try {
        const artists: SpotifyArtist[] = []

        // Buscar detalhes de artistas populares conhecidos
        const artistIdsToFetch = POPULAR_ARTIST_IDS.slice(0, limit)

        for (const artistId of artistIdsToFetch) {
          try {
            const artist = await spotifyRepository.getArtistDetails(artistId)
            if (artist && artist.popularity && artist.popularity > 30) {
              artists.push(artist)
            }
          } catch (error) {
            console.warn(`Failed to fetch artist ${artistId}:`, error)

            // Check if it's an auth error and handle it gracefully
            if (checkAuthError(error)) {
              // Return demo data instead of empty results
              return demoArtists.slice(0, limit)
            }

            // Continuar com outros artistas mesmo se um falhar
          }
        }

        // Ordenar por popularidade (mais alta primeiro)
        const sortedArtists = artists
          .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
          .slice(0, limit)

        // Return demo data if no real data was fetched
        return sortedArtists.length > 0
          ? sortedArtists
          : demoArtists.slice(0, limit)
      } catch (error) {
        console.warn('Failed to fetch artists, returning demo data:', error)
        return demoArtists.slice(0, limit)
      }
    },
    enabled: enabled, // Enable even without valid token for demo mode
    staleTime: cache.stale.OCCASIONAL, // Popular artists change occasionally
    gcTime: cache.times.MEDIUM, // Keep in memory for medium time
    retry: cache.retry.IMPORTANT.retry,
    retryDelay: cache.retry.IMPORTANT.retryDelay,
  })

  return {
    artists: (data as SpotifyArtist[]) || [],
    isLoading,
    error: error as Error | null,
    refetch,
  }
}
