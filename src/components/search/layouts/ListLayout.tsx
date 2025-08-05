import React from 'react'

// List Layout Component - Reutilizável
interface ListLayoutProps {
  children: React.ReactNode
  className?: string
}

export const ListLayout: React.FC<ListLayoutProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {children}
    </div>
  )
} 