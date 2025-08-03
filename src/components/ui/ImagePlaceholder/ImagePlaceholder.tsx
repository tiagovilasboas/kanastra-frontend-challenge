import React from 'react'

import styles from './ImagePlaceholder.module.css'

interface ImagePlaceholderProps {
  width?: string | number
  height?: string | number
  className?: string
  children?: React.ReactNode
}

export const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  width = '100%',
  height = '100%',
  className = '',
  children,
}) => {
  return (
    <div
      className={`${styles.placeholder} ${className}`}
      style={{ width, height }}
    >
      {children || (
        <div className={styles.icon}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z"
              fill="currentColor"
            />
          </svg>
        </div>
      )}
    </div>
  )
}
