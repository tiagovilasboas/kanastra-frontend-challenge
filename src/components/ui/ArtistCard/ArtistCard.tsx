import { Play } from 'lucide-react'

import { SpotifyArtist } from '@/types/spotify'

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
  const handleClick = () => {
    onClick?.(artist)
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

  const getPopularityColor = (popularity: number) => {
    if (popularity >= 80) return '#1DB954'
    if (popularity >= 60) return '#fbbf24'
    if (popularity >= 40) return '#f59e0b'
    return '#ef4444'
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
        <button className={styles.playButton} aria-label="Play artist">
          <Play size={24} />
        </button>
      </div>
      
      <div className={styles.artistContent}>
        <h3 className={styles.artistName}>{artist.name}</h3>
        
        <div className={styles.artistMetadata}>
          <div className={styles.artistPopularity}>
            <span>Popularity</span>
            <div
              className={styles.artistPopularityDot}
              style={{ backgroundColor: getPopularityColor(artist.popularity) }}
            />
            <span>{artist.popularity}%</span>
          </div>
          
          {showFollowers && (
            <div className={styles.artistFollowers}>
              <span>Followers</span>
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