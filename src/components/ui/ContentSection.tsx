import React from 'react'
import { useTranslation } from 'react-i18next'

interface ContentSectionProps {
  title: string
  children: React.ReactNode
  onViewAllClick?: () => void
  showViewAll?: boolean
  className?: string
}

export const ContentSection: React.FC<ContentSectionProps> = ({
  title,
  children,
  onViewAllClick,
  showViewAll = false,
  className = '',
}) => {
  const { t } = useTranslation()
  return (
    <section className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        {showViewAll && onViewAllClick && (
          <button
            onClick={onViewAllClick}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('ui:showAll')}
          </button>
        )}
      </div>
      {children}
    </section>
  )
}
