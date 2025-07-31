import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Stack, Title, Text, Grid, Group, Button, Skeleton, Alert } from '@mantine/core'
import { useTranslation } from 'react-i18next'

import { SearchInput, ArtistCard } from '@/components/ui'
import { Container } from '@/components/layout'
import { useSpotify } from '@/hooks/useSpotify'
import { spotifyStyles } from '@/lib/design-system/utils'
import { SpotifyArtist } from '@/types/spotify'

export default function HomePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const {
    isAuthenticated,
    searchResults,
    searchArtists,
    clearSearch,
  } = useSpotify()

  const [searchQuery, setSearchQuery] = useState('')

  // Buscar artistas quando a query mudar
  useEffect(() => {
    if (searchQuery.trim()) {
      searchArtists({
        query: searchQuery,
        type: 'artist',
        limit: 20,
      })
    } else {
      clearSearch()
    }
  }, [searchQuery, searchArtists, clearSearch])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleArtistClick = (artist: SpotifyArtist) => {
    // Navegar para a página do artista
    navigate(`/artist/${artist.id}`)
  }

  const handleLogin = () => {
    // Redirecionar para login do Spotify
    const authUrl = `https://accounts.spotify.com/authorize?client_id=c6c3457349a542d59b8e0dcc39c4047a&response_type=token&redirect_uri=${encodeURIComponent('https://localhost:5173/callback')}&scope=${encodeURIComponent('user-read-private user-read-email')}`
    window.location.href = authUrl
  }

  // Renderizar skeleton de loading
  const renderSkeletons = () => (
    <Grid gutter="md">
      {Array.from({ length: 8 }).map((_, index) => (
        <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
          <Skeleton height={200} radius="md" />
        </Grid.Col>
      ))}
    </Grid>
  )

  // Renderizar lista de artistas
  const renderArtists = () => {
    const artists = searchResults.data.artists.items

    if (artists.length === 0 && searchQuery) {
      return (
        <Alert
          title={t('search.noResults')}
          color="gray"
          style={{
            backgroundColor: '#282828',
            border: '1px solid #404040',
            color: '#B3B3B3',
          }}
        >
          {t('search.noResultsMessage')}
        </Alert>
      )
    }

    return (
      <Grid gutter="md">
        {artists.map((artist) => (
          <Grid.Col key={artist.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
            <ArtistCard
              artist={artist}
              onClick={handleArtistClick}
              size="md"
            />
          </Grid.Col>
        ))}
      </Grid>
    )
  }

  // Renderizar estado inicial
  const renderInitialState = () => (
    <Stack gap="xl" align="center" style={{ textAlign: 'center' }}>
      <div>
        <Title
          order={1}
          style={{
            ...spotifyStyles.textPrimary,
            ...spotifyStyles.fontWeightBold,
            ...spotifyStyles.text4xl,
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #1DB954 0%, #1ed760 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {t('home.title')}
        </Title>
        <Text
          style={{
            ...spotifyStyles.textSecondary,
            ...spotifyStyles.textLg,
            ...spotifyStyles.leadingRelaxed,
            maxWidth: '600px',
          }}
        >
          {t('home.subtitle')}
        </Text>
      </div>

      <SearchInput
        onSearch={handleSearch}
        placeholder={t('search.placeholder')}
        disabled={!isAuthenticated}
      />

      {!isAuthenticated && (
        <Button
          variant="spotify"
          size="lg"
          onClick={handleLogin}
          style={{ marginTop: '32px' }}
        >
          {t('auth.loginWithSpotify')}
        </Button>
      )}
    </Stack>
  )

  return (
    <Container variant="mobile-first">
      <Stack gap="xl" p="xl">
        {/* Header da página */}
        <div>
          <Title
            order={1}
            style={{
              ...spotifyStyles.textPrimary,
              ...spotifyStyles.fontWeightBold,
              ...spotifyStyles.text3xl,
              marginBottom: '8px',
            }}
          >
            {searchQuery ? t('search.results') : t('home.welcome')}
          </Title>
          {searchQuery && (
            <Text
              style={{
                ...spotifyStyles.textSecondary,
                ...spotifyStyles.textBase,
              }}
            >
              {t('search.resultsFor')} "{searchQuery}"
            </Text>
          )}
        </div>

        {/* Campo de busca */}
        <Group justify="center">
          <SearchInput
            onSearch={handleSearch}
            placeholder={t('search.placeholder')}
            disabled={!isAuthenticated}
          />
        </Group>

        {/* Conteúdo principal */}
        {!isAuthenticated ? (
          renderInitialState()
        ) : (
          <div>
            {searchResults.loading ? (
              renderSkeletons()
            ) : searchQuery ? (
              renderArtists()
            ) : (
              renderInitialState()
            )}

            {/* Mensagem de erro */}
            {searchResults.error && (
              <Alert
                title={t('search.error')}
                color="red"
                style={{
                  backgroundColor: '#2a1a1a',
                  border: '1px solid #e91429',
                  color: '#ff6b6b',
                  marginTop: '24px',
                }}
              >
                {searchResults.error}
              </Alert>
            )}
          </div>
        )}
      </Stack>
    </Container>
  )
}
