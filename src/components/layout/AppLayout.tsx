import React from 'react'

import { Header, Sidebar } from '@/components/layout'

interface AppLayoutProps {
  children: React.ReactNode
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-area">
        <Header onSearch={() => {}} />
        <main className="main-content">{children}</main>
      </div>
    </div>
  )
}
