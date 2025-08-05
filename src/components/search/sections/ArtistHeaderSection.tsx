import { ArrowLeft, ExternalLink,RefreshCw } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { SpotifyArtist } from '@/types/spotify'

// Artist Header Section
interface ArtistHeaderSectionProps {
  artist: SpotifyArtist
  isLoading?: boolean
  onBackToHome?: () => void
  onRefresh?: () => void
  onArtistClick?: (artist: SpotifyArtist) => void
}

export const ArtistHeaderSection: React.FC<ArtistHeaderSectionProps> = ({
  artist,
  isLoading = false,
  onBackToHome,
  onRefresh,
  onArtistClick
}) => {
  const { t } = useTranslation()

  const handleArtistClick = () => {
    if (onArtistClick) {
      onArtistClick(artist)
    } else {
      // Default behavior: open in Spotify
      if (artist.external_urls?.spotify) {
        window.open(
          artist.external_urls.spotify,
          '_blank',
          'noopener,noreferrer',
        )
      }
    }
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

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex items-center gap-4">
        {onBackToHome && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBackToHome}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('common:back', 'Voltar')}
          </Button>
        )}
        
        {onRefresh && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {t('common:refresh', 'Atualizar')}
          </Button>
        )}
      </div>

      {/* Artist Info */}
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Artist Image */}
        <div className="flex-shrink-0">
          <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full overflow-hidden cursor-pointer hover:opacity-90 transition-opacity" onClick={handleArtistClick}>
            {artist.images && artist.images[0] ? (
              <img
                src={artist.images[0].url}
                alt={artist.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-4xl font-bold text-muted-foreground">
                  {artist.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Artist Details */}
        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              {artist.name}
            </h1>
            
            {artist.genres && artist.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {artist.genres.slice(0, 5).map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            {artist.followers && (
              <p className="text-muted-foreground">
                {t('artist:followers', '{{count}} seguidores', {
                  count: Number(formatFollowers(artist.followers.total)),
                })}
              </p>
            )}
            
            {artist.popularity !== undefined && (
              <p className="text-muted-foreground">
                {t('artist:popularity', 'Popularidade: {{score}}%', {
                  score: artist.popularity,
                })}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {artist.external_urls?.spotify && (
              <Button
                onClick={handleArtistClick}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                {t('artist:openInSpotify', 'Abrir no Spotify')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 