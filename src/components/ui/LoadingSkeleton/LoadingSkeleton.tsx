import { Skeleton } from '@mantine/core'

interface LoadingSkeletonProps {
  variant?:
    | 'artist-card'
    | 'track-item'
    | 'album-item'
    | 'search-results'
    | 'custom'
  count?: number
  className?: string
}

export function LoadingSkeleton({
  variant = 'artist-card',
  count = 1,
  className = '',
}: LoadingSkeletonProps) {
  const renderArtistCardSkeleton = () => (
    <div className="card-spotify">
      <Skeleton height={160} radius="md" className="mb-md" />
      <Skeleton height={20} width="80%" className="mb-sm" />
      <Skeleton height={16} width="60%" className="mb-sm" />
      <Skeleton height={16} width="40%" />
    </div>
  )

  const renderTrackItemSkeleton = () => (
    <div className="flex items-center gap-md p-sm">
      <Skeleton height={40} width={40} radius="sm" />
      <div className="flex-1">
        <Skeleton height={16} width="70%" className="mb-xs" />
        <Skeleton height={14} width="50%" />
      </div>
      <Skeleton height={16} width={60} />
    </div>
  )

  const renderAlbumItemSkeleton = () => (
    <div className="card-spotify">
      <Skeleton height={120} radius="md" className="mb-sm" />
      <Skeleton height={18} width="90%" className="mb-xs" />
      <Skeleton height={14} width="60%" />
    </div>
  )

  const renderSearchResultsSkeleton = () => (
    <div className="search-results-skeleton">
      {/* Header with search info */}
      <div className="search-header-skeleton mb-lg">
        <Skeleton height={24} width="200px" className="mb-sm" />
        <Skeleton height={16} width="150px" />
      </div>

      {/* Results grid */}
      <div className="results-grid-skeleton">
        {Array.from({ length: Math.min(count, 8) }).map((_, index) => (
          <div key={index} className="artist-card-skeleton">
            <Skeleton height={180} radius="lg" className="mb-md" />
            <Skeleton height={20} width="85%" className="mb-sm" />
            <Skeleton height={16} width="65%" className="mb-sm" />
            <Skeleton height={14} width="45%" />
          </div>
        ))}
      </div>
    </div>
  )

  const renderSkeleton = () => {
    switch (variant) {
      case 'artist-card':
        return renderArtistCardSkeleton()
      case 'track-item':
        return renderTrackItemSkeleton()
      case 'album-item':
        return renderAlbumItemSkeleton()
      case 'search-results':
        return renderSearchResultsSkeleton()
      case 'custom':
        return (
          <div className={className}>
            <Skeleton height={20} className="mb-sm" />
            <Skeleton height={16} width="80%" />
          </div>
        )
      default:
        return renderArtistCardSkeleton()
    }
  }

  if (variant === 'search-results') {
    return renderSearchResultsSkeleton()
  }

  if (count === 1) {
    return renderSkeleton()
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-md"
      data-testid="loading-skeleton"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </div>
  )
}
