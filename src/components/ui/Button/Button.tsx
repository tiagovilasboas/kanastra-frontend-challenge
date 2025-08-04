import React from 'react'

export interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  onClick?: () => void
  disabled?: boolean
  className?: string
  leftSection?: React.ReactNode
  rightSection?: React.ReactNode
  type?: 'button' | 'submit' | 'reset'
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  leftSection,
  rightSection,
  type = 'button',
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-[#1DB954] text-black hover:bg-[#1ed760] hover:scale-105 active:scale-95 font-semibold'
      case 'secondary':
        return 'bg-transparent text-white border border-gray-600 hover:bg-gray-700 hover:border-[#1DB954]'
      case 'ghost':
        return 'bg-transparent text-gray-400 hover:bg-gray-700 hover:text-white'
      default:
        return 'bg-[#1DB954] text-black hover:bg-[#1ed760] hover:scale-105 active:scale-95 font-semibold'
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'xs':
        return 'px-2 py-1 text-xs min-h-7'
      case 'sm':
        return 'px-3 py-2 text-sm min-h-8'
      case 'md':
        return 'px-4 py-2 text-sm min-h-10'
      case 'lg':
        return 'px-6 py-3 text-base min-h-12'
      case 'xl':
        return 'px-8 py-4 text-lg min-h-14'
      default:
        return 'px-4 py-2 text-sm min-h-10'
    }
  }

  const baseClasses =
    'inline-flex items-center justify-center gap-2 border-none rounded-lg font-semibold uppercase tracking-wider cursor-pointer transition-all duration-200 relative overflow-hidden select-none focus-visible:outline-2 focus-visible:outline-[#1DB954] focus-visible:outline-offset-2'
  const variantClasses = getVariantClasses()
  const sizeClasses = getSizeClasses()
  const disabledClasses = disabled
    ? 'opacity-50 cursor-not-allowed hover:scale-100'
    : ''

  const combinedClasses = [
    baseClasses,
    variantClasses,
    sizeClasses,
    disabledClasses,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type={type}
      className={combinedClasses}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
    >
      {leftSection && (
        <span className="flex items-center justify-center">{leftSection}</span>
      )}
      <span className="flex items-center justify-center">{children}</span>
      {rightSection && (
        <span className="flex items-center justify-center">{rightSection}</span>
      )}
    </button>
  )
}
