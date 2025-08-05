import React from 'react'

// Grid Layout Component - Reutilizável
interface GridLayoutProps {
  children: React.ReactNode
  cols?: number
  className?: string
}

export const GridLayout: React.FC<GridLayoutProps> = ({ 
  children, 
  cols = 4,
  className = '' 
}) => {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-4',
    6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6'
  }

  return (
    <div className={`grid gap-4 ${gridCols[cols as keyof typeof gridCols]} ${className}`}>
      {children}
    </div>
  )
} 