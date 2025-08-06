import React from 'react'

export interface SearchTab {
  id: string
  label: string
  isActive?: boolean
}

interface SearchTabsProps {
  tabs: SearchTab[]
  onTabChange: (tabId: string) => void
  className?: string
}

export const SearchTabs: React.FC<SearchTabsProps> = ({
  tabs,
  onTabChange,
  className = '',
}) => {
  return (
    <div className={`flex flex-wrap gap-2 p-4 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          data-testid="search-type-button"
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2 rounded-full transition-all duration-200 font-medium text-sm ${
            tab.isActive
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
