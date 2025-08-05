import { BookOpen, Headphones } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { SpotifyAudiobook } from '@/types/spotify'

interface AudiobookCardProps {
  audiobook: SpotifyAudiobook
  onClick?: () => void
}

export const AudiobookCard: React.FC<AudiobookCardProps> = ({
  audiobook,
  onClick,
}) => {
  const { t } = useTranslation()

  const audiobookImage = audiobook.images?.[0]?.url

  return (
    <Card
      className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg"
      onClick={onClick}
    >
      <CardHeader className="p-0">
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          {audiobookImage ? (
            <img
              src={audiobookImage}
              alt={audiobook.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-600 to-gray-800">
              <Headphones className="h-16 w-16 text-gray-400" />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="line-clamp-2 font-semibold text-foreground group-hover:text-primary">
          {audiobook.name}
        </h3>
        {audiobook.description && (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {audiobook.description}
          </p>
        )}
        <div className="mt-2 space-y-1 text-xs text-muted-foreground">
          {audiobook.authors.length > 0 && (
            <div className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              <span>
                {t('audiobooks:by', 'by')}
                {t('common:space', ' ')}
                {audiobook.authors
                  ?.map(
                    (a) =>
                      a?.name || t('search:unknownAuthor', 'Unknown Author'),
                  )
                  .join(', ') || t('search:unknownAuthor', 'Unknown Author')}
              </span>
            </div>
          )}
          {audiobook.narrators.length > 0 && (
            <div className="flex items-center gap-1">
              <Headphones className="h-3 w-3" />
              <span>
                {t('audiobooks:narrated_by', 'narrated by')}
                {t('common:space', ' ')}
                {audiobook.narrators
                  ?.map(
                    (n) =>
                      n?.name ||
                      t('search:unknownNarrator', 'Unknown Narrator'),
                  )
                  .join(', ') ||
                  t('search:unknownNarrator', 'Unknown Narrator')}
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
          <span>
            {t('audiobooks:chapters', '{{count}} chapters', {
              count: audiobook.total_chapters,
            })}
          </span>
          {audiobook.explicit && (
            <span className="rounded-full bg-orange-100 px-2 py-1 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
              {t('audiobooks:explicit', 'Explicit')}
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
