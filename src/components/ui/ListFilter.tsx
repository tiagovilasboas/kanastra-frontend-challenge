import { Search, X } from 'lucide-react'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from './button'
import { Input } from './input'

interface ListFilterProps {
  placeholder?: string
  onFilterChange: (filter: string) => void
  className?: string
}

export const ListFilter: React.FC<ListFilterProps> = ({
  placeholder,
  onFilterChange,
  className = '',
}) => {
  const { t } = useTranslation()
  const [filterValue, setFilterValue] = useState('')

  const handleFilterChange = useCallback(
    (value: string) => {
      setFilterValue(value)
      onFilterChange(value)
    },
    [onFilterChange],
  )

  const handleClearFilter = useCallback(() => {
    setFilterValue('')
    onFilterChange('')
  }, [onFilterChange])

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder={placeholder || t('ui:filter', 'Filtrar...')}
          value={filterValue}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="pl-10 pr-10"
        />
        {filterValue && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilter}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
