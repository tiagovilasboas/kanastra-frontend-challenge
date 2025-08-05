import { Music } from 'lucide-react'
import React from 'react'

// Base Item Component - Reutilizável
interface BaseItemProps {
  image?: string
  title: string
  subtitle?: string
  icon?: React.ReactNode
  onClick?: () => void
  className?: string
}

export const BaseItem: React.FC<BaseItemProps> = ({
  image,
  title,
  subtitle,
  icon,
  onClick,
  className = ''
}) => {
  return (
    <div 
      className={`space-y-2 cursor-pointer hover:opacity-80 transition-opacity ${className}`}
      onClick={onClick}
    >
      <div className="aspect-square rounded overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            {icon || <Music className="h-8 w-8" />}
          </div>
        )}
      </div>
      <div>
        <h4 className="font-medium text-sm text-foreground truncate">{title}</h4>
        {subtitle && (
          <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
        )}
      </div>
    </div>
  )
} 