import {
  ActionIcon,
  Alert,
  Badge,
  Card,
  Divider,
  Flex,
  Grid,
  Group,
  Image,
  Pagination,
  Skeleton,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core'
import { ExternalLink, Play, RefreshCw, Share } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { AppLayout } from '@/components/layout'
import { Button as SpotifyButton, SearchInput } from '@/components/ui'
import { useArtistPage } from '@/hooks/useArtistPage'
import { useSpotifyAuth } from '@/hooks/useSpotifyAuth'
import { SpotifyAlbum } from '@/schemas/spotify'
import { SpotifyTrack } from '@/schemas/spotify'
import { SpotifyArtist } from '@/types/spotify'

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
    totalItems,
    isLoadingArtist,
    isLoadingTracks,
    isLoadingAlbums,
    artistError,
    tracksError,
    albumsError,
    handlePageChange,
    handleBackToHome,
    handleRefresh,
    handlePrefetchNextPage,
  } = useArtistPage(id)

  const [albumFilter, setAlbumFilter] = useState('')

  const handleAlbumFilter = (query: string) => {
    setAlbumFilter(query)
  }

  const handlePageChangeWrapper = (page: number) => {
    handlePageChange(page)
    // Prefetch next page for better UX
    if (page < totalPages) {
      handlePrefetchNextPage()
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

  const formatFollowers = (followers: number) => {
    if (followers >= 1000000) {
      return `${(followers / 1000000).toFixed(1)}M`
    }
    if (followers >= 1000) {
      return `${(followers / 1000).toFixed(1)}K`
    }
    return followers.toString()
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

  const handlePlayTrack = (track: SpotifyTrack) => {
    // Open track in Spotify
    if (track.external_urls?.spotify) {
      window.open(track.external_urls.spotify, '_blank', 'noopener,noreferrer')
    } else {
      console.warn('No Spotify URL available for track:', track.name)
    }
  }

  const handleAlbumClick = (album: SpotifyAlbum) => {
    if (album.external_urls?.spotify) {
      window.open(album.external_urls.spotify, '_blank', 'noopener,noreferrer')
    } else {
      console.warn('No Spotify URL available for album:', album.name)
    }
  }

  const handleShareArtist = () => {
    if (navigator.share) {
      navigator.share({
        title: artist?.name,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  // Filtrar álbuns por nome
  const filteredAlbums = albums.filter((album) =>
    album.name.toLowerCase().includes(albumFilter.toLowerCase()),
  )

  // Error state
  if (artistError) {
    return (
      <AppLayout>
        <Stack gap="xl" className="p-xl">
          <Alert color="red" title={t('artist:errorTitle')}>
            {artistError.message}
          </Alert>
          <Group>
            <SpotifyButton onClick={handleBackToHome}>
              {t('artist:backToHome')}
            </SpotifyButton>
            <SpotifyButton variant="secondary" onClick={handleRefresh}>
              {t('artist:retry', 'Retry')}
            </SpotifyButton>
          </Group>
        </Stack>
      </AppLayout>
    )
  }

  // Loading state
  if (isLoadingArtist) {
    return (
      <AppLayout>
        <div className="artist-page-container">
          <Stack gap="xl">
            {/* Header skeleton */}
            <Group justify="space-between" align="center">
              <Skeleton height={40} width="150px" />
              <Group gap="sm">
                <Skeleton height={40} width={40} radius="md" />
                <Skeleton height={40} width={40} radius="md" />
                <Skeleton height={40} width={40} radius="md" />
              </Group>
            </Group>

            {/* Hero skeleton */}
            <div className="artist-hero-skeleton">
              <div className="artist-hero-skeleton-content">
                <div className="artist-hero-skeleton-image" />
                <div className="artist-hero-skeleton-info">
                  <div className="artist-hero-skeleton-name" />
                  <div className="artist-hero-skeleton-stats">
                    <div className="artist-hero-skeleton-stat" />
                    <div className="artist-hero-skeleton-stat" />
                  </div>
                  <div className="artist-hero-skeleton-genres">
                    <div className="artist-hero-skeleton-genre" />
                    <div className="artist-hero-skeleton-genre" />
                    <div className="artist-hero-skeleton-genre" />
                  </div>
                </div>
              </div>
            </div>

            <Divider />

            {/* Tracks skeleton */}
            <div>
              <Skeleton height={30} width="200px" className="mb-lg" />
              <Stack gap="md">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} height={60} radius="md" />
                ))}
              </Stack>
            </div>
          </Stack>
        </div>
      </AppLayout>
    )
  }

  // Error state - if artist is null, show error
  if (!artist) {
    return (
      <AppLayout>
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
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="artist-page-container" data-testid="artist-page">
        <Stack gap="xl">
          {/* Header com botão voltar e ações */}
          <Group justify="space-between" align="center">
            <SpotifyButton variant="ghost" onClick={handleBackToHome}>
              {t('artist:backToHomeWithArrow', {
                defaultValue: '← Back to Home',
              })}
            </SpotifyButton>

            <Group gap="sm">
              <Tooltip label={t('artist:refresh')}>
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  size="lg"
                  onClick={handleRefresh}
                  aria-label={t('artist:refresh')}
                  loading={
                    isLoadingArtist || isLoadingTracks || isLoadingAlbums
                  }
                >
                  <RefreshCw size={20} />
                </ActionIcon>
              </Tooltip>

              <Tooltip label={t('artist:share')}>
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  size="lg"
                  onClick={handleShareArtist}
                  aria-label={t('artist:share')}
                >
                  <Share size={20} />
                </ActionIcon>
              </Tooltip>

              <Tooltip label={t('artist:openInSpotify')}>
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  size="lg"
                  component="a"
                  href={artist.external_urls?.spotify || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t('artist:openInSpotify')}
                >
                  <ExternalLink size={20} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Group>

          {/* Hero Section do Artista */}
          <div className="artist-hero">
            <div className="artist-hero-content">
              <div className="artist-image-container">
                <Image
                  src={getArtistImage(artist)}
                  alt={artist.name}
                  className="artist-hero-image"
                  fallbackSrc="/placeholder-artist.jpg"
                  radius="xl"
                />
              </div>

              <div className="artist-hero-info">
                <Title
                  order={1}
                  className="artist-hero-name"
                  data-testid="artist-name"
                >
                  {artist.name}
                </Title>

                <Group gap="md" className="artist-hero-stats">
                  {artist.popularity && (
                    <Badge
                      className="artist-popularity-badge"
                      data-testid="artist-popularity"
                      variant="light"
                      color="green"
                    >
                      {t('artist:popularityWithValue', {
                        value: artist.popularity,
                        defaultValue: '{{value}}% Popularity',
                      })}
                    </Badge>
                  )}

                  {artist.followers && (
                    <Text className="artist-followers" size="lg">
                      {t('artist:followersWithValue', {
                        value: formatFollowers(artist.followers.total),
                        defaultValue: '{{value}} followers',
                      })}
                    </Text>
                  )}
                </Group>

                {artist.genres && artist.genres.length > 0 && (
                  <Group gap="sm" className="artist-genres">
                    {artist.genres
                      .slice(0, 5)
                      .map((genre: string, index: number) => (
                        <Badge
                          key={index}
                          size="sm"
                          variant="outline"
                          color="gray"
                        >
                          {genre}
                        </Badge>
                      ))}
                  </Group>
                )}
              </div>
            </div>
          </div>

          <Divider className="border-tertiary" />

          {/* Top Músicas */}
          <div>
            <Group
              justify="space-between"
              align="center"
              className="tracks-section-title"
            >
              <Title order={2} className="text-primary font-bold text-2xl">
                {t('artist:topTracks')}
              </Title>
            </Group>

            {isLoadingTracks ? (
              <Stack gap="md">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} height={60} />
                ))}
              </Stack>
            ) : tracksError ? (
              <Alert
                color="red"
                title={t('artist:tracksError', 'Error loading tracks')}
              >
                {tracksError.message}
              </Alert>
            ) : !isAuthenticated ? (
              <Alert color="blue" title={t('artist:authRequired')}>
                {t('artist:authRequiredMessage')}
              </Alert>
            ) : !topTracks || topTracks.length === 0 ? (
              <Alert color="yellow" title={t('artist:noTopTracks')}>
                {t('artist:noTopTracksMessage')}
              </Alert>
            ) : (
              <Card className="tracks-card">
                <Stack gap="xs">
                  {Array.isArray(topTracks) &&
                    topTracks.map((track, index) => (
                      <div
                        key={track.id}
                        className="track-item"
                        data-testid="track-item"
                      >
                        <div
                          className="track-number"
                          data-testid="track-number"
                        >
                          {index + 1}
                        </div>

                        <Image
                          src={
                            track.album.images?.[0]?.url ||
                            '/placeholder-album.jpg'
                          }
                          alt={track.album.name}
                          className="track-album-image"
                          fallbackSrc="/placeholder-album.jpg"
                          radius="sm"
                        />

                        <div className="track-info">
                          <Text
                            className="track-name"
                            data-testid="track-name"
                            fw={500}
                          >
                            {track.name}
                          </Text>
                          <Text className="track-artists" size="sm" c="dimmed">
                            {track.artists
                              .map((artist) => artist.name)
                              .join(', ')}
                          </Text>
                        </div>

                        <div className="track-actions">
                          <ActionIcon
                            variant="subtle"
                            color="gray"
                            onClick={() => handlePlayTrack(track)}
                          >
                            <Play size={16} />
                          </ActionIcon>
                        </div>

                        <div
                          className="track-duration"
                          data-testid="track-duration"
                        >
                          {formatDuration(track.duration_ms)}
                        </div>
                      </div>
                    ))}
                </Stack>
              </Card>
            )}
          </div>

          <Divider className="border-tertiary" />

          {/* Álbuns */}
          <div>
            <Group
              justify="space-between"
              align="center"
              className="albums-section-title"
            >
              <Title order={2} className="text-primary font-bold text-2xl">
                {t('artist:albums')}
              </Title>

              <Text size="sm" c="dimmed">
                {t('ui:albums.counter', '{{count}} de {{total}}', {
                  count: filteredAlbums.length,
                  total: totalItems,
                })}
              </Text>
            </Group>

            {/* Filtro de álbuns */}
            <div className="mb-lg">
              <SearchInput
                data-testid="album-filter"
                onSearch={handleAlbumFilter}
                placeholder={t('artist:filterAlbums')}
              />
            </div>

            {isLoadingAlbums ? (
              <Grid gutter="lg">
                {Array.from({ length: 8 }).map((_, index) => (
                  <Grid.Col
                    key={index}
                    span={{ base: 12, sm: 6, md: 4, lg: 3 }}
                  >
                    <Skeleton height={250} radius="md" />
                  </Grid.Col>
                ))}
              </Grid>
            ) : albumsError ? (
              <Alert
                color="red"
                title={t('artist:albumsError', 'Error loading albums')}
              >
                {albumsError.message}
              </Alert>
            ) : (
              <>
                {/* Grid de álbuns */}
                <Grid gutter="lg">
                  {filteredAlbums.map((album) => (
                    <Grid.Col
                      key={album.id}
                      span={{ base: 12, sm: 6, md: 4, lg: 3 }}
                    >
                      <Card
                        className="album-card"
                        data-testid="album-card"
                        withBorder
                        onClick={() => handleAlbumClick(album)}
                        style={{ cursor: 'pointer' }}
                      >
                        <Card.Section>
                          <Image
                            src={getAlbumImage(album)}
                            alt={album.name}
                            className="album-image"
                            fallbackSrc="/placeholder-album.jpg"
                            radius="md"
                          />
                        </Card.Section>

                        <Stack gap="xs" className="mt-md">
                          <Text
                            className="album-name"
                            data-testid="album-name"
                            fw={500}
                            lineClamp={2}
                          >
                            {album.name}
                          </Text>

                          <Text
                            className="album-info"
                            data-testid="album-info"
                            size="sm"
                            c="dimmed"
                          >
                            {t('artist:albumInfo', {
                              date: formatReleaseDate(album.release_date),
                              tracks: album.total_tracks,
                              defaultValue: '{{date}} • {{tracks}} tracks',
                            })}
                          </Text>

                          <Group gap="xs">
                            <Badge size="xs" variant="light" color="gray">
                              {album.album_type}
                            </Badge>
                          </Group>
                        </Stack>
                      </Card>
                    </Grid.Col>
                  ))}
                </Grid>

                {/* Paginação */}
                {totalPages > 1 && (
                  <Flex justify="center" className="mt-xl">
                    <Pagination
                      data-testid="pagination"
                      total={totalPages}
                      value={currentPage}
                      onChange={handlePageChangeWrapper}
                      size="md"
                      radius="md"
                      className="spotify-pagination"
                    />
                  </Flex>
                )}
              </>
            )}
          </div>
        </Stack>
      </div>
    </AppLayout>
  )
}
