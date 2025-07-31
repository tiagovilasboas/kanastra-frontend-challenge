import { Card, Text, Group, Stack, Badge } from '@mantine/core'
import { useTranslation } from 'react-i18next'

import { SpotifyIcon } from './SpotifyIcon'
import { spotifyStyles } from '@/lib/design-system/utils'
import { SpotifyArtist } from '@/types/spotify'

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
  size = 'md',
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
      const mediumImage = artist.images.find(img => img.width >= 300 && img.width <= 600)
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

  const getPopularityColor = (popularity: number) => {
    if (popularity >= 80) return '#1DB954'
    if (popularity >= 60) return '#1ed760'
    if (popularity >= 40) return '#1aa34a'
    return '#727272'
  }

  const cardStyles = {
    ...spotifyStyles.bgCard,
    ...spotifyStyles.transitionSpotify,
    cursor: onClick ? 'pointer' : 'default',
    overflow: 'hidden',
    '&:hover': onClick ? {
      ...spotifyStyles.bgCardHover,
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
    } : {},
  }

  const imageStyles = {
    width: '100%',
    height: size === 'sm' ? '120px' : size === 'md' ? '160px' : '200px',
    objectFit: 'cover' as const,
    borderRadius: '8px',
  }

  const contentStyles = {
    padding: size === 'sm' ? '12px' : size === 'md' ? '16px' : '20px',
  }

  return (
    <Card
      variant="interactive"
      style={cardStyles}
      onClick={handleClick}
    >
      {/* Imagem do artista */}
      <div style={{ position: 'relative' }}>
        <img
          src={getImageUrl()}
          alt={artist.name}
          style={imageStyles}
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = '/placeholder-artist.jpg'
          }}
        />
        
        {/* Overlay com ícone de play */}
        {onClick && (
          <div
            style={{
              position: 'absolute',
              bottom: '8px',
              right: '8px',
              backgroundColor: '#1DB954',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0,
              transition: 'opacity 0.2s ease-in-out',
            }}
            className="play-button"
          >
            <SpotifyIcon icon="play" size="md" color="#FFFFFF" />
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div style={contentStyles}>
        <Stack gap="sm">
          {/* Nome do artista */}
          <Text
            style={{
              ...spotifyStyles.textPrimary,
              ...spotifyStyles.fontWeightSemibold,
              ...spotifyStyles.textLg,
              lineHeight: 1.2,
            }}
            lineClamp={2}
          >
            {artist.name}
          </Text>

          {/* Popularidade */}
          <Group gap="xs" align="center">
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: getPopularityColor(artist.popularity),
              }}
            />
            <Text
              style={{
                ...spotifyStyles.textSecondary,
                ...spotifyStyles.textSm,
              }}
            >
              {artist.popularity}% {t('artist.popularity')}
            </Text>
          </Group>

          {/* Seguidores */}
          {showFollowers && artist.followers && (
            <Text
              style={{
                ...spotifyStyles.textSecondary,
                ...spotifyStyles.textSm,
              }}
            >
              {formatFollowers(artist.followers.followers)} {t('artist.followers')}
            </Text>
          )}

          {/* Gêneros */}
          {showGenres && artist.genres && artist.genres.length > 0 && (
            <Group gap="xs" wrap="wrap">
              {artist.genres.slice(0, 3).map((genre, index) => (
                <Badge
                  key={index}
                  size="sm"
                  style={{
                    backgroundColor: '#282828',
                    color: '#B3B3B3',
                    border: '1px solid #404040',
                    fontSize: '10px',
                    padding: '2px 8px',
                  }}
                >
                  {genre}
                </Badge>
              ))}
              {artist.genres.length > 3 && (
                <Text
                  style={{
                    ...spotifyStyles.textSecondary,
                    ...spotifyStyles.textXs,
                  }}
                >
                  +{artist.genres.length - 3}
                </Text>
              )}
            </Group>
          )}
        </Stack>
      </div>

      <style jsx>{`
        .play-button {
          opacity: 0;
        }
        
        .artist-card:hover .play-button {
          opacity: 1;
        }
      `}</style>
    </Card>
  )
} 