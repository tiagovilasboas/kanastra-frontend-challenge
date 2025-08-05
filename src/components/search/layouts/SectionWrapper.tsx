import React from 'react'

// Section Wrapper Component - Reutilizável
interface SectionWrapperProps {
  title: string
  children: React.ReactNode
  className?: string
}

export const SectionWrapper: React.FC<SectionWrapperProps> = ({ 
  title, 
  children, 
  className = '' 
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      <h2 className="text-xl font-bold text-foreground">{title}</h2>
      {children}
    </div>
  )
} 