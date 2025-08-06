import React from 'react'

type GridLayout = 'compact' | 'standard' | 'large' | 'list'

interface ContentGridProps {
  children: React.ReactNode
  layout?: GridLayout
  className?: string
}

export const ContentGrid: React.FC<ContentGridProps> = ({
  children,
  layout = 'standard',
  className = '',
}) => {
  const getGridClasses = (layout: GridLayout): string => {
    switch (layout) {
      case 'compact':
        return 'grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
      case 'standard':
        return 'grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
      case 'large':
        return 'grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
      case 'list':
        return 'space-y-2'
      default:
        return 'grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
    }
  }

  return (
    <div className={`${getGridClasses(layout)} ${className}`}>{children}</div>
  )
}
