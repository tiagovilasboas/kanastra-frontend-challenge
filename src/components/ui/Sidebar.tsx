import { Disc3, Heart, Home, Search, Users } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import { Button } from './button'

interface SidebarProps {
  isCollapsed?: boolean
  isMobileOpen?: boolean
  onClose?: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed = false,
  isMobileOpen = false,
  onClose,
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

  const navigationItems = [
    {
      icon: Home,
      label: t('navigation:home', 'Home'),
      path: '/',
      active: location.pathname === '/',
    },
    {
      icon: Search,
      label: t('navigation:search', 'Search'),
      path: '/search',
      active: location.pathname.startsWith('/search'),
    },
    {
      icon: Users,
      label: t('navigation:artists', 'Artists'),
      path: '/artists',
      active: location.pathname.startsWith('/artist'),
    },
    {
      icon: Disc3,
      label: t('navigation:albums', 'Albums'),
      path: '/albums',
      active: location.pathname.startsWith('/album'),
    },
    {
      icon: Heart,
      label: t('navigation:favorites', 'Favorites'),
      path: '/favorites',
      active: location.pathname === '/favorites',
    },
  ]

  const handleNavigation = (path: string) => {
    navigate(path)
    // Close mobile sidebar after navigation
    if (onClose) {
      onClose()
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-50
        bg-sidebar border-r border-sidebar-border 
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-16' : 'w-64'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:border-r lg:border-sidebar-border
      `}
      >
        <div className="flex flex-col h-full">
          {/* Navigation */}
          <div className="p-4 space-y-2" data-testid="sidebar-navigation">
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                variant={item.active ? 'secondary' : 'ghost'}
                className={`w-full justify-start gap-3 hover:bg-sidebar-accent ${
                  item.active
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : ''
                }`}
                onClick={() => handleNavigation(item.path)}
                data-testid={`nav-item-${item.path.replace('/', '')}`}
              >
                <item.icon size={20} />
                {!isCollapsed && <span>{item.label}</span>}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
