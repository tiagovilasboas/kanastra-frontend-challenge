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
import { Play, Share, ExternalLink } from 'lucide-react'
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
    // TODO: Implement play functionality
    console.log('Playing track:', track.name)
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
        {/* Header com botão voltar e ações */}
        <Group justify="space-between" align="center">
          <SpotifyButton variant="ghost" onClick={handleBackToHome}>
            {t('artist:backToHomeWithArrow', {
              defaultValue: '← Back to Home',
            })}
          </SpotifyButton>
          
          <Group gap="sm">
            <Tooltip label="Share artist">
              <ActionIcon
                variant="subtle"
                color="gray"
                size="lg"
                onClick={handleShareArtist}
                aria-label="Share artist"
              >
                <Share size={20} />
              </ActionIcon>
            </Tooltip>
            
            <Tooltip label="Open in Spotify">
              <ActionIcon
                variant="subtle"
                color="gray"
                size="lg"
                component="a"
                href={artist.external_urls?.spotify || '#'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open in Spotify"
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
              <Title order={1} className="artist-hero-name" data-testid="artist-name">
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
                  {artist.genres.slice(0, 5).map((genre: string, index: number) => (
                    <Badge key={index} size="sm" variant="outline" color="gray">
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
          <Group justify="space-between" align="center" className="mb-lg">
            <Title order={2} className="text-primary font-bold text-2xl">
              {t('artist:topTracks')}
            </Title>
            
            {isAuthenticated && topTracks && topTracks.length > 0 && (
              <SpotifyButton
                variant="secondary"
                size="sm"
                leftSection={<Play size={16} />}
              >
                {t('artist:playAll', 'Play All')}
              </SpotifyButton>
            )}
          </Group>

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
            <Card className="tracks-card">
              <Stack gap="xs">
                {Array.isArray(topTracks) &&
                  topTracks.map((track, index) => (
                    <div
                      key={track.id}
                      className="track-item"
                      data-testid="track-item"
                    >
                      <div className="track-number" data-testid="track-number">
                        {index + 1}
                      </div>
                      
                      <Image
                        src={getAlbumImage(track.album)}
                        alt={track.album.name}
                        className="track-album-image"
                        fallbackSrc="/placeholder-album.jpg"
                        radius="sm"
                      />
                      
                      <div className="track-info">
                        <Text className="track-name" data-testid="track-name" fw={500}>
                          {track.name}
                        </Text>
                        <Text className="track-artists" size="sm" c="dimmed">
                          {track.artists
                            .map((artist: SpotifyArtist) => artist.name)
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
          <Group justify="space-between" align="center" className="mb-lg">
            <Title order={2} className="text-primary font-bold text-2xl">
              {t('artist:albums')}
            </Title>
            
            <Text size="sm" c="dimmed">
              {filteredAlbums.length} {filteredAlbums.length === 1 ? 'album' : 'albums'}
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

          {/* Grid de álbuns */}
          <Grid gutter="lg">
            {filteredAlbums.map((album) => (
              <Grid.Col key={album.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
                <Card className="album-card" data-testid="album-card" withBorder>
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
                    <Text className="album-name" data-testid="album-name" fw={500} lineClamp={2}>
                      {album.name}
                    </Text>
                    
                    <Text className="album-info" data-testid="album-info" size="sm" c="dimmed">
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
        </div>
      </Stack>
    </Container>
  )
}
