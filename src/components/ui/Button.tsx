import { Button as MantineButton, type ButtonProps as MantineButtonProps } from '@mantine/core'
import { forwardRef } from 'react'

import { spotifyStyles } from '@/lib/design-system/utils'

export interface ButtonProps extends Omit<MantineButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', children, style, ...props }, ref) => {
    const getVariantStyles = () => {
      switch (variant) {
        case 'primary':
          return {
            backgroundColor: '#1db954',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#1aa34a',
              transform: 'scale(1.02)',
            },
            '&:active': {
              transform: 'scale(0.98)',
            },
          }
        case 'secondary':
          return {
            backgroundColor: 'transparent',
            color: '#ffffff',
            border: '1px solid #535353',
            '&:hover': {
              backgroundColor: '#282828',
              borderColor: '#b3b3b3',
            },
          }
        case 'ghost':
          return {
            backgroundColor: 'transparent',
            color: '#b3b3b3',
            '&:hover': {
              backgroundColor: '#282828',
              color: '#ffffff',
            },
          }
        case 'danger':
          return {
            backgroundColor: '#e91429',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#d10f23',
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
            fontSize: '14px',
          }
        case 'md':
          return {
            height: '40px',
            padding: '0 24px',
            fontSize: '16px',
          }
        case 'lg':
          return {
            height: '48px',
            padding: '0 32px',
            fontSize: '18px',
          }
        default:
          return {}
      }
    }

    const buttonStyles = {
      ...spotifyStyles.fontPrimary,
      ...spotifyStyles.fontWeightMedium,
      ...spotifyStyles.roundedMd,
      ...spotifyStyles.transitionNormal,
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