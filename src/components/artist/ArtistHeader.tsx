import { ArrowLeft, ExternalLink, RefreshCw } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SpotifyArtist } from '@/types/spotify'

interface ArtistHeaderProps {
  artist: SpotifyArtist
  isLoading: boolean
  onBackToHome: () => void
  onRefresh: () => void
}

export const ArtistHeader: React.FC<ArtistHeaderProps> = ({
  artist,
  isLoading,
  onBackToHome,
  onRefresh,
}) => {
  const { t } = useTranslation()

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
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBackToHome}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('common:back')}
        </Button>
        <Button variant="ghost" onClick={onRefresh} disabled={isLoading}>
          <RefreshCw
            className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}
          />
          {t('common:refresh')}
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
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              {artist.name}
            </h1>
            <p className="text-muted-foreground">
              {formatFollowers(artist.followers?.total || 0)}
              {t('artist:followers')}
            </p>
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
          {artist.popularity && (
            <div className="w-full sm:w-auto">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                <span className="text-sm text-muted-foreground">
                  {t('artist:popularity')}
                </span>
                <div className="w-full sm:w-32 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${artist.popularity}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground">
                  {artist.popularity}
                  {t('common:percent')}
                </span>
              </div>
            </div>
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
