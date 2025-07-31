import { forwardRef } from 'react'
import { Container as MantineContainer, ContainerProps as MantineContainerProps } from '@mantine/core'

import styles from './Container.module.css'

export interface ContainerProps extends MantineContainerProps {
  variant?: 'default' | 'mobile-first' | 'fluid' | 'narrow' | 'wide'
  children: React.ReactNode
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ variant = 'default', className, children, ...props }, ref) => {
    const getVariantClass = () => {
      switch (variant) {
        case 'default':
          return styles.container
        case 'mobile-first':
          return styles.containerMobileFirst
        case 'fluid':
          return styles.containerFluid
        case 'narrow':
          return styles.containerNarrow
        case 'wide':
          return styles.containerWide
        default:
          return styles.container
      }
    }

    const containerClasses = [
      getVariantClass(),
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <MantineContainer
        ref={ref}
        className={containerClasses}
        size="xl"
        {...props}
      >
        {children}
      </MantineContainer>
    )
  },
)

Container.displayName = 'Container' 