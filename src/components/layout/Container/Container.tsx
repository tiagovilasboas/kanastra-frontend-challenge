import { forwardRef } from 'react'

import { cn } from '@/lib/utils'

export interface ContainerProps {
  variant?: 'default' | 'mobile-first' | 'fluid' | 'narrow' | 'wide'
  children: React.ReactNode
  className?: string
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ variant = 'default', className, children, ...props }, ref) => {
    const getVariantClass = () => {
      switch (variant) {
        case 'default':
          return 'max-w-6xl mx-auto px-6 md:px-6'
        case 'mobile-first':
          return 'max-w-6xl mx-auto p-4 sm:p-6 md:p-8 lg:p-12'
        case 'fluid':
          return 'w-full px-4'
        case 'narrow':
          return 'max-w-4xl mx-auto px-6 md:px-6'
        case 'wide':
          return 'max-w-7xl mx-auto px-6 md:px-6'
        default:
          return 'max-w-6xl mx-auto px-6 md:px-6'
      }
    }

    return (
      <div
        ref={ref}
        className={cn(getVariantClass(), className)}
        {...props}
      >
        {children}
      </div>
    )
  },
)

Container.displayName = 'Container'
