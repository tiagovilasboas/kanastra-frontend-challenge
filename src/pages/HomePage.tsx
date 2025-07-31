import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Stack, Title, Text, Grid, Group, Button, Skeleton, Alert } from '@mantine/core'
import { useTranslation } from 'react-i18next'

import { SearchInput, ArtistCard } from '@/components/ui'
import { Container } from '@/components/layout'
import { useSpotify } from '@/hooks/useSpotify'
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

  useEffect(() => {
    // Limpar busca ao montar o componente
    clearSearch()
  }, [clearSearch])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      searchArtists(query)
    } else {
      clearSearch()
    }
  }

  const handleArtistClick = (artist: SpotifyArtist) => {
    navigate(`/artist/${artist.id}`)
  }

  const handleLogin = () => {
    window.location.href = 'https://accounts.spotify.com/authorize?client_id=c6c3457349a542d59b8e0dcc39c4047a&response_type=token&redirect_uri=https://localhost:5173/callback&scope=user-read-private%20user-read-email'
  }

  const renderSkeletons = () => (
    <Grid className="grid-spotify">
      {Array.from({ length: 8 }).map((_, index) => (
        <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
          <div className="card-spotify">
            <div className="loading-skeleton h-40 mb-md" />
            <div className="loading-skeleton h-4 mb-sm" />
            <div className="loading-skeleton h-3 mb-sm" />
            <div className="loading-skeleton h-3 w-2/3" />
          </div>
        </Grid.Col>
      ))}
    </Grid>
  )

  const renderArtists = () => {
    if (!searchResults.data?.artists?.items?.length) {
      return (
        <Alert
          title={t('search:noResults')}
          color="gray"
          className="alert-spotify"
        >
          {t('search:noResultsMessage')}
        </Alert>
      )
    }

    return (
      <Grid className="grid-spotify">
        {searchResults.data.artists.items.map((artist) => (
          <Grid.Col key={artist.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
            <ArtistCard
              artist={artist}
              onClick={handleArtistClick}
              showGenres={true}
              showFollowers={true}
            />
          </Grid.Col>
        ))}
      </Grid>
    )
  }

  const renderInitialState = () => (
    <Stack gap="xl" align="center" className="text-center">
      <div>
        <Title
          order={1}
          className="spotify-gradient-text text-4xl font-bold mb-md"
        >
          {t('home:title')}
        </Title>
        <Text className="text-secondary text-lg leading-relaxed max-w-2xl">
          {t('home:subtitle')}
        </Text>
      </div>

      <SearchInput
        onSearch={handleSearch}
        placeholder={t('search:placeholder')}
        disabled={!isAuthenticated}
      />

      {!isAuthenticated && (
        <Button
          variant="spotify"
          size="lg"
          onClick={handleLogin}
          className="mt-2xl"
        >
          {t('auth:loginWithSpotify')}
        </Button>
      )}
    </Stack>
  )

  return (
    <Container variant="mobile-first">
      <Stack gap="xl" className="p-xl">
        {/* Header da página */}
        <div>
          <Title
            order={1}
            className="text-primary font-bold text-3xl mb-sm"
          >
            {searchQuery ? t('search:results') : t('home:welcome')}
          </Title>
          {searchQuery && (
            <Text className="text-secondary text-base">
              {t('search:resultsFor')} &quot;{searchQuery}&quot;
            </Text>
          )}
        </div>

        {/* Campo de busca */}
        <Group justify="center">
          <SearchInput
            onSearch={handleSearch}
            placeholder={t('search:placeholder')}
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
                title={t('search:error')}
                color="red"
                className="alert-spotify alert-error mt-lg"
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
