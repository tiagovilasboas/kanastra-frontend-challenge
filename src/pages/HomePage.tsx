import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Header, Sidebar } from '@/components/layout'
import { ArtistCard } from '@/components/ui/ArtistCard'
import { AuthDebug } from '@/components/ui/AuthDebug'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { MusicIcon } from '@/components/ui/MusicIcon'
import { SearchDebug } from '@/components/ui/SearchDebug'
import { usePrefetch } from '@/hooks/usePrefetch'
import { useSpotifyAuth } from '@/hooks/useSpotifyAuth'
import { useSpotifySearch } from '@/hooks/useSpotifySearch'

export const HomePage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isAuthenticated } = useSpotifyAuth()
  const { prefetchArtistData } = usePrefetch()

  const [activeSection, setActiveSection] = useState<
    'home' | 'library' | 'create'
  >('home')
  const { searchResults, isLoading, error, searchArtists, searchQuery } =
    useSpotifySearch()

  const handleArtistClick = (artistId: string) => {
    navigate(`/artist/${artistId}`)
    prefetchArtistData(artistId)
  }

  const handleNavItemClick = (section: 'home' | 'library' | 'create') => {
    setActiveSection(section)

    switch (section) {
      case 'home':
        searchArtists('') // Clear search
        break
      case 'library':
        // TODO: Implement library functionality
        break
      case 'create':
        // TODO: Implement create playlist functionality
        break
    }
  }

  const renderMainContent = () => {
    // Show hero section only when on home and not authenticated
    if (!isAuthenticated && activeSection === 'home' && !searchQuery) {
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

    // Show library section
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

    // Show create playlist section
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

    // Show loading skeleton when searching
    if (isLoading && searchQuery) {
      return (
        <div className="main-content">
          <LoadingSkeleton variant="search-results" count={8} />
        </div>
      )
    }

    if (error) {
      return (
        <div className="error-section">
          <div className="error-content">
            <span className="error-icon">{t('icons:icons.note')}</span>
            <h2 className="error-title">{t('search:errorTitle')}</h2>
            <p className="error-message">{t('search:errorMessage')}</p>
          </div>
        </div>
      )
    }

    if (!searchQuery) {
      return (
        <div className="welcome-section">
          <div className="welcome-content">
            <h2 className="welcome-title">{t('search:welcomeTitle')}</h2>
            <p className="welcome-message">{t('search:welcomeMessage')}</p>
            <div className="search-tips">
              <div className="tip">
                <span className="tip-icon">{t('icons:icons.microphone')}</span>
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
      )
    }

    // Show no results only when search is complete and no results found
    if (searchQuery && !isLoading && searchResults?.length === 0) {
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

    // Show results when search is complete and has results
    if (searchQuery && !isLoading && searchResults?.length > 0) {
      return (
        <div className="results-section">
          <div className="results-header">
            <h2 className="results-title">
              {t('search:resultsTitle', { count: searchResults?.length || 0 })}
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
        </div>
      )
    }

    // Fallback - should not reach here
    return null
  }

  return (
    <div className="app-layout" data-testid="home-page">
      <AuthDebug show={true} />
      <SearchDebug />
      <Sidebar
        activeSection={activeSection}
        onNavItemClick={handleNavItemClick}
      />
      <div className="main-area">
        <Header onSearch={searchArtists} />
        <main className="main-content">{renderMainContent()}</main>
      </div>
    </div>
  )
}
