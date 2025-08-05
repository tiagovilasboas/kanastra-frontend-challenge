import { Clock, Play } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { SpotifyEpisode } from '@/types/spotify'
import { formatDuration } from '@/utils/formatters'

interface EpisodeCardProps {
  episode: SpotifyEpisode
  onClick?: () => void
}

export const EpisodeCard: React.FC<EpisodeCardProps> = ({
  episode,
  onClick,
}) => {
  const { t } = useTranslation()

  const episodeImage = episode.images?.[0]?.url

  return (
    <Card
      className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg"
      onClick={onClick}
    >
      <CardHeader className="p-0">
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          {episodeImage ? (
            <img
              src={episodeImage}
              alt={episode.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-600 to-gray-800">
              <Play className="h-16 w-16 text-gray-400" />
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="rounded-full bg-black/50 p-3">
              <Play className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="line-clamp-2 font-semibold text-foreground group-hover:text-primary">
          {episode.name}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {episode.show?.name || t('search:unknownShow', 'Show desconhecido')}
        </p>
        {episode.description && (
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
            {episode.description}
          </p>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{formatDuration(episode.duration_ms)}</span>
          </div>
          {episode.explicit && (
            <span className="rounded-full bg-orange-100 px-2 py-1 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
              {t('episodes:explicit', 'Explícito')}
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
