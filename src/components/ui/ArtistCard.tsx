import { Badge, Card, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'

import { SpotifyArtist } from '@/types/spotify'

import { SpotifyIcon } from './SpotifyIcon'

export interface ArtistCardProps {
  artist: SpotifyArtist
  onClick?: (artist: SpotifyArtist) => void
  showGenres?: boolean
  showFollowers?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export const ArtistCard = ({
  artist,
  onClick,
  showGenres = true,
  showFollowers = true,
}: ArtistCardProps) => {
  const { t } = useTranslation()

  const handleClick = () => {
    if (onClick) {
      onClick(artist)
    }
  }

  const getImageUrl = () => {
    if (artist.images && artist.images.length > 0) {
      // Retornar a imagem de tamanho médio ou a primeira disponível
      const mediumImage = artist.images.find(
        (img) => img.width >= 300 && img.width <= 600,
      )
      return mediumImage?.url || artist.images[0].url
    }
    return '/placeholder-artist.jpg' // Imagem placeholder
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

  const getPopularityClass = (popularity: number) => {
    if (popularity >= 80) return 'high'
    if (popularity >= 60) return 'medium'
    return 'low'
  }

  return (
    <Card variant="unstyled" className="artist-card" onClick={handleClick}>
      {/* Imagem do artista */}
      <div className="relative">
        <img
          src={getImageUrl()}
          alt={artist.name}
          className="artist-card-image"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = '/placeholder-artist.jpg'
          }}
        />

        {/* Overlay com ícone de play */}
        {onClick && (
          <div className="absolute bottom-2 right-2 bg-spotify-green rounded-full w-10 h-10 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <SpotifyIcon icon="play" size="md" color="#FFFFFF" />
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="p-md">
        <div className="space-y-sm">
          {/* Nome do artista */}
          <Text className="artist-card-title">{artist.name}</Text>

          {/* Popularidade */}
          <div className="artist-card-popularity">
            <div
              className={`popularity-dot ${getPopularityClass(artist.popularity)}`}
            />
            <Text className="text-sm text-secondary">
              {artist.popularity}% {t('artist:popularity')}
            </Text>
          </div>

          {/* Seguidores */}
          {showFollowers && artist.followers && (
            <Text className="artist-card-followers">
              {formatFollowers(artist.followers.total)} {t('artist:followers')}
            </Text>
          )}

          {/* Gêneros */}
          {showGenres && artist.genres && artist.genres.length > 0 && (
            <div className="artist-card-genres">
              {artist.genres.slice(0, 3).map((genre, index) => (
                <Badge key={index} size="sm" className="genre-badge">
                  {genre}
                </Badge>
              ))}
              {artist.genres.length > 3 && (
                <Text className="text-xs text-secondary">
                  +{artist.genres.length - 3}
                </Text>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
