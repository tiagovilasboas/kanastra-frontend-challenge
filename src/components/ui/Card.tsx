import { Card as MantineCard, type CardProps as MantineCardProps } from '@mantine/core'
import { forwardRef } from 'react'

import { spotifyStyles } from '@/lib/design-system/utils'

export interface CardProps extends MantineCardProps {
  variant?: 'default' | 'elevated' | 'interactive'
  size?: 'sm' | 'md' | 'lg'
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', size = 'md', children, style, ...props }, ref) => {
    const getVariantStyles = () => {
      switch (variant) {
        case 'default':
          return {
            backgroundColor: '#181818',
            '&:hover': {},
          }
        case 'elevated':
          return {
            backgroundColor: '#282828',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
            '&:hover': {},
          }
        case 'interactive':
          return {
            backgroundColor: '#181818',
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: '#282828',
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
            },
          }
        default:
          return {}
      }
    }

    const getSizeStyles = () => {
      switch (size) {
        case 'sm':
          return {
            padding: '12px',
            borderRadius: '8px',
          }
        case 'md':
          return {
            padding: '16px',
            borderRadius: '12px',
          }
        case 'lg':
          return {
            padding: '24px',
            borderRadius: '16px',
          }
        default:
          return {}
      }
    }

    const cardStyles = {
      ...spotifyStyles.transitionNormal,
      ...getVariantStyles(),
      ...getSizeStyles(),
      ...style,
    }

    return (
      <MantineCard
        ref={ref}
        variant="unstyled"
        style={cardStyles}
        {...props}
      >
        {children}
      </MantineCard>
    )
  }
)

Card.displayName = 'Card' 