import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'

import { Sidebar } from '@/components/ui/Sidebar'

import { Header } from './Header'

export const AppLayout: React.FC = () => {
  const [isSidebarCollapsed] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const handleMenuToggle = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen)
  }

  const handleSidebarClose = () => {
    setIsMobileSidebarOpen(false)
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header - Full width */}
      <Header onMenuToggle={handleMenuToggle} />
      
      {/* Main Content Area */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <Sidebar 
          isCollapsed={isSidebarCollapsed}
          isMobileOpen={isMobileSidebarOpen}
          onClose={handleSidebarClose}
        />
        
        {/* Content */}
        <main className="flex-1 overflow-y-auto min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
