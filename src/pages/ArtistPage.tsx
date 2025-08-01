import {
  Alert,
  Badge,
  Divider,
  Grid,
  Group,
  Pagination,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { Container } from '@/components/layout'
import { Button as SpotifyButton, SearchInput } from '@/components/ui'
import { useArtistPage } from '@/hooks/useArtistPage'
import { SpotifyAlbum, SpotifyArtist, SpotifyTrack } from '@/types/spotify'

export default function ArtistPage() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()

  const {
    artist,
    topTracks,
    albums,
    currentPage,
    totalPages,
    isLoadingArtist,
    isLoadingTracks,
    getArtistAlbums,
    handleBackToHome,
  } = useArtistPage(id)

  const [albumFilter, setAlbumFilter] = useState('')
  const itemsPerPage = 20

  const handleAlbumFilter = (query: string) => {
    setAlbumFilter(query)
  }

  const handlePageChange = (page: number) => {
    if (id) {
      getArtistAlbums(id, page, itemsPerPage)
    }
  }

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const formatReleaseDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getArtistImage = (artist: SpotifyArtist) => {
    if (artist.images && artist.images.length > 0) {
      return artist.images[0].url
    }
    return '/placeholder-artist.jpg'
  }

  const getAlbumImage = (album: SpotifyAlbum) => {
    if (album.images && album.images.length > 0) {
      return album.images[0].url
    }
    return '/placeholder-album.jpg'
  }

  // Filtrar álbuns por nome
  const filteredAlbums = albums.filter((album: SpotifyAlbum) =>
    album.name.toLowerCase().includes(albumFilter.toLowerCase()),
  )

  // Loading state
  if (isLoadingArtist) {
    return (
      <Container variant="mobile-first">
        <Stack gap="xl" className="p-xl">
          <Skeleton height={60} width="200px" />
          <Skeleton height={200} radius="50%" width={200} className="mx-auto" />
          <Skeleton height={40} width="300px" className="mx-auto" />
          <Skeleton height={20} width="150px" className="mx-auto" />
          <Divider />
          <Skeleton height={30} width="200px" />
          <Stack gap="md">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} height={60} />
            ))}
          </Stack>
        </Stack>
      </Container>
    )
  }

  // Error state - if artist is null, show error
  if (!artist) {
    return (
      <Container variant="mobile-first">
        <Stack gap="xl" className="p-xl">
          <Alert
            title={t('artist:error')}
            color="red"
            className="alert-spotify alert-error"
          >
            {t('artist:artistNotFound')}
          </Alert>
          <SpotifyButton variant="primary" onClick={handleBackToHome}>
            {t('artist:backToHome')}
          </SpotifyButton>
        </Stack>
      </Container>
    )
  }

  return (
    <Container variant="mobile-first">
      <Stack gap="xl" className="p-xl">
        {/* Header com botão voltar */}
        <Group justify="space-between" align="center">
          <SpotifyButton variant="ghost" onClick={handleBackToHome}>
            {t('artist:backToHomeWithArrow', {
              defaultValue: '← Back to Home',
            })}
          </SpotifyButton>
        </Group>

        {/* Informações do artista */}
        <div className="artist-header">
          <img
            src={getArtistImage(artist)}
            alt={artist.name}
            className="artist-image"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = '/placeholder-artist.jpg'
            }}
          />

          <Title order={1} className="artist-name">
            {artist.name}
          </Title>

          <div className="artist-stats">
            <Badge className="artist-popularity-badge">
              {t('artist:popularityWithValue', {
                value: artist.popularity,
                defaultValue: '{{value}}% Popularity',
              })}
            </Badge>

            {artist.followers && (
              <Text className="artist-followers">
                {t('artist:followersWithValue', {
                  value: artist.followers.total.toLocaleString(),
                  defaultValue: '{{value}} followers',
                })}
              </Text>
            )}
          </div>

          {artist.genres && artist.genres.length > 0 && (
            <div className="artist-genres">
              {artist.genres.slice(0, 5).map((genre: string, index: number) => (
                <Badge key={index} size="sm" variant="outline">
                  {genre}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <Divider className="border-tertiary" />

        {/* Top Músicas */}
        <div>
          <Title order={2} className="text-primary font-bold text-2xl mb-lg">
            {t('artist:topTracks')}
          </Title>

          {isLoadingTracks ? (
            <Stack gap="md">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} height={60} />
              ))}
            </Stack>
          ) : (
            <div className="track-list">
              {topTracks.map((track: SpotifyTrack, index: number) => (
                <div key={track.id} className="track-item">
                  <div className="track-number">{index + 1}</div>
                  <img
                    src={getAlbumImage(track.album)}
                    alt={track.album.name}
                    className="track-album-image"
                  />
                  <div className="track-info">
                    <Text className="track-name">{track.name}</Text>
                    <Text className="track-artists">
                      {track.artists
                        .map((artist: SpotifyArtist) => artist.name)
                        .join(', ')}
                    </Text>
                  </div>
                  <div className="track-duration">
                    {formatDuration(track.duration_ms)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Divider className="border-tertiary" />

        {/* Álbuns */}
        <div>
          <Title order={2} className="text-primary font-bold text-2xl mb-lg">
            {t('artist:albums')}
          </Title>

          {/* Filtro de álbuns */}
          <div className="mb-lg">
            <SearchInput
              onSearch={handleAlbumFilter}
              placeholder={t('artist:filterAlbums')}
              debounceMs={300}
            />
          </div>

          {/* Remover isLoadingAlbums não usado */}
          {/* Corrigir tipagem dos maps */}
          {filteredAlbums.map((album: SpotifyAlbum) => (
            <Grid.Col key={album.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
              <div className="album-card">
                <img
                  src={getAlbumImage(album)}
                  alt={album.name}
                  className="album-image"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = '/placeholder-album.jpg'
                  }}
                />
                <div>
                  <Text className="album-name">{album.name}</Text>
                  <Text className="album-info">
                    {t('artist:albumInfo', {
                      date: formatReleaseDate(album.release_date),
                      tracks: album.total_tracks,
                      defaultValue: '{{date}} • {{tracks}} tracks',
                    })}
                  </Text>
                </div>
              </div>
            </Grid.Col>
          ))}

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="pagination-container">
              <Pagination
                total={totalPages}
                value={currentPage}
                onChange={handlePageChange}
                size="md"
                radius="md"
                className="spotify-pagination"
              />
            </div>
          )}

          {/* Erro ao carregar álbuns */}
          {/* Remover artistAlbums.error não usado */}
        </div>
      </Stack>
    </Container>
  )
}
