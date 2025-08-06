import React from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface LoadMoreButtonProps {
  onLoadMore: () => void
  isLoading: boolean
  hasMore: boolean
  totalResults: number
  currentCount: number
  className?: string
}

export const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({
  onLoadMore,
  isLoading,
  hasMore,
  totalResults,
  currentCount,
  className = '',
}) => {
  const { t } = useTranslation()

  if (!hasMore) {
    return null
  }

  const remainingCount = totalResults - currentCount
  const itemsToLoad = Math.min(20, remainingCount) // Assuming 20 is the limit per page

  return (
    <div className={`flex justify-center py-6 ${className}`}>
      <Button
        onClick={onLoadMore}
        disabled={isLoading}
        variant="outline"
        size="lg"
        className="min-w-[200px]"
      >
        {isLoading ? (
          <>
            <LoadingSpinner size="sm" className="mr-2" />
            {t('common:loading', 'Carregando...')}
          </>
        ) : (
          <>
            {t('search:loadMore', 'Carregar mais')} {`(${itemsToLoad})`}
          </>
        )}
      </Button>
    </div>
  )
}
