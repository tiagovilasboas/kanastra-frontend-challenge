import { forwardRef } from 'react'
import { Card as MantineCard, CardProps as MantineCardProps } from '@mantine/core'

import styles from './Card.module.css'

export interface CardProps extends MantineCardProps {
  variant?: 'default' | 'elevated' | 'artist' | 'album'
  children: React.ReactNode
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', className, children, ...props }, ref) => {
    const getVariantClass = () => {
      switch (variant) {
        case 'default':
          return styles.cardDefault
        case 'elevated':
          return styles.cardElevated
        case 'artist':
          return styles.cardArtist
        case 'album':
          return styles.cardAlbum
        default:
          return styles.cardDefault
      }
    }

    const cardClasses = [
      styles.card,
      getVariantClass(),
      className,
    ]
      .filter(Boolean)
      .join(' ')

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