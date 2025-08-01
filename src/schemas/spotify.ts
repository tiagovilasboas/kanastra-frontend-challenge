import { z } from 'zod'

// Base schemas
export const SpotifyImageSchema = z.object({
  url: z.string().url(),
  height: z.number().positive(),
  width: z.number().positive(),
})

export const SpotifyArtistSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  images: z.array(SpotifyImageSchema),
  popularity: z.number().min(0).max(100),
  followers: z.object({
    total: z.number().min(0),
  }),
  genres: z.array(z.string()),
})

export const SpotifyAlbumSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  images: z.array(SpotifyImageSchema),
  release_date: z.string(),
  total_tracks: z.number().positive(),
  album_type: z.string(),
  artists: z.array(SpotifyArtistSchema),
})

export const SpotifyTrackSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  duration_ms: z.number().positive(),
  track_number: z.number().positive(),
  disc_number: z.number().positive(),
  explicit: z.boolean(),
  popularity: z.number().min(0).max(100),
  artists: z.array(SpotifyArtistSchema),
  album: SpotifyAlbumSchema,
})

// Response schemas
export const SpotifySearchResponseSchema = z.object({
  artists: z.object({
    items: z.array(SpotifyArtistSchema),
    total: z.number().min(0),
    limit: z.number().positive(),
    offset: z.number().min(0),
    next: z.string().nullable(),
    previous: z.string().nullable(),
  }),
})

export const SpotifyArtistTopTracksResponseSchema = z.object({
  tracks: z.array(SpotifyTrackSchema),
})

export const SpotifyArtistAlbumsResponseSchema = z.object({
  items: z.array(SpotifyAlbumSchema),
  total: z.number().min(0),
  limit: z.number().positive(),
  offset: z.number().min(0),
  next: z.string().nullable(),
  previous: z.string().nullable(),
})

// Error schema
export const SpotifyErrorSchema = z.object({
  error: z.object({
    status: z.number(),
    message: z.string(),
  }),
})

// Parameter schemas
export const SearchParamsSchema = z.object({
  query: z.string().min(1),
  type: z.enum(['artist', 'track', 'album']),
  limit: z.number().min(1).max(50).optional(),
  offset: z.number().min(0).optional(),
})

export const AlbumParamsSchema = z.object({
  limit: z.number().min(1).max(50).optional(),
  offset: z.number().min(0).optional(),
  include_groups: z.string().optional(),
})

// Type exports
export type SpotifyImage = z.infer<typeof SpotifyImageSchema>
export type SpotifyArtist = z.infer<typeof SpotifyArtistSchema>
export type SpotifyAlbum = z.infer<typeof SpotifyAlbumSchema>
export type SpotifyTrack = z.infer<typeof SpotifyTrackSchema>
export type SpotifySearchResponse = z.infer<typeof SpotifySearchResponseSchema>
export type SpotifyArtistTopTracksResponse = z.infer<
  typeof SpotifyArtistTopTracksResponseSchema
>
export type SpotifyArtistAlbumsResponse = z.infer<
  typeof SpotifyArtistAlbumsResponseSchema
>
export type SpotifyError = z.infer<typeof SpotifyErrorSchema>
export type SearchParams = z.infer<typeof SearchParamsSchema>
export type AlbumParams = z.infer<typeof AlbumParamsSchema>
