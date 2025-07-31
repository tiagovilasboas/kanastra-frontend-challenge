import {
  Button as MantineButton,
  type ButtonProps as MantineButtonProps,
} from '@mantine/core'
import { forwardRef } from 'react'

export interface ButtonProps extends MantineButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'spotify'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = 'primary', size = 'md', className, children, ...props },
    ref,
  ) => {
    const getButtonClass = () => {
      const baseClass = 'btn-spotify transition-spotify'

      switch (variant) {
        case 'primary':
          return `${baseClass}`
        case 'secondary':
          return `${baseClass} btn-secondary`
        case 'danger':
          return `${baseClass} bg-error hover:bg-red-600`
        case 'ghost':
          return `${baseClass} btn-ghost`
        case 'spotify':
          return `${baseClass} spotify-gradient`
        default:
          return baseClass
      }
    }

    const getSizeClass = () => {
      switch (size) {
        case 'sm':
          return 'px-sm py-xs text-sm'
        case 'md':
          return 'px-md py-sm text-base'
        case 'lg':
          return 'px-lg py-md text-lg'
        default:
          return 'px-md py-sm text-base'
      }
    }

    return (
      <MantineButton
        ref={ref}
        variant="unstyled"
        className={`${getButtonClass()} ${getSizeClass()} ${className || ''}`}
        {...props}
      >
        {children}
      </MantineButton>
    )
  },
)

Button.displayName = 'Button'
