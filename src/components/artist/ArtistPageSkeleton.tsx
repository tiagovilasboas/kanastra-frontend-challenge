import React from 'react'

export const ArtistPageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        <div className="animate-pulse space-y-6">
          {/* Header skeleton */}
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-muted rounded"></div>
            <div className="h-6 bg-muted rounded w-24"></div>
          </div>

          {/* Artist info skeleton */}
          <div className="flex flex-col md:flex-row gap-6 sm:gap-8">
            <div className="w-48 h-48 bg-muted rounded-lg flex-shrink-0"></div>
            <div className="space-y-4 flex-1">
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="flex gap-2">
                <div className="h-6 bg-muted rounded w-16"></div>
                <div className="h-6 bg-muted rounded w-20"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
