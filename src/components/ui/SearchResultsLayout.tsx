import React from 'react'
import { useTranslation } from 'react-i18next'

interface SearchResultsLayoutProps {
  bestResult?: React.ReactNode
  tracksSection?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export const SearchResultsLayout: React.FC<SearchResultsLayoutProps> = ({
  bestResult,
  tracksSection,
  children,
  className = '',
}) => {
  const { t } = useTranslation()
  return (
    <div className={`space-y-8 p-4 ${className}`}>
      {/* Top Section: Best Result and Tracks Side by Side */}
      {(bestResult || tracksSection) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Best Result Section */}
          {bestResult && (
            <div className="space-y-4 h-fit">
              <h2 className="text-2xl font-bold text-foreground">
                {t('search:bestResult')}
              </h2>
              <div className="h-full">{bestResult}</div>
            </div>
          )}

          {/* Tracks Section */}
          {tracksSection && (
            <div className="space-y-4 h-fit">
              <h2 className="text-2xl font-bold text-foreground">
                {t('search:tracks')}
              </h2>
              <div className="h-full">{tracksSection}</div>
            </div>
          )}
        </div>
      )}

      {/* Other Results */}
      <div className="space-y-8">{children}</div>
    </div>
  )
}
