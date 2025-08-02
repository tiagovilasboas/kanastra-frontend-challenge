import React, { useState } from 'react'

import { Header, Sidebar } from '@/components/layout'

interface AppLayoutProps {
  children: React.ReactNode
  onSearch?: (query: string) => void
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, onSearch }) => {
  const [activeSection, setActiveSection] = useState<
    'home' | 'library' | 'create'
  >('home')

  const handleNavItemClick = (section: 'home' | 'library' | 'create') => {
    setActiveSection(section)
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