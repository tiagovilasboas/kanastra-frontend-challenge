import React from 'react'
import { useTranslation } from 'react-i18next'

/**
 * TrackListSkeleton – loading placeholder that mimics the table-like layout used by TrackList.
 * Shows header row and a few empty rows with muted background blocks.
 */
export const TrackListSkeleton: React.FC<{ rows?: number }> = ({
  rows = 6,
}) => {
  const { t } = useTranslation()

  return (
    <div className="space-y-1">
      {/* Header */}
      <div className="flex items-center gap-4 p-3 text-sm font-medium text-muted-foreground border-b border-border">
        <div className="w-8 text-center">{t('ui:numberSign', '#')}</div>
        <div className="w-10" />
        <div className="flex-1 min-w-0">{t('search:trackTitle', 'Title')}</div>
        <div className="hidden md:block flex-1 min-w-0">
          {t('search:album', 'Album')}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-muted rounded" />
        </div>
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="animate-pulse">
          <div className="flex items-center gap-4 p-3 rounded-lg">
            <div className="w-8 text-center">
              <div className="h-4 bg-muted rounded w-4 mx-auto" />
            </div>
            <div className="w-10 h-10 bg-muted rounded flex-shrink-0" />
            <div className="flex-1 min-w-0 space-y-1">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
            <div className="hidden md:block flex-1 min-w-0">
              <div className="h-4 bg-muted rounded w-2/3" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 bg-muted rounded w-8" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
