import { Settings } from 'lucide-react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { MobileNavigation } from '@/components/layout'
import { LanguageSelector } from '@/components/ui/LanguageSelector'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { useArtistPrefetch } from '@/hooks/useArtistPrefetch'
import { usePopularArtists } from '@/hooks/usePopularArtists'
import { useSpotifySearch } from '@/hooks/useSpotifySearch'
import { useToast } from '@/hooks/useToast'

interface MobileLayoutProps {
  onSearch?: (query: string) => void
}

export const MobileLayout: React.FC<MobileLayoutProps> = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { showError } = useToast()
  const { prefetchArtistData } = useArtistPrefetch()

  const [activeSection, setActiveSection] = useState<
    'home' | 'search' | 'library' | 'download' | 'profile'
  >('home')

  // Real data hooks - same as desktop
  const { searchResults, isLoading, error, searchQuery } = useSpotifySearch()

  const {
    artists: popularArtists,
    isLoading: isLoadingPopular,
    error: popularError,
  } = usePopularArtists({ limit: 6, enabled: !searchQuery })

  const handleSectionChange = (section: typeof activeSection) => {
    setActiveSection(section)
  }

  const handleArtistClick = (artistId: string) => {
    prefetchArtistData(artistId)
    navigate(`/artist/${artistId}`)
  }

  // Handle errors with toasts
  if (error) {
    showError('search:errorMessage')
  }

  if (popularError) {
    showError('home:trendingError')
  }

  return (
    <div className="mobile-layout">
      {/* Header */}
      <header className="mobile-header">
        <div className="mobile-header-content">
          <h1 className="mobile-app-title">
            {t('app:title', 'Spotify Explorer')}
          </h1>
          <div className="mobile-header-actions">
            <LanguageSelector size="compact" />
            <button
              className="mobile-settings-button"
              aria-label={t('ui:settings', 'Configurações')}
            >
              <Settings size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mobile-main-content">
        {activeSection === 'home' && (
          <div className="mobile-home-content">
            {/* Show loading skeleton when searching */}
            {isLoading && searchQuery && (
              <LoadingSkeleton variant="search-results" count={6} />
            )}

            {/* Show search results */}
            {searchQuery &&
              !isLoading &&
              searchResults &&
              searchResults.length > 0 && (
                <div className="mobile-search-results">
                  <h2 className="mobile-results-title">
                    {t('search:resultsTitle', { count: searchResults.length })}
                  </h2>
                  <div className="mobile-results-grid">
                    {searchResults.map((artist) => (
                      <div
                        key={artist.id}
                        className="mobile-artist-card"
                        onClick={() => handleArtistClick(artist.id)}
                      >
                        <div className="mobile-artist-image">
                          {artist.images?.[0]?.url ? (
                            <img
                              src={artist.images[0].url}
                              alt={artist.name}
                              className="mobile-artist-img"
                            />
                          ) : (
                            <div className="mobile-artist-placeholder">
                              <span>{artist.name.charAt(0)}</span>
                            </div>
                          )}
                        </div>
                        <div className="mobile-artist-info">
                          <h3 className="mobile-artist-name">{artist.name}</h3>
                          <p className="mobile-artist-followers">
                            {t('artist:followers', {
                              count: artist.followers?.total || 0,
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Show no results */}
            {searchQuery &&
              !isLoading &&
              searchResults &&
              searchResults.length === 0 && (
                <div className="mobile-no-results">
                  <h2>{t('search:noResultsTitle')}</h2>
                  <p>{t('search:noResultsMessage')}</p>
                </div>
              )}

            {/* Show popular artists when no search */}
            {!searchQuery && (
              <div className="mobile-popular-artists">
                <h2 className="mobile-section-title">
                  {t('home:trendingArtists')}
                </h2>
                {isLoadingPopular ? (
                  <LoadingSkeleton variant="search-results" count={6} />
                ) : (
                  <div className="mobile-artists-grid">
                    {popularArtists?.map((artist) => (
                      <div
                        key={artist.id}
                        className="mobile-artist-card"
                        onClick={() => handleArtistClick(artist.id)}
                      >
                        <div className="mobile-artist-image">
                          {artist.images?.[0]?.url ? (
                            <img
                              src={artist.images[0].url}
                              alt={artist.name}
                              className="mobile-artist-img"
                            />
                          ) : (
                            <div className="mobile-artist-placeholder">
                              <span>{artist.name.charAt(0)}</span>
                            </div>
                          )}
                        </div>
                        <div className="mobile-artist-info">
                          <h3 className="mobile-artist-name">{artist.name}</h3>
                          <p className="mobile-artist-followers">
                            {t('artist:followers', {
                              count: artist.followers?.total || 0,
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeSection === 'search' && (
          <div className="mobile-search-content">
            <div className="mobile-search-placeholder">
              <h2>{t('search:title')}</h2>
              <p>{t('search:description')}</p>
            </div>
          </div>
        )}

        {activeSection === 'library' && (
          <div className="mobile-library-content">
            <h2>{t('navigation:library', 'Sua Biblioteca')}</h2>
            <p>
              {t(
                'navigation:libraryMessage',
                'Sua biblioteca de músicas aparecerá aqui',
              )}
            </p>
          </div>
        )}

        {activeSection === 'download' && (
          <div className="mobile-download-content">
            <h2>{t('navigation:download', 'Baixar aplicativo')}</h2>
            <p>
              {t(
                'navigation:downloadMessage',
                'Baixe o aplicativo para ouvir offline',
              )}
            </p>
          </div>
        )}

        {activeSection === 'profile' && (
          <div className="mobile-profile-content">
            <h2>{t('navigation:profile', 'Perfil')}</h2>
            <p>
              {t(
                'navigation:profileMessage',
                'Gerencie sua conta e configurações',
              )}
            </p>
          </div>
        )}
      </main>

      {/* Mobile Navigation */}
      <MobileNavigation
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />
    </div>
  )
}
