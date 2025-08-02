import React, { useState } from 'react'

import { Header, Sidebar } from '@/components/layout'

interface AppLayoutProps {
  children: React.ReactNode
  onSearch?: (query: string) => void
  activeSection?: 'home' | 'library' | 'create'
  onSectionChange?: (section: 'home' | 'library' | 'create') => void
}

export const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  onSearch, 
  activeSection: externalActiveSection,
  onSectionChange 
}) => {
  const [internalActiveSection, setInternalActiveSection] = useState<
    'home' | 'library' | 'create'
  >('home')

  const activeSection = externalActiveSection || internalActiveSection

  const handleNavItemClick = (section: 'home' | 'library' | 'create') => {
    if (onSectionChange) {
      onSectionChange(section)
    } else {
      setInternalActiveSection(section)
    }
  }

  return (
    <div className="app-layout">
      <Sidebar
        activeSection={activeSection}
        onNavItemClick={handleNavItemClick}
      />
      <div className="main-area">
        <Header onSearch={onSearch || (() => {})} />
        <main className="main-content">{children}</main>
      </div>
    </div>
  )
} 