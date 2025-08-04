import {
  Card as MantineCard,
  CardProps as MantineCardProps,
} from '@mantine/core'
import { forwardRef } from 'react'

export interface CardProps extends MantineCardProps {
  variant?: 'default' | 'elevated' | 'artist' | 'album'
  children: React.ReactNode
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', className, children, ...props }, ref) => {
    const getVariantClass = () => {
      switch (variant) {
        case 'default':
          return 'bg-white rounded-xl shadow-sm transition-all duration-200 p-4'
        case 'elevated':
          return 'bg-white rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 p-4'
        case 'artist':
          return 'bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden p-4'
        case 'album':
          return 'bg-white rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer p-4'
        default:
          return 'bg-white rounded-xl shadow-sm transition-all duration-200 p-4'
      }
    }

    const cardClasses = [getVariantClass(), className].filter(Boolean).join(' ')

    return (
      <MantineCard
        ref={ref}
        className={cardClasses}
        shadow="none"
        padding={0}
        {...props}
      >
        {children}
      </MantineCard>
    )
  },
)

Card.displayName = 'Card'
