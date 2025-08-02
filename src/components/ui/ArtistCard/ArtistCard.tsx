import { Play } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useArtistPrefetch } from '@/hooks/useArtistPrefetch'
import { SpotifyArtist } from '@/types/spotify'
import {
  formatFollowers,
  getPopularityColor,
  translateGenres,
} from '@/utils/formatters'

import styles from './ArtistCard.module.css'

interface ArtistCardProps {
  artist: SpotifyArtist
  onClick?: (artist: SpotifyArtist) => void
  showGenres?: boolean
  showFollowers?: boolean
}

export function ArtistCard({
  artist,
  onClick,
  showGenres = false,
  showFollowers = false,
}: ArtistCardProps) {
  const { t, i18n } = useTranslation()
  const { prefetchArtistOnHover, prefetchArtistOnFocus } = useArtistPrefetch()

  const handleClick = () => {
    onClick?.(artist)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick?.(artist)
    }
  }

  const handleMouseEnter = () => {
    // Prefetch artist data on hover for better UX
    prefetchArtistOnHover(artist.id)
  }

  const handleFocus = () => {
    // Prefetch artist data on focus for keyboard navigation
    prefetchArtistOnFocus(artist.id)
  }

  return (
    <div
      data-testid="artist-card"
      className={styles.artistCard}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onFocus={handleFocus}
      tabIndex={0}
    >
      <img
        src={artist.images[0]?.url || '/placeholder-artist.jpg'}
        alt={artist.name}
        className={styles.artistImage}
        onError={(e) => {
          e.currentTarget.src = '/placeholder-artist.jpg'
        }}
      />

      <div className={styles.cardOverlay}>
        <button
          className={styles.playButton}
          aria-label={t('ui:artistCard.playArtist', 'Play artist')}
        >
          <Play size={24} />
        </button>
      </div>

      <div className={styles.artistContent}>
        <h3 data-testid="artist-name" className={styles.artistName}>
          {artist.name}
        </h3>

        <div className={styles.artistMetadata}>
          <div className={styles.artistPopularity}>
            <span>{t('ui:artistCard.popularity', 'Popularity')}</span>
            <div
              data-testid="artist-popularity"
              className={styles.artistPopularityDot}
              style={{ backgroundColor: getPopularityColor(artist.popularity || 0) }}
            />
            <span>
              {t('ui:artistCard.popularityWithValue', {
                value: artist.popularity || 0,
                defaultValue: '{{value}}%',
              })}
            </span>
          </div>

          {showFollowers && artist.followers?.total && (
            <div className={styles.artistFollowers}>
              <span>{t('ui:artistCard.followers', 'Followers')}</span>
              <span data-testid="artist-followers">
                {formatFollowers(artist.followers.total)}
              </span>
            </div>
          )}
        </div>

        {showGenres && artist.genres?.length > 0 && (
          <div className={styles.artistGenres}>
            {translateGenres(artist.genres.slice(0, 3), i18n.language).map(
              (genre) => (
                <span key={genre} className={styles.artistGenre}>
                  {genre}
                </span>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  )
}
