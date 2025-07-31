import { Container as MantineContainer, type ContainerProps as MantineContainerProps } from '@mantine/core'
import { forwardRef } from 'react'

import { spotifyStyles } from '@/lib/design-system/utils'

export interface ContainerProps extends MantineContainerProps {
  variant?: 'default' | 'fluid' | 'mobile-first'
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ variant = 'mobile-first', style, children, ...props }, ref) => {
    const getContainerStyles = () => {
      switch (variant) {
        case 'default':
          return {
            ...spotifyStyles.bgPrimary,
            minHeight: '100vh',
          }
        case 'fluid':
          return {
            ...spotifyStyles.bgPrimary,
            minHeight: '100vh',
            width: '100%',
          }
        case 'mobile-first':
          return {
            ...spotifyStyles.bgPrimary,
            minHeight: '100vh',
            ...spotifyStyles.mobileFirst.container,
          }
        default:
          return {}
      }
    }

    const containerStyles = {
      ...getContainerStyles(),
      ...style,
    }

    return (
      <MantineContainer
        ref={ref}
        size={variant === 'fluid' ? '100%' : 'lg'}
        style={containerStyles}
        {...props}
      >
        {children}
      </MantineContainer>
    )
  }
)

Container.displayName = 'Container' 