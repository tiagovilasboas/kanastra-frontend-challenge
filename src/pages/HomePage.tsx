import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar/Sidebar'
import { SEOHead, StructuredData } from '@/components/SEO'
import { ArtistCard } from '@/components/ui/ArtistCard'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { MusicIcon } from '@/components/ui/MusicIcon'
import { PopularArtistsSection } from '@/components/ui/PopularArtistsSection'
import { useArtistPrefetch } from '@/hooks/useArtistPrefetch'
import { usePopularArtists } from '@/hooks/usePopularArtists'
import { useSpotifyAuth } from '@/hooks/useSpotifyAuth'
import { useSpotifySearch } from '@/hooks/useSpotifySearch'
import { useToast } from '@/hooks/useToast'
import { useNavigationStore } from '@/stores'

export const HomePage: React.FC = () => {
  const { t } = useTranslation()
  const { isAuthenticated } = useSpotifyAuth()
  const { activeSection, setActiveSection } = useNavigationStore()
  const { prefetchArtistData } = useArtistPrefetch()
  const navigate = useNavigate()
  const location = useLocation()
  const { showError } = useToast()

  // Sync activeSection with URL
  useEffect(() => {
    const path = location.pathname
    const searchParams = new URLSearchParams(location.search)
    const section = searchParams.get('section')

    if (section && ['home', 'library', 'create'].includes(section)) {
      setActiveSection(section as 'home' | 'library' | 'create')
    } else if (path === '/') {
      setActiveSection('home')
    }
  }, [location.pathname, location.search, setActiveSection])

  const {
    searchResults,
    isLoading,
    isLoadingMore,
    error,
    searchArtists,
    searchQuery,
    debouncedQuery,
    hasMore,
    loadMore,
    totalResults,
  } = useSpotifySearch()

  const {
    artists: popularArtists,
    isLoading: isLoadingPopular,
    error: popularError,
  } = usePopularArtists({ limit: 6, enabled: !searchQuery })

  const handleArtistClick = (artistId: string) => {
    prefetchArtistData(artistId)
    navigate(`/artist/${artistId}`)
  }

  const renderMainContent = () => {
    // Show error toast if there's an error
    if (error) {
      showError('search:errorMessage')
      // Continue showing the previous content or loading state
    }

    // Show library section when activeSection is library (highest priority)
    if (activeSection === 'library') {
      return (
        <div className="library-section">
          <div className="library-content">
            <h2 className="library-title">{t('navigation:library')}</h2>
            <p className="library-message">
              {isAuthenticated
                ? t('navigation:libraryMessage')
                : t('navigation:libraryMessageUnauth')}
            </p>
          </div>
        </div>
      )
    }

    // Show create playlist section when activeSection is create (highest priority)
    if (activeSection === 'create') {
      return (
        <div className="create-section">
          <div className="create-content">
            <h2 className="create-title">{t('navigation:create')}</h2>
            <p className="create-message">
              {isAuthenticated
                ? t('navigation:createMessage')
                : t('navigation:createMessageUnauth')}
            </p>
          </div>
        </div>
      )
    }

    // Show loading skeleton when searching (only for home section)
    if (
      (isLoading || (searchQuery && !debouncedQuery)) &&
      activeSection === 'home'
    ) {
      return (
        <div className="main-content">
          <div className="results-grid">
            {Array.from({ length: 8 }).map((_, index) => (
              <LoadingSkeleton
                key={index}
                height="200px"
                width="100%"
                className="artist-card-skeleton"
              />
            ))}
          </div>
        </div>
      )
    }

    // Show results when search is complete and has results (only for home section)
    if (
      searchQuery &&
      debouncedQuery &&
      !isLoading &&
      searchResults?.length > 0 &&
      activeSection === 'home'
    ) {
      return (
        <div className="results-section">
          <div className="results-header">
            <h2 className="results-title">
              {t('search:resultsTitle', { count: totalResults || 0 })}
            </h2>
          </div>

          <div className="results-grid">
            {searchResults?.map((artist) => (
              <ArtistCard
                key={artist.id}
                artist={artist}
                onClick={() => handleArtistClick(artist.id)}
                showFollowers={true}
              />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="load-more-section">
              <button
                className="load-more-button"
                onClick={loadMore}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? (
                  <span>{t('search:loadingMore', 'Carregando...')}</span>
                ) : (
                  <span>{t('search:loadMore', 'Carregar mais artistas')}</span>
                )}
              </button>
            </div>
          )}
        </div>
      )
    }

    // Show no results only when search is complete and no results found (only for home section)
    if (
      searchQuery &&
      debouncedQuery &&
      !isLoading &&
      searchResults?.length === 0 &&
      activeSection === 'home'
    ) {
      return (
        <div className="no-results-section">
          <div className="no-results-content">
            <span className="no-results-icon">{t('icons:icons.note')}</span>
            <h2 className="no-results-title">{t('search:noResultsTitle')}</h2>
            <p className="no-results-message">{t('search:noResultsMessage')}</p>
          </div>
        </div>
      )
    }

    // Show hero section only when not authenticated and no search query and activeSection is home
    if (!isAuthenticated && !searchQuery && activeSection === 'home') {
      return (
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              {t('home:heroTitle')} <MusicIcon size={32} />
            </h1>
            <p className="hero-subtitle">
              {t('home:heroSubtitle')} {t('icons:icons.microphone')}
            </p>
            <div className="hero-features">
              <div className="feature">
                <span className="feature-icon">{t('icons:icons.guitar')}</span>
                <span className="feature-text">{t('home:feature1')}</span>
              </div>
              <div className="feature">
                <span className="feature-icon">{t('icons:icons.piano')}</span>
                <span className="feature-text">{t('home:feature2')}</span>
              </div>
              <div className="feature">
                <span className="feature-icon">{t('icons:icons.drums')}</span>
                <span className="feature-text">{t('home:feature3')}</span>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Show welcome section when no search query and activeSection is home
    if (!searchQuery && activeSection === 'home') {
      return (
        <div className="home-content">
          {/* Popular Artists Section */}
          <PopularArtistsSection
            artists={popularArtists}
            isLoading={isLoadingPopular}
            error={popularError}
            onArtistClick={handleArtistClick}
          />

          {/* Welcome Section */}
          <div className="welcome-section">
            <div className="welcome-content">
              <h2 className="welcome-title">{t('search:welcomeTitle')}</h2>
              <p className="welcome-message">{t('search:welcomeMessage')}</p>
              <div className="search-tips">
                <div className="tip">
                  <span className="tip-icon">
                    {t('icons:icons.microphone')}
                  </span>
                  <span className="tip-text">{t('search:tip1')}</span>
                </div>
                <div className="tip">
                  <span className="tip-icon">{t('icons:icons.guitar')}</span>
                  <span className="tip-text">{t('search:tip2')}</span>
                </div>
                <div className="tip">
                  <span className="tip-icon">{t('icons:icons.piano')}</span>
                  <span className="tip-text">{t('search:tip3')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Fallback - should not reach here
    return null
  }

  return (
    <div data-testid="home-page">
      <SEOHead
        title={t('seo:homeTitle')}
        description={t('seo:homeDescription')}
        keywords={t('seo:defaultKeywords')}
      />
      <StructuredData
        type="website"
        title={t('seo:homeTitle')}
        description={t('seo:homeDescription')}
        url={window.location.href}
        image="/og-image.jpg"
      />

      <div className="app-layout">
        <Sidebar
          activeSection={activeSection}
          onNavItemClick={setActiveSection}
        />
        <div className="main-area">
          <Header onSearch={searchArtists} />
          <main className="main-content">{renderMainContent()}</main>
        </div>
      </div>
    </div>
  )
}
