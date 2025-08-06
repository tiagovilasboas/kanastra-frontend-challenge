import React from 'react'

/**
 * GridSkeleton
 * Generic skeleton for grid-based card layouts (albums, playlists, shows, etc.).
 * Can render circle or square placeholders based on the `shape` prop to reuse the
 * same component for artists (circle) and other entities (square).
 */
interface GridSkeletonProps {
  /** Number of placeholder items to render (default 6) */
  count?: number
  /** Shape of the placeholder item: 'square' | 'circle' */
  shape?: 'square' | 'circle'
}

export const GridSkeleton: React.FC<GridSkeletonProps> = ({
  count = 6,
  shape = 'square',
}) => {
  const baseClasses = 'animate-pulse bg-muted'
  const makeItem = (key: number) => (
    <div
      key={key}
      data-testid="skeleton-card"
      className={`aspect-square rounded-lg ${baseClasses} ${shape === 'circle' ? 'rounded-full' : 'rounded-lg'}`}
    />
  )

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: count }).map((_, idx) => makeItem(idx))}
    </div>
  )
}
