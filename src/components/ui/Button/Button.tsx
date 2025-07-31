import { forwardRef } from 'react'
import { Button as MantineButton, ButtonProps as MantineButtonProps } from '@mantine/core'

import styles from './Button.module.css'

export interface ButtonProps extends MantineButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'spotify'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    const getVariantClass = () => {
      switch (variant) {
        case 'primary':
          return styles.buttonPrimary
        case 'secondary':
          return styles.buttonSecondary
        case 'danger':
          return styles.buttonDanger
        case 'ghost':
          return styles.buttonGhost
        case 'spotify':
          return styles.buttonSpotify
        default:
          return styles.buttonPrimary
      }
    }

    const getSizeClass = () => {
      switch (size) {
        case 'sm':
          return styles.buttonSmall
        case 'md':
          return styles.buttonMedium
        case 'lg':
          return styles.buttonLarge
        default:
          return styles.buttonMedium
      }
    }

    const buttonClasses = [
      styles.button,
      getVariantClass(),
      getSizeClass(),
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <MantineButton
        ref={ref}
        className={buttonClasses}
        variant="unstyled"
        {...props}
      >
        {children}
      </MantineButton>
    )
  },
)

Button.displayName = 'Button' 