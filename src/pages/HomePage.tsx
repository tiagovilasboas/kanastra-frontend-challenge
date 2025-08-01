import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  Grid,
  Text,
  Title,
} from '@mantine/core'
import {
  Download,
  Heart,
  Home,
  Play,
  Plus,
  Search,
  Settings,
  User,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { ArtistCard, SearchInput } from '@/components/ui'
import { useSpotifyAuth } from '@/hooks/useSpotifyAuth'
import { useSpotifySearch } from '@/hooks/useSpotifySearch'
import { SpotifyArtist } from '@/types/spotify'

export default function HomePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isAuthenticated, login } = useSpotifyAuth()
  const { searchResults, searchArtists, clearSearch, isLoading, error } =
    useSpotifySearch()

  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    clearSearch()
  }, [clearSearch])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      searchArtists(query.trim())
    } else {
      clearSearch()
    }
  }

  const handleArtistClick = (artist: SpotifyArtist) => {
    navigate(`/artist/${artist.id}`)
  }

  const renderSkeletons = () => (
    <Grid gutter="lg">
      {Array.from({ length: 12 }).map((_, index) => (
        <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4, lg: 3, xl: 2 }}>
          <div className="artist-card-skeleton">
            <div className="skeleton-image" />
            <div className="skeleton-content">
              <div className="skeleton-title" />
              <div className="skeleton-subtitle" />
            </div>
          </div>
        </Grid.Col>
      ))}
    </Grid>
  )

  const renderArtists = () => {
    if (!searchResults.length) {
      return (
        <div className="no-results">
          <div className="no-results-icon">{t('common:icons.music')}</div>
          <Title order={3} className="text-primary mb-sm">
            {t('search:noResults')}
          </Title>
          <Text className="text-secondary text-center">
            {t('search:noResultsMessage')}
          </Text>
        </div>
      )
    }

    return (
      <div>
        <div className="section-header">
          <Title order={2} className="text-primary">
            {t('search:results')}
          </Title>
          <Text className="text-secondary">
            {t('search:resultsForWithQuery', 'Results for "{query}"', {
              query: searchQuery,
            })}
          </Text>
        </div>

        <Grid gutter="lg">
          {searchResults.map((artist: SpotifyArtist) => (
            <Grid.Col
              key={artist.id}
              span={{ base: 12, sm: 6, md: 4, lg: 3, xl: 2 }}
            >
              <ArtistCard
                artist={artist}
                onClick={handleArtistClick}
                showGenres={true}
                showFollowers={true}
              />
            </Grid.Col>
          ))}
        </Grid>
      </div>
    )
  }

  const renderHeroSection = () => (
    <div className="hero-section">
      <div className="hero-content">
        <div className="hero-badge">
          <Badge
            size="lg"
            variant="gradient"
            gradient={{ from: 'green', to: 'blue' }}
          >
            {t('common:icons.music')} {t('common:appName')}
          </Badge>
        </div>

        <Title order={1} className="hero-title">
          {t('home:title')}
        </Title>

        <Text className="hero-subtitle">{t('home:subtitle')}</Text>

        {!isAuthenticated ? (
          <Button
            variant="gradient"
            gradient={{ from: 'green', to: 'blue' }}
            size="xl"
            onClick={login}
            className="hero-button"
            leftSection={<Play size={20} />}
          >
            {t('auth:loginWithSpotify')}
          </Button>
        ) : (
          <div className="search-hero">
            <SearchInput
              onSearch={handleSearch}
              placeholder={t('search:placeholder')}
            />
          </div>
        )}
      </div>

      <div className="hero-visual">
        <div className="floating-cards">
          <div className="floating-card card-1">
            {t('common:icons.microphone')}
          </div>
          <div className="floating-card card-2">{t('common:icons.guitar')}</div>
          <div className="floating-card card-3">{t('common:icons.piano')}</div>
          <div className="floating-card card-4">{t('common:icons.drums')}</div>
        </div>
      </div>
    </div>
  )

  const renderSidebar = () => (
    <div className="sidebar">
      <div className="sidebar-section">
        <div className="sidebar-item active">
          <Home size={20} />
          <span>{t('common:home')}</span>
        </div>
        <div className="sidebar-item">
          <Search size={20} />
          <span>{t('common:search')}</span>
        </div>
        <div className="sidebar-item">
          <Heart size={20} />
          <span>{t('common:library')}</span>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-item">
          <Plus size={20} />
          <span>{t('common:createPlaylist')}</span>
        </div>
        <div className="sidebar-item">
          <Heart size={20} />
          <span>{t('common:likedSongs')}</span>
        </div>
        <div className="sidebar-item">
          <Download size={20} />
          <span>{t('common:downloads')}</span>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-item">
          <Settings size={20} />
          <span>{t('common:settings')}</span>
        </div>
        <div className="sidebar-item">
          <User size={20} />
          <span>{t('common:profile')}</span>
        </div>
      </div>
    </div>
  )

  const renderHeader = () => (
    <header className="main-header">
      <div className="header-left">
        <div className="logo">
          <div className="logo-icon">{t('common:icons.note')}</div>
          <span className="logo-text">{t('common:appName')}</span>
        </div>
      </div>

      <div className="header-center">
        {isAuthenticated && (
          <SearchInput
            onSearch={handleSearch}
            placeholder={t('search:placeholder')}
          />
        )}
      </div>

      <div className="header-right">
        <ActionIcon variant="subtle" size="lg" className="header-icon">
          <Settings size={20} />
        </ActionIcon>
        <ActionIcon variant="subtle" size="lg" className="header-icon">
          <User size={20} />
        </ActionIcon>
      </div>
    </header>
  )

  return (
    <div className="app-layout">
      {renderSidebar()}

      <div className="main-content">
        {renderHeader()}

        <div className="content-area">
          {!isAuthenticated ? (
            renderHeroSection()
          ) : (
            <div className="content-wrapper">
              {searchQuery ? (
                <div>
                  {isLoading ? renderSkeletons() : renderArtists()}

                  {error && (
                    <Alert
                      title={t('search:error')}
                      color="red"
                      className="error-alert"
                    >
                      {error}
                    </Alert>
                  )}
                </div>
              ) : (
                <div className="welcome-content">
                  <div className="welcome-section">
                    <Title order={2} className="welcome-title">
                      {t('home:welcome')}
                    </Title>
                    <Text className="welcome-text">
                      {t('home:startExploring')}
                    </Text>

                    <SearchInput
                      onSearch={handleSearch}
                      placeholder={t('search:placeholder')}
                    />
                  </div>

                  <div className="featured-section">
                    <Title order={3} className="section-title">
                      {t('home:trendingArtists')}
                    </Title>
                    <Text className="section-subtitle">
                      {t('home:trendingDescription')}
                    </Text>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
