import { z } from 'zod'

// Base schemas
export const SpotifyImageSchema = z.object({
  url: z.string().url(),
  height: z.number(),
  width: z.number(),
})

export const SpotifyExternalUrlsSchema = z.object({
  spotify: z.string().url(),
})

// Artist schemas
export const SpotifyArtistSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.literal('artist'),
  uri: z.string(),
  href: z.string().url(),
  external_urls: SpotifyExternalUrlsSchema,
  images: z.array(SpotifyImageSchema),
  popularity: z.number().min(0).max(100).optional(), // Optional as it may not be present in all responses
  followers: z.object({
    href: z.string().nullable(),
    total: z.number().min(0),
  }),
  genres: z.array(z.string()),
})

export const SpotifyArtistsResponseSchema = z.object({
  artists: z.object({
    href: z.string().url(),
    items: z.array(SpotifyArtistSchema),
    limit: z.number(),
    next: z.string().nullable(),
    offset: z.number(),
    previous: z.string().nullable(),
    total: z.number(),
  }),
})

// Track schemas
export const SpotifyTrackSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.literal('track'),
  uri: z.string(),
  href: z.string().url(),
  external_urls: SpotifyExternalUrlsSchema,
  popularity: z.number().min(0).max(100).optional(), // Optional as it may not be present in all responses
  duration_ms: z.number(),
  explicit: z.boolean(),
  is_playable: z.boolean().optional(),
  album: z.object({
    id: z.string(),
    name: z.string(),
    type: z.literal('album'),
    uri: z.string(),
    href: z.string().url(),
    external_urls: SpotifyExternalUrlsSchema,
    images: z.array(SpotifyImageSchema),
  }),
  artists: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      type: z.literal('artist'),
      uri: z.string(),
      href: z.string().url(),
      external_urls: SpotifyExternalUrlsSchema,
    }),
  ),
})

export const SpotifyTracksResponseSchema = z.object({
  tracks: z.array(SpotifyTrackSchema),
})

// Album schemas
export const SpotifyAlbumSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.literal('album'),
  uri: z.string(),
  href: z.string().url(),
  external_urls: SpotifyExternalUrlsSchema,
  images: z.array(SpotifyImageSchema),
  release_date: z.string(),
  release_date_precision: z.enum(['year', 'month', 'day']),
  total_tracks: z.number(),
  album_type: z.enum(['album', 'single', 'compilation']),
  artists: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      type: z.literal('artist'),
      uri: z.string(),
      href: z.string().url(),
      external_urls: SpotifyExternalUrlsSchema,
    }),
  ),
  popularity: z.number().min(0).max(100).optional(), // Optional as it may not be present in all responses
})

export const SpotifyAlbumsResponseSchema = z.object({
  items: z.array(SpotifyAlbumSchema),
  total: z.number(),
  limit: z.number(),
  offset: z.number(),
  href: z.string().url(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
})

// Playlist schemas
export const SpotifyPlaylistSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.literal('playlist'),
  uri: z.string(),
  href: z.string().url(),
  external_urls: SpotifyExternalUrlsSchema,
  images: z.array(SpotifyImageSchema),
  description: z.string(),
  collaborative: z.boolean(),
  public: z.boolean(),
  owner: z.object({
    id: z.string(),
    display_name: z.string(),
    type: z.string(),
    uri: z.string(),
    href: z.string().url(),
    external_urls: SpotifyExternalUrlsSchema,
  }),
  tracks: z.object({
    href: z.string().url(),
    total: z.number(),
  }),
  snapshot_id: z.string(),
})

export const SpotifyPlaylistsResponseSchema = z.object({
  playlists: z.object({
    href: z.string().url(),
    items: z.array(SpotifyPlaylistSchema),
    limit: z.number(),
    next: z.string().nullable(),
    offset: z.number(),
    previous: z.string().nullable(),
    total: z.number(),
  }),
})

// Show schemas
export const SpotifyShowSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.literal('show'),
  uri: z.string(),
  href: z.string().url(),
  external_urls: SpotifyExternalUrlsSchema,
  images: z.array(SpotifyImageSchema),
  description: z.string(),
  html_description: z.string(),
  explicit: z.boolean(),
  publisher: z.string(),
  total_episodes: z.number(),
  available_markets: z.array(z.string()),
  languages: z.array(z.string()),
  media_type: z.string(),
  is_externally_hosted: z.boolean(),
})

export const SpotifyShowsResponseSchema = z.object({
  shows: z.object({
    href: z.string().url(),
    items: z.array(SpotifyShowSchema),
    limit: z.number(),
    next: z.string().nullable(),
    offset: z.number(),
    previous: z.string().nullable(),
    total: z.number(),
  }),
})

// Episode schemas
export const SpotifyEpisodeSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.literal('episode'),
  uri: z.string(),
  href: z.string().url(),
  external_urls: SpotifyExternalUrlsSchema,
  images: z.array(SpotifyImageSchema),
  description: z.string(),
  html_description: z.string(),
  duration_ms: z.number(),
  explicit: z.boolean(),
  release_date: z.string(),
  release_date_precision: z.enum(['year', 'month', 'day']),
  audio_preview_url: z.string().nullable(),
  is_playable: z.boolean(),
  language: z.string(),
  languages: z.array(z.string()),
  show: z.object({
    id: z.string(),
    name: z.string(),
    type: z.literal('show'),
    uri: z.string(),
    href: z.string().url(),
    external_urls: SpotifyExternalUrlsSchema,
  }),
})

export const SpotifyEpisodesResponseSchema = z.object({
  episodes: z.object({
    href: z.string().url(),
    items: z.array(SpotifyEpisodeSchema),
    limit: z.number(),
    next: z.string().nullable(),
    offset: z.number(),
    previous: z.string().nullable(),
    total: z.number(),
  }),
})

// Audiobook schemas
export const SpotifyAudiobookSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.literal('audiobook'),
  uri: z.string(),
  href: z.string().url(),
  external_urls: SpotifyExternalUrlsSchema,
  images: z.array(SpotifyImageSchema),
  description: z.string(),
  html_description: z.string(),
  edition: z.string(),
  explicit: z.boolean(),
  authors: z.array(
    z.object({
      name: z.string(),
    }),
  ),
  narrators: z.array(
    z.object({
      name: z.string(),
    }),
  ),
  publisher: z.string(),
  total_chapters: z.number(),
  available_markets: z.array(z.string()),
  languages: z.array(z.string()),
  media_type: z.string(),
})

export const SpotifyAudiobooksResponseSchema = z.object({
  audiobooks: z.object({
    href: z.string().url(),
    items: z.array(SpotifyAudiobookSchema),
    limit: z.number(),
    next: z.string().nullable(),
    offset: z.number(),
    previous: z.string().nullable(),
    total: z.number(),
  }),
})

// Search schemas
export const SpotifySearchResponseSchema = z.object({
  artists: z.object({
    href: z.string().url(),
    items: z.array(SpotifyArtistSchema),
    limit: z.number(),
    next: z.string().nullable(),
    offset: z.number(),
    previous: z.string().nullable(),
    total: z.number(),
  }),
  albums: z.object({
    href: z.string().url(),
    items: z.array(SpotifyAlbumSchema),
    limit: z.number(),
    next: z.string().nullable(),
    offset: z.number(),
    previous: z.string().nullable(),
    total: z.number(),
  }),
  tracks: z.object({
    href: z.string().url(),
    items: z.array(SpotifyTrackSchema),
    limit: z.number(),
    next: z.string().nullable(),
    offset: z.number(),
    previous: z.string().nullable(),
    total: z.number(),
  }),
  playlists: z.object({
    href: z.string().url(),
    items: z.array(SpotifyPlaylistSchema),
    limit: z.number(),
    next: z.string().nullable(),
    offset: z.number(),
    previous: z.string().nullable(),
    total: z.number(),
  }),
  shows: z.object({
    href: z.string().url(),
    items: z.array(SpotifyShowSchema),
    limit: z.number(),
    next: z.string().nullable(),
    offset: z.number(),
    previous: z.string().nullable(),
    total: z.number(),
  }),
  episodes: z.object({
    href: z.string().url(),
    items: z.array(SpotifyEpisodeSchema),
    limit: z.number(),
    next: z.string().nullable(),
    offset: z.number(),
    previous: z.string().nullable(),
    total: z.number(),
  }),
  audiobooks: z.object({
    href: z.string().url(),
    items: z.array(SpotifyAudiobookSchema),
    limit: z.number(),
    next: z.string().nullable(),
    offset: z.number(),
    previous: z.string().nullable(),
    total: z.number(),
  }),
})

// Authentication schemas
export const SpotifyTokenResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.literal('Bearer'),
  expires_in: z.number(),
  refresh_token: z.string().optional(),
  scope: z.string().optional(), // Optional for client credentials flow
})

export const SpotifyErrorResponseSchema = z.object({
  error: z.object({
    status: z.number(),
    message: z.string(),
  }),
})

// Form validation schemas
export const SearchFormSchema = z.object({
  query: z
    .string()
    .min(1, 'Search query is required')
    .max(100, 'Search query too long'),
})

export const ArtistIdSchema = z.object({
  id: z.string().min(1, 'Artist ID is required'),
})

// Type exports
export type SpotifyArtist = z.infer<typeof SpotifyArtistSchema>
export type SpotifyTrack = z.infer<typeof SpotifyTrackSchema>
export type SpotifyAlbum = z.infer<typeof SpotifyAlbumSchema>
export type SpotifyPlaylist = z.infer<typeof SpotifyPlaylistSchema>
export type SpotifyShow = z.infer<typeof SpotifyShowSchema>
export type SpotifyEpisode = z.infer<typeof SpotifyEpisodeSchema>
export type SpotifyAudiobook = z.infer<typeof SpotifyAudiobookSchema>
export type SpotifyImage = z.infer<typeof SpotifyImageSchema>
export type SpotifyTokenResponse = z.infer<typeof SpotifyTokenResponseSchema>
export type SpotifyErrorResponse = z.infer<typeof SpotifyErrorResponseSchema>
export type SearchFormData = z.infer<typeof SearchFormSchema>
export type ArtistIdData = z.infer<typeof ArtistIdSchema>

// Validation functions
export const validateSpotifyArtist = (data: unknown): SpotifyArtist => {
  return SpotifyArtistSchema.parse(data)
}

export const validateSpotifyArtistsResponse = (data: unknown) => {
  return SpotifyArtistsResponseSchema.parse(data)
}

export const validateSpotifyTracksResponse = (data: unknown) => {
  return SpotifyTracksResponseSchema.parse(data)
}

export const validateSpotifyAlbumsResponse = (data: unknown) => {
  return SpotifyAlbumsResponseSchema.parse(data)
}

export const validateSpotifyPlaylistsResponse = (data: unknown) => {
  return SpotifyPlaylistsResponseSchema.parse(data)
}

export const validateSpotifyShowsResponse = (data: unknown) => {
  return SpotifyShowsResponseSchema.parse(data)
}

export const validateSpotifyEpisodesResponse = (data: unknown) => {
  return SpotifyEpisodesResponseSchema.parse(data)
}

export const validateSpotifyAudiobooksResponse = (data: unknown) => {
  return SpotifyAudiobooksResponseSchema.parse(data)
}

export const validateSpotifySearchResponse = (data: unknown) => {
  return SpotifySearchResponseSchema.parse(data)
}

export const validateSpotifyTokenResponse = (
  data: unknown,
): SpotifyTokenResponse => {
  return SpotifyTokenResponseSchema.parse(data)
}

export const validateSearchForm = (data: unknown): SearchFormData => {
  return SearchFormSchema.parse(data)
}

export const validateArtistId = (data: unknown): ArtistIdData => {
  return ArtistIdSchema.parse(data)
}
