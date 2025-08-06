import React from 'react'

interface SearchLayoutProps {
  children: React.ReactNode
  className?: string
}

export const SearchLayout: React.FC<SearchLayoutProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`min-h-screen bg-background ${className}`}>
      <div className="max-w-7xl mx-auto">{children}</div>
    </div>
  )
}
