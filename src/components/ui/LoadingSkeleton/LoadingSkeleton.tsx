import React from 'react'

interface LoadingSkeletonProps {
  className?: string
  height?: string
  width?: string
  borderRadius?: string
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className = '',
  height = '20px',
  width = '100%',
  borderRadius = '4px',
}) => {
  return (
    <div
      className={`bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%] animate-pulse rounded ${className}`}
      style={{
        height,
        width,
        borderRadius,
      }}
    />
  )
}

// Page loading component
export const PageLoading: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-6xl flex flex-col gap-8">
        <LoadingSkeleton height="40px" width="60%" className="mb-6" />
        <LoadingSkeleton height="20px" width="80%" className="mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <LoadingSkeleton
              key={index}
              height="200px"
              width="100%"
              className="rounded-lg"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
