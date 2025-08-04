import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}) => {
  const { t } = useTranslation()

  if (totalPages <= 1) {
    return null
  }

  const getVisiblePages = () => {
    const delta = 2 // Number of pages to show on each side of current page
    const range = []
    const rangeWithDots = []

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  const visiblePages = getVisiblePages()

  return (
    <div className={`flex items-center justify-center gap-1 ${className}`}>
      {/* Previous Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-8 w-8 p-0"
        aria-label={t('common:previousPage', 'Previous page')}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Page Numbers */}
      {visiblePages.map((page, index) => {
        if (page === '...') {
          return (
            <div
              key={`dots-${index}`}
              className="flex h-8 w-8 items-center justify-center"
            >
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </div>
          )
        }

        const pageNumber = page as number
        const isActive = pageNumber === currentPage

        return (
          <Button
            key={pageNumber}
            variant={isActive ? 'default' : 'outline'}
            size="sm"
            onClick={() => onPageChange(pageNumber)}
            className="h-8 w-8 p-0"
            aria-label={t('common:goToPage', 'Go to page {page}', {
              page: pageNumber,
            })}
            aria-current={isActive ? 'page' : undefined}
          >
            {pageNumber}
          </Button>
        )
      })}

      {/* Next Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-8 w-8 p-0"
        aria-label={t('common:nextPage', 'Next page')}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
