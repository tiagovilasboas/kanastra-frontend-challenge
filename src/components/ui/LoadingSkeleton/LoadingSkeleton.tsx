import React from 'react'

import styles from './LoadingSkeleton.module.css'

interface LoadingSkeletonProps {
  className?: string
  height?: string
  width?: string
  borderRadius?: string
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className = '',
  height = '20px',
  width = '100%',
  borderRadius = '4px',
}) => {
  return (
    <div
      className={`${styles.skeleton} ${className}`}
      style={{
        height,
        width,
        borderRadius,
      }}
    />
  )
}

// Page loading component
export const PageLoading: React.FC = () => {
  return (
    <div className={styles.pageLoading}>
      <div className={styles.pageLoadingContent}>
        <LoadingSkeleton
          height="40px"
          width="60%"
          className={styles.titleSkeleton}
        />
        <LoadingSkeleton
          height="20px"
          width="80%"
          className={styles.subtitleSkeleton}
        />
        <div className={styles.gridSkeleton}>
          {Array.from({ length: 6 }).map((_, index) => (
            <LoadingSkeleton
              key={index}
              height="200px"
              width="100%"
              className={styles.cardSkeleton}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
