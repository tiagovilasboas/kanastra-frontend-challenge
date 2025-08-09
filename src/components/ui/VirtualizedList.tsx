import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { logger } from '@/utils/logger'

interface VirtualizedListProps<T> {
  items: T[]
  itemHeight: number
  containerHeight: number
  renderItem: (item: T, index: number, isVisible: boolean) => React.ReactNode
  overscan?: number
  className?: string
  onScroll?: (scrollTop: number) => void
  loadMore?: () => void
  hasNextPage?: boolean
  isLoading?: boolean
}

interface VirtualizedListState {
  scrollTop: number
  startIndex: number
  endIndex: number
  visibleRange: [number, number]
}

export function VirtualizedList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5,
  className = '',
  onScroll,
  loadMore,
  hasNextPage = false,
  isLoading = false,
}: VirtualizedListProps<T>) {
  const { t } = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<VirtualizedListState>({
    scrollTop: 0,
    startIndex: 0,
    endIndex: 0,
    visibleRange: [0, 0],
  })

  // Calculate virtual scrolling parameters
  const { totalHeight, startIndex, endIndex, offsetY } = useMemo(() => {
    const totalHeight = items.length * itemHeight
    const visibleItemsCount = Math.ceil(containerHeight / itemHeight)

    const startIndex = Math.max(
      0,
      Math.floor(state.scrollTop / itemHeight) - overscan,
    )
    const endIndex = Math.min(
      items.length - 1,
      startIndex + visibleItemsCount + overscan * 2,
    )

    const offsetY = startIndex * itemHeight

    return {
      totalHeight,
      startIndex,
      endIndex,
      offsetY,
    }
  }, [items.length, itemHeight, containerHeight, state.scrollTop, overscan])

  // Handle scroll events
  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const scrollTop = event.currentTarget.scrollTop

      setState((prev) => ({
        ...prev,
        scrollTop,
        startIndex,
        endIndex,
        visibleRange: [startIndex, endIndex],
      }))

      onScroll?.(scrollTop)

      // Trigger load more when near the end
      if (loadMore && hasNextPage && !isLoading) {
        const scrollPercentage = scrollTop / (totalHeight - containerHeight)
        if (scrollPercentage > 0.8) {
          logger.debug('VirtualizedList: Triggering load more', {
            scrollPercentage,
            scrollTop,
            totalHeight,
          })
          loadMore()
        }
      }
    },
    [
      startIndex,
      endIndex,
      onScroll,
      loadMore,
      hasNextPage,
      isLoading,
      totalHeight,
      containerHeight,
    ],
  )

  // Render visible items
  const visibleItems = useMemo(() => {
    const result: React.ReactNode[] = []

    for (let i = startIndex; i <= endIndex; i++) {
      if (i >= items.length) break

      const item = items[i]
      const isVisible = i >= state.visibleRange[0] && i <= state.visibleRange[1]

      result.push(
        <div
          key={i}
          style={{
            position: 'absolute',
            top: i * itemHeight,
            left: 0,
            right: 0,
            height: itemHeight,
          }}
        >
          {renderItem(item, i, isVisible)}
        </div>,
      )
    }

    return result
  }, [items, startIndex, endIndex, itemHeight, renderItem, state.visibleRange])

  // Performance monitoring
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      logger.debug('VirtualizedList: Render stats', {
        totalItems: items.length,
        visibleItems: endIndex - startIndex + 1,
        startIndex,
        endIndex,
        scrollTop: state.scrollTop,
      })
    }
  }, [items.length, startIndex, endIndex, state.scrollTop])

  return (
    <div
      ref={containerRef}
      className={`relative overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
      role="list"
      aria-label={t('common:virtualList', 'Virtual list')}
    >
      {/* Virtual scrollable area */}
      <div style={{ height: totalHeight, position: 'relative' }}>
        {/* Spacer for items above visible area */}
        <div style={{ height: offsetY }} />

        {/* Visible items container */}
        <div
          style={{
            position: 'relative',
            height: (endIndex - startIndex + 1) * itemHeight,
          }}
        >
          {visibleItems}
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div className="text-sm text-muted-foreground">
              {isLoading ? t('common:loading', 'Loading...') : ''}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Specialized component for track lists
interface Track {
  id: string
  name: string
  artists: Array<{ name: string }>
}

interface VirtualizedTrackListProps {
  tracks: Track[]
  onTrackClick?: (track: Track, index: number) => void
  containerHeight?: number
  isLoading?: boolean
  hasNextPage?: boolean
  loadMore?: () => void
}

export function VirtualizedTrackList({
  tracks,
  onTrackClick,
  containerHeight = 400,
  isLoading = false,
  hasNextPage = false,
  loadMore,
}: VirtualizedTrackListProps) {
  const renderTrackItem = useCallback(
    (track: Track, index: number, isVisible: boolean) => {
      if (!isVisible) {
        // Return placeholder for non-visible items to maintain layout
        return <div className="h-12 bg-muted/10" />
      }

      return (
        <div
          className="flex items-center gap-3 p-2 hover:bg-muted/50 cursor-pointer rounded"
          onClick={() => onTrackClick?.(track, index)}
          role="listitem"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onTrackClick?.(track, index)
            }
          }}
        >
          <div className="w-8 text-right text-xs text-muted-foreground">
            {index + 1}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{track.name}</div>
            <div className="text-xs text-muted-foreground truncate">
              {track.artists?.map((artist) => artist.name).join(', ')}
            </div>
          </div>
        </div>
      )
    },
    [onTrackClick],
  )

  return (
    <VirtualizedList
      items={tracks}
      itemHeight={48} // 12 * 4 = 48px (h-12)
      containerHeight={containerHeight}
      renderItem={renderTrackItem}
      overscan={10}
      loadMore={loadMore}
      hasNextPage={hasNextPage}
      isLoading={isLoading}
      className="border rounded-lg"
    />
  )
}

// Specialized component for artist grids
interface Artist {
  id: string
  name: string
  images: Array<{ url: string }>
}

interface VirtualizedArtistGridProps {
  artists: Artist[]
  onArtistClick?: (artist: Artist, index: number) => void
  containerHeight?: number
  columnsPerRow?: number
  itemHeight?: number
  isLoading?: boolean
  hasNextPage?: boolean
  loadMore?: () => void
}

export function VirtualizedArtistGrid({
  artists,
  onArtistClick,
  containerHeight = 600,
  columnsPerRow = 5,
  itemHeight = 200,
  isLoading = false,
  hasNextPage = false,
  loadMore,
}: VirtualizedArtistGridProps) {
  // Convert artists array to rows for virtualization
  const rows = useMemo(() => {
    const result: Array<Artist[]> = []
    for (let i = 0; i < artists.length; i += columnsPerRow) {
      result.push(artists.slice(i, i + columnsPerRow))
    }
    return result
  }, [artists, columnsPerRow])

  const renderRow = useCallback(
    (row: Artist[], rowIndex: number, isVisible: boolean) => {
      if (!isVisible) {
        return <div className="h-full bg-muted/10" />
      }

      return (
        <div
          className="grid gap-4 p-4"
          style={{ gridTemplateColumns: `repeat(${columnsPerRow}, 1fr)` }}
        >
          {row.map((artist, colIndex) => {
            const artistIndex = rowIndex * columnsPerRow + colIndex
            return (
              <div
                key={artist.id}
                className="flex flex-col items-center gap-2 p-3 hover:bg-muted/50 cursor-pointer rounded-lg transition-colors"
                onClick={() => onArtistClick?.(artist, artistIndex)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onArtistClick?.(artist, artistIndex)
                  }
                }}
              >
                <div className="w-24 h-24 rounded-full overflow-hidden bg-muted">
                  {artist.images?.[0] && (
                    <img
                      src={artist.images[0].url}
                      alt={artist.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  )}
                </div>
                <div className="text-sm font-medium text-center truncate w-full">
                  {artist.name}
                </div>
              </div>
            )
          })}
        </div>
      )
    },
    [columnsPerRow, onArtistClick],
  )

  return (
    <VirtualizedList
      items={rows}
      itemHeight={itemHeight}
      containerHeight={containerHeight}
      renderItem={renderRow}
      overscan={2}
      loadMore={loadMore}
      hasNextPage={hasNextPage}
      isLoading={isLoading}
      className="border rounded-lg"
    />
  )
}
