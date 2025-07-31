import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Stack, 
  Title, 
  Text, 
  Grid, 
  Group, 
  Button, 
  Skeleton, 
  Alert,
  Pagination,
  Badge,
  Image,
  Divider
} from '@mantine/core'
import { useTranslation } from 'react-i18next'

import { SearchInput, Button as SpotifyButton } from '@/components/ui'
import { Container } from '@/components/layout'
import { useSpotify } from '@/hooks/useSpotify'
import { spotifyStyles } from '@/lib/design-system/utils'
import { SpotifyArtist, SpotifyAlbum, SpotifyTrack } from '@/types/spotify'

export default function ArtistPage() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  const {
    currentArtist,
    artistTopTracks,
    artistAlbums,
    getArtist,
    getArtistTopTracks,
    getArtistAlbums,
  } = useSpotify()

  const [albumFilter, setAlbumFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  // Carregar dados do artista
  useEffect(() => {
    if (id) {
      getArtist(id)
      getArtistTopTracks(id)
      getArtistAlbums(id, { limit: itemsPerPage, offset: 0 })
    }
  }, [id, getArtist, getArtistTopTracks, getArtistAlbums])

  const handleAlbumFilter = (query: string) => {
    setAlbumFilter(query)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    const offset = (page - 1) * itemsPerPage
    if (id) {
      getArtistAlbums(id, { limit: itemsPerPage, offset })
    }
  }

  const handleBackToHome = () => {
    navigate('/')
  }

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const formatReleaseDate = (date: string) => {
    return new Date(date).getFullYear()
  }

  const getArtistImage = (artist: SpotifyArtist) => {
    if (artist.images && artist.images.length > 0) {
      const largeImage = artist.images.find(img => img.width >= 600)
      return largeImage?.url || artist.images[0].url
    }
    return '/placeholder-artist.jpg'
  }

  const getAlbumImage = (album: SpotifyAlbum) => {
    if (album.images && album.images.length > 0) {
      return album.images[0].url
    }
    return '/placeholder-album.jpg'
  }

  const filteredAlbums = artistAlbums.data.items.filter(album =>
    album.name.toLowerCase().includes(albumFilter.toLowerCase())
  )

  const totalPages = Math.ceil(artistAlbums.data.total / itemsPerPage)

  // Loading state
  if (currentArtist.loading) {
    return (
      <Container variant="mobile-first">
        <Stack gap="xl" p="xl">
          <Skeleton height={200} radius="md" />
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Skeleton height={300} radius="md" />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Skeleton height={300} radius="md" />
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>
    )
  }

  // Error state
  if (currentArtist.error) {
    return (
      <Container variant="mobile-first">
        <Stack gap="xl" p="xl" align="center">
          <Alert
            title={t('artist.error')}
            color="red"
            style={{
              backgroundColor: '#2a1a1a',
              border: '1px solid #e91429',
              color: '#ff6b6b',
            }}
          >
            {currentArtist.error}
          </Alert>
          <SpotifyButton variant="primary" onClick={handleBackToHome}>
            {t('artist.backToHome')}
          </SpotifyButton>
        </Stack>
      </Container>
    )
  }

  const artist = currentArtist.data

  return (
    <Container variant="mobile-first">
      <Stack gap="xl" p="xl">
        {/* Header com botão voltar */}
        <Group justify="space-between" align="center">
          <SpotifyButton variant="ghost" onClick={handleBackToHome}>
            ← {t('artist.backToHome')}
          </SpotifyButton>
        </Group>

        {/* Informações do artista */}
        <div style={{ textAlign: 'center' }}>
          <Image
            src={getArtistImage(artist)}
            alt={artist.name}
            style={{
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              margin: '0 auto 24px',
              objectFit: 'cover',
            }}
            fallbackSrc="/placeholder-artist.jpg"
          />
          
          <Title
            order={1}
            style={{
              ...spotifyStyles.textPrimary,
              ...spotifyStyles.fontWeightBold,
              ...spotifyStyles.text4xl,
              marginBottom: '8px',
            }}
          >
            {artist.name}
          </Title>
          
          <Group justify="center" gap="md">
            <Badge
              size="lg"
              style={{
                backgroundColor: '#1DB954',
                color: '#FFFFFF',
                fontSize: '14px',
                padding: '8px 16px',
              }}
            >
              {artist.popularity}% {t('artist.popularity')}
            </Badge>
            
            {artist.followers && (
              <Text
                style={{
                  ...spotifyStyles.textSecondary,
                  ...spotifyStyles.textLg,
                }}
              >
                {artist.followers.followers.toLocaleString()} {t('artist.followers')}
              </Text>
            )}
          </Group>

          {/* Gêneros */}
          {artist.genres && artist.genres.length > 0 && (
            <Group justify="center" gap="sm" mt="md" wrap="wrap">
              {artist.genres.slice(0, 5).map((genre, index) => (
                <Badge
                  key={index}
                  size="sm"
                  style={{
                    backgroundColor: '#282828',
                    color: '#B3B3B3',
                    border: '1px solid #404040',
                  }}
                >
                  {genre}
                </Badge>
              ))}
            </Group>
          )}
        </div>

        <Divider style={{ borderColor: '#282828' }} />

        {/* Top Músicas */}
        <div>
          <Title
            order={2}
            style={{
              ...spotifyStyles.textPrimary,
              ...spotifyStyles.fontWeightSemibold,
              ...spotifyStyles.text2xl,
              marginBottom: '24px',
            }}
          >
            {t('artist.topTracks')}
          </Title>

          {artistTopTracks.loading ? (
            <Stack gap="md">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} height={60} radius="md" />
              ))}
            </Stack>
          ) : (
            <Stack gap="md">
              {artistTopTracks.data.tracks.slice(0, 5).map((track, index) => (
                <div
                  key={track.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px',
                    backgroundColor: '#181818',
                    borderRadius: '8px',
                    transition: 'background-color 0.2s ease-in-out',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#282828'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#181818'
                  }}
                >
                  <Text
                    style={{
                      ...spotifyStyles.textSecondary,
                      ...spotifyStyles.fontWeightMedium,
                      width: '30px',
                      textAlign: 'center',
                    }}
                  >
                    {index + 1}
                  </Text>
                  
                  <Image
                    src={getAlbumImage(track.album)}
                    alt={track.album.name}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '4px',
                      margin: '0 12px',
                      objectFit: 'cover',
                    }}
                    fallbackSrc="/placeholder-album.jpg"
                  />
                  
                  <div style={{ flex: 1 }}>
                    <Text
                      style={{
                        ...spotifyStyles.textPrimary,
                        ...spotifyStyles.fontWeightMedium,
                        ...spotifyStyles.textBase,
                      }}
                    >
                      {track.name}
                    </Text>
                    <Text
                      style={{
                        ...spotifyStyles.textSecondary,
                        ...spotifyStyles.textSm,
                      }}
                    >
                      {track.artists.map(a => a.name).join(', ')}
                    </Text>
                  </div>
                  
                  <Text
                    style={{
                      ...spotifyStyles.textSecondary,
                      ...spotifyStyles.textSm,
                    }}
                  >
                    {formatDuration(track.duration_ms)}
                  </Text>
                </div>
              ))}
            </Stack>
          )}
        </div>

        <Divider style={{ borderColor: '#282828' }} />

        {/* Álbuns */}
        <div>
          <Group justify="space-between" align="center" mb="lg">
            <Title
              order={2}
              style={{
                ...spotifyStyles.textPrimary,
                ...spotifyStyles.fontWeightSemibold,
                ...spotifyStyles.text2xl,
              }}
            >
              {t('artist.albums')}
            </Title>
            
            <SearchInput
              onSearch={handleAlbumFilter}
              placeholder={t('artist.filterAlbums')}
              debounceMs={300}
            />
          </Group>

          {artistAlbums.loading ? (
            <Grid gutter="md">
              {Array.from({ length: 8 }).map((_, index) => (
                <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
                  <Skeleton height={200} radius="md" />
                </Grid.Col>
              ))}
            </Grid>
          ) : (
            <>
              <Grid gutter="md">
                {filteredAlbums.map((album) => (
                  <Grid.Col key={album.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
                    <div
                      style={{
                        backgroundColor: '#181818',
                        borderRadius: '12px',
                        padding: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#282828'
                        e.currentTarget.style.transform = 'translateY(-4px)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#181818'
                        e.currentTarget.style.transform = 'translateY(0)'
                      }}
                    >
                      <Image
                        src={getAlbumImage(album)}
                        alt={album.name}
                        style={{
                          width: '100%',
                          aspectRatio: '1',
                          borderRadius: '8px',
                          marginBottom: '12px',
                          objectFit: 'cover',
                        }}
                        fallbackSrc="/placeholder-album.jpg"
                      />
                      
                      <Text
                        style={{
                          ...spotifyStyles.textPrimary,
                          ...spotifyStyles.fontWeightSemibold,
                          ...spotifyStyles.textBase,
                          marginBottom: '4px',
                        }}
                        lineClamp={2}
                      >
                        {album.name}
                      </Text>
                      
                      <Text
                        style={{
                          ...spotifyStyles.textSecondary,
                          ...spotifyStyles.textSm,
                        }}
                      >
                        {formatReleaseDate(album.release_date)} • {album.total_tracks} {t('artist.tracks')}
                      </Text>
                    </div>
                  </Grid.Col>
                ))}
              </Grid>

              {/* Paginação */}
              {totalPages > 1 && (
                <Group justify="center" mt="xl">
                  <Pagination
                    total={totalPages}
                    value={currentPage}
                    onChange={handlePageChange}
                    color="#1DB954"
                    size="md"
                    radius="md"
                    styles={{
                      control: {
                        backgroundColor: '#282828',
                        border: '1px solid #404040',
                        color: '#FFFFFF',
                        '&:hover': {
                          backgroundColor: '#404040',
                        },
                      },
                      active: {
                        backgroundColor: '#1DB954',
                        border: '1px solid #1DB954',
                      },
                    }}
                  />
                </Group>
              )}
            </>
          )}

          {/* Mensagem de erro */}
          {artistAlbums.error && (
            <Alert
              title={t('artist.albumsError')}
              color="red"
              style={{
                backgroundColor: '#2a1a1a',
                border: '1px solid #e91429',
                color: '#ff6b6b',
                marginTop: '24px',
              }}
            >
              {artistAlbums.error}
            </Alert>
          )}
        </div>
      </Stack>
    </Container>
  )
} 