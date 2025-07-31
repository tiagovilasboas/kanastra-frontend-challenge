import { Card as MantineCard, type CardProps as MantineCardProps } from '@mantine/core'
import { forwardRef } from 'react'

export interface CardProps extends MantineCardProps {
  variant?: 'default' | 'elevated' | 'interactive' | 'artist' | 'album'
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', className, children, ...props }, ref) => {
    const getCardClass = () => {
      const baseClass = 'card-spotify'
      
      switch (variant) {
        case 'default':
          return baseClass
        case 'elevated':
          return `${baseClass} shadow-lg`
        case 'interactive':
          return `${baseClass} hover-lift cursor-pointer`
        case 'artist':
          return `${baseClass} hover-lift cursor-pointer`
        case 'album':
          return `${baseClass} hover-lift cursor-pointer`
        default:
          return baseClass
      }
    }

    return (
      <MantineCard
        ref={ref}
        variant="unstyled"
        className={`${getCardClass()} ${className || ''}`}
        {...props}
      >
        {children}
      </MantineCard>
    )
  }
)

Card.displayName = 'Card' 