import { Button as MantineButton, type ButtonProps as MantineButtonProps } from '@mantine/core'
import { forwardRef } from 'react'

import { spotifyStyles } from '@/lib/design-system/utils'

export interface ButtonProps extends Omit<MantineButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'spotify'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', children, style, ...props }, ref) => {
    const getVariantStyles = () => {
      switch (variant) {
        case 'primary':
          return {
            backgroundColor: '#1DB954',
            color: '#FFFFFF',
            border: 'none',
            '&:hover': {
              backgroundColor: '#1ed760',
              transform: 'scale(1.02)',
            },
            '&:active': {
              transform: 'scale(0.98)',
            },
          }
        case 'secondary':
          return {
            backgroundColor: 'transparent',
            color: '#FFFFFF',
            border: '1px solid #535353',
            '&:hover': {
              backgroundColor: '#282828',
              borderColor: '#B3B3B3',
            },
          }
        case 'ghost':
          return {
            backgroundColor: 'transparent',
            color: '#B3B3B3',
            border: 'none',
            '&:hover': {
              backgroundColor: '#282828',
              color: '#FFFFFF',
            },
          }
        case 'danger':
          return {
            backgroundColor: '#E91429',
            color: '#FFFFFF',
            border: 'none',
            '&:hover': {
              backgroundColor: '#d10f23',
            },
          }
        case 'spotify':
          return {
            background: 'linear-gradient(135deg, #1DB954 0%, #1ed760 100%)',
            color: '#FFFFFF',
            border: 'none',
            fontWeight: '600',
            '&:hover': {
              background: 'linear-gradient(135deg, #1ed760 0%, #1DB954 100%)',
              transform: 'scale(1.02)',
            },
            '&:active': {
              transform: 'scale(0.98)',
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
            height: '32px',
            padding: '0 16px',
            fontSize: '12px',
            borderRadius: '16px',
          }
        case 'md':
          return {
            height: '40px',
            padding: '0 24px',
            fontSize: '14px',
            borderRadius: '20px',
          }
        case 'lg':
          return {
            height: '48px',
            padding: '0 32px',
            fontSize: '16px',
            borderRadius: '24px',
          }
        default:
          return {}
      }
    }

    const buttonStyles = {
      ...spotifyStyles.fontPrimary,
      ...spotifyStyles.fontWeightMedium,
      ...spotifyStyles.transitionSpotify,
      ...spotifyStyles.focusRing,
      ...getVariantStyles(),
      ...getSizeStyles(),
      ...style,
    }

    return (
      <MantineButton
        ref={ref}
        variant="unstyled"
        style={buttonStyles}
        {...props}
      >
        {children}
      </MantineButton>
    )
  }
)

Button.displayName = 'Button' 