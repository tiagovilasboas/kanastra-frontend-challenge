import { ArrowLeft, ExternalLink, RefreshCw } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FollowersCount } from '@/components/ui/FollowersCount'
import { PopularityBar } from '@/components/ui/PopularityBar'
import { useNavigationHistory } from '@/hooks/useNavigationHistory'
import { SpotifyArtist } from '@/types/spotify'

interface ArtistHeaderProps {
  artist: SpotifyArtist
  isLoading: boolean
  onRefresh: () => void
}

export const ArtistHeader: React.FC<ArtistHeaderProps> = ({
  artist,
  isLoading,
  onRefresh,
}) => {
  const { t } = useTranslation()
  const { goBack } = useNavigationHistory()

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={goBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('common:back')}
        </Button>
        <Button variant="ghost" onClick={onRefresh} disabled={isLoading}>
          <RefreshCw
            className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}
          />
          {t('auth:refresh')}
        </Button>
      </div>

      {/* Artist Header */}
      <div className="flex flex-col md:flex-row gap-6 sm:gap-8">
        {/* Artist Image */}
        <div className="w-48 h-48 rounded-lg overflow-hidden bg-muted flex-shrink-0">
          {artist.images && artist.images.length > 0 ? (
            <img
              src={artist.images[0].url}
              alt={artist.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">
                {t('artist:noImage')}
              </span>
            </div>
          )}
        </div>

        {/* Artist Info */}
        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
              {artist.name}
            </h1>
            <FollowersCount count={artist.followers?.total || 0} />
          </div>

          {/* Genres */}
          {artist.genres && artist.genres.length > 0 && (
            <div>
              <h2 className="text-base font-semibold text-foreground mb-1">
                {t('artist:genres')}
              </h2>
              <div className="flex flex-wrap gap-2">
                {artist.genres.slice(0, 5).map((genre) => (
                  <Badge key={genre} variant="outline">
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Popularity */}
          {artist.popularity !== undefined && (
            <PopularityBar popularity={artist.popularity} />
          )}

          {/* External Link */}
          {artist.external_urls?.spotify && (
            <div className="w-full sm:w-auto">
              <Button asChild className="w-full sm:w-auto">
                <a
                  href={artist.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  {t('artist:openInSpotify')}
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
