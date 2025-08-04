import { Play } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useArtistPrefetch } from '@/hooks/useArtistPrefetch'
import { SpotifyArtist } from '@/types/spotify'
import {
  formatFollowers,
  getPopularityColor,
  translateGenres,
} from '@/utils/formatters'

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
      className="bg-gray-800 rounded-lg p-4 transition-all duration-200 cursor-pointer relative overflow-hidden flex flex-col gap-3 min-h-[200px] hover:bg-gray-700 hover:-translate-y-1 hover:shadow-xl active:translate-y-0 focus-visible:outline-2 focus-visible:outline-[#1DB954] focus-visible:outline-offset-2"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onFocus={handleFocus}
      tabIndex={0}
    >
      {/* Artist Image */}
      <img
        src={artist.images[0]?.url || '/placeholder-artist.jpg'}
        alt={artist.name}
        className="w-full h-32 rounded object-cover bg-gray-700 transition-transform duration-200 hover:scale-105"
        onError={(e) => {
          e.currentTarget.src = '/placeholder-artist.jpg'
        }}
      />

      {/* Play Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
        <button
          className="w-12 h-12 bg-[#1DB954] rounded-full flex items-center justify-center text-black hover:bg-[#1ed760] hover:scale-110 transition-all duration-200"
          aria-label={t('ui:artistCard.playArtist', 'Play artist')}
        >
          <Play size={24} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-2">
        <h3
          data-testid="artist-name"
          className="font-bold text-white text-base leading-tight overflow-hidden text-ellipsis whitespace-nowrap"
        >
          {artist.name}
        </h3>

        <div className="flex flex-col gap-2">
          {/* Popularity */}
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>{t('ui:artistCard.popularity', 'Popularity')}</span>
            <div
              data-testid="artist-popularity"
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{
                backgroundColor: getPopularityColor(artist.popularity || 0),
              }}
            />
            <span>
              {t('ui:artistCard.popularityWithValue', {
                value: artist.popularity || 0,
                defaultValue: '{{value}}%',
              })}
            </span>
          </div>

          {/* Followers */}
          {showFollowers && artist.followers?.total && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>{t('ui:artistCard.followers', 'Followers')}</span>
              <span data-testid="artist-followers">
                {formatFollowers(artist.followers.total)}
              </span>
            </div>
          )}
        </div>

        {/* Genres */}
        {showGenres && artist.genres?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {translateGenres(artist.genres.slice(0, 3), i18n.language).map(
              (genre) => (
                <span
                  key={genre}
                  className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs font-medium"
                >
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
