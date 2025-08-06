import { Search } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

export const SearchHeader: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div className="space-y-3 sm:space-y-4" data-testid="search-header">
      <div className="flex items-center gap-2 sm:gap-3">
        <Search className="w-6 h-6 sm:w-8 sm:h-8 animate-pulse text-primary dark:text-muted-foreground" />
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          {t('search:title')}
        </h1>
      </div>
      <p className="text-sm sm:text-base text-muted-foreground">
        {t('search:description')}
      </p>
    </div>
  )
}
