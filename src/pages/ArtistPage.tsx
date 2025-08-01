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
import { useSpotifyAuth } from '@/hooks/useSpotifyAuth'
import { SpotifyAlbum, SpotifyArtist, SpotifyTrack } from '@/types/spotify'

export const ArtistPage: React.FC = () => {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated } = useSpotifyAuth()

  const {
    artist,
    topTracks,
    albums,
    currentPage,
    totalPages,
    isLoadingArtist,
    isLoadingTracks,
    artistError,
    handlePageChange,
    handleBackToHome,
  } = useArtistPage(id)

  const [albumFilter, setAlbumFilter] = useState('')

  const handleAlbumFilter = (query: string) => {
    setAlbumFilter(query)
  }

  const handlePageChangeWrapper = (page: number) => {
    handlePageChange(page)
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

  // Error state
  if (artistError) {
    return (
      <Container variant="mobile-first">
        <Stack gap="xl" className="p-xl">
          <Alert color="red" title={t('artist:errorTitle')}>
            {artistError.message}
          </Alert>
          <SpotifyButton onClick={handleBackToHome}>
            {t('artist:backToHome')}
          </SpotifyButton>
        </Stack>
      </Container>
    )
  }

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
      <Stack gap="xl" className="p-xl" data-testid="artist-page">
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

          <Title order={1} className="artist-name" data-testid="artist-name">
            {artist.name}
          </Title>

          <div className="artist-stats">
            <Badge
              className="artist-popularity-badge"
              data-testid="artist-popularity"
            >
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
          ) : !isAuthenticated ? (
            <Alert color="blue" title={t('artist:authRequired')}>
              {t('artist:authRequiredMessage')}
            </Alert>
          ) : !topTracks || topTracks.length === 0 ? (
            <Alert color="yellow" title={t('artist:noTopTracks')}>
              {t('artist:noTopTracksMessage')}
            </Alert>
          ) : (
            <div className="track-list">
              {Array.isArray(topTracks) &&
                topTracks.map((track: SpotifyTrack, index: number) => (
                  <div
                    key={track.id}
                    className="track-item"
                    data-testid="track-item"
                  >
                    <div className="track-number" data-testid="track-number">
                      {index + 1}
                    </div>
                    <img
                      src={getAlbumImage(track.album)}
                      alt={track.album.name}
                      className="track-album-image"
                    />
                    <div className="track-info">
                      <Text className="track-name" data-testid="track-name">
                        {track.name}
                      </Text>
                      <Text className="track-artists">
                        {track.artists
                          .map((artist: SpotifyArtist) => artist.name)
                          .join(', ')}
                      </Text>
                    </div>
                    <div
                      className="track-duration"
                      data-testid="track-duration"
                    >
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
              data-testid="album-filter"
              onSearch={handleAlbumFilter}
              placeholder={t('artist:filterAlbums')}
            />
          </div>

          {/* Grid de álbuns */}
          <Grid gutter="lg">
            {filteredAlbums.map((album: SpotifyAlbum) => (
              <Grid.Col key={album.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
                <div className="album-card" data-testid="album-card">
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
                    <Text className="album-name" data-testid="album-name">
                      {album.name}
                    </Text>
                    <Text className="album-info" data-testid="album-info">
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
          </Grid>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="pagination-container">
              <Pagination
                data-testid="pagination"
                total={totalPages}
                value={currentPage}
                onChange={handlePageChangeWrapper}
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
