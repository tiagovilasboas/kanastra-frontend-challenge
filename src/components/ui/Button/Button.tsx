import React from 'react'

import styles from './Button.module.css'

export interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'gradient'
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
  const baseClass = styles.button
  const variantClass = styles[variant]
  const sizeClass = styles[size]
  const disabledClass = disabled ? styles.disabled : ''

  const combinedClassName =
    `${baseClass} ${variantClass} ${sizeClass} ${disabledClass} ${className}`.trim()

  return (
    <button
      type={type}
      className={combinedClassName}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
    >
      {leftSection && <span className={styles.leftSection}>{leftSection}</span>}
      <span className={styles.content}>{children}</span>
      {rightSection && (
        <span className={styles.rightSection}>{rightSection}</span>
      )}
    </button>
  )
}
