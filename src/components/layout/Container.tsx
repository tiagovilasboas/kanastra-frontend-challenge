import { Container as MantineContainer, type ContainerProps as MantineContainerProps } from '@mantine/core'
import { forwardRef } from 'react'

export interface ContainerProps extends MantineContainerProps {
  variant?: 'default' | 'fluid' | 'mobile-first'
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ variant = 'mobile-first', style, children, ...props }, ref) => {
    const getContainerClass = () => {
      switch (variant) {
        case 'default':
          return 'container-spotify bg-primary'
        case 'fluid':
          return 'container-spotify bg-primary w-full'
        case 'mobile-first':
          return 'container-spotify bg-primary'
        default:
          return 'container-spotify bg-primary'
      }
    }

    return (
      <MantineContainer
        ref={ref}
        size={variant === 'fluid' ? '100%' : 'lg'}
        className={getContainerClass()}
        style={{ minHeight: '100vh', ...style }}
        {...props}
      >
        {children}
      </MantineContainer>
    )
  }
)

Container.displayName = 'Container' 