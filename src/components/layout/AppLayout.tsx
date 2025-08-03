import React from 'react'

import { Header, Sidebar } from '@/components/layout'
import { useNavigationStore } from '@/stores'

interface AppLayoutProps {
  children: React.ReactNode
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { activeSection, setActiveSection } = useNavigationStore()

  return (
    <div className="app-layout">
      <Sidebar
        activeSection={activeSection}
        onNavItemClick={setActiveSection}
      />
      <div className="main-area">
        <Header onSearch={() => {}} />
        <main className="main-content">{children}</main>
      </div>
    </div>
  )
}
