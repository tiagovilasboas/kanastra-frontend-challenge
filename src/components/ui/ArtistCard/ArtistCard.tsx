import { Play } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { SpotifyArtist } from '@/types/spotify'
import { formatFollowers, getPopularityColor } from '@/utils/formatters'

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
  const { t } = useTranslation()

  const handleClick = () => {
    onClick?.(artist)
  }

  return (
    <div className={styles.artistCard} onClick={handleClick}>
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
          aria-label={t('artistCard:playArtist', 'Play artist')}
        >
          <Play size={24} />
        </button>
      </div>

      <div className={styles.artistContent}>
        <h3 className={styles.artistName}>{artist.name}</h3>

        <div className={styles.artistMetadata}>
          <div className={styles.artistPopularity}>
            <span>{t('artistCard:popularity', 'Popularity')}</span>
            <div
              className={styles.artistPopularityDot}
              style={{ backgroundColor: getPopularityColor(artist.popularity) }}
            />
            <span>
              {t('artistCard:popularityWithValue', {
                value: artist.popularity,
                defaultValue: '{{value}}%',
              })}
            </span>
          </div>

          {showFollowers && (
            <div className={styles.artistFollowers}>
              <span>{t('artistCard:followers', 'Followers')}</span>
              <span>{formatFollowers(artist.followers.total)}</span>
            </div>
          )}
        </div>

        {showGenres && artist.genres.length > 0 && (
          <div className={styles.artistGenres}>
            {artist.genres.slice(0, 3).map((genre) => (
              <span key={genre} className={styles.artistGenre}>
                {genre}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
