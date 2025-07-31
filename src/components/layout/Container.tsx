import { Container as MantineContainer, type ContainerProps as MantineContainerProps } from '@mantine/core'
import { forwardRef } from 'react'

import { spotifyStyles } from '@/lib/design-system/utils'

export interface ContainerProps extends MantineContainerProps {
  variant?: 'default' | 'fluid'
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ variant = 'default', style, children, ...props }, ref) => {
    const containerStyles = {
      ...spotifyStyles.bgPrimary,
      minHeight: '100vh',
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