import { Home, Library, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { MusicIcon } from '@/components/ui/MusicIcon'

interface SidebarProps {
  activeSection: 'home' | 'library' | 'create'
  onNavItemClick: (section: 'home' | 'library' | 'create') => void
}

export function Sidebar({ activeSection, onNavItemClick }: SidebarProps) {
  const { t } = useTranslation()

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo-section">
          <MusicIcon size={32} className="logo-icon" />
          <h1 className="app-title">{t('app:appName')}</h1>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <div
            className={`nav-item ${activeSection === 'home' ? 'active' : ''}`}
            onClick={() => onNavItemClick('home')}
          >
            <Home size={24} />
            <span>{t('navigation:home')}</span>
          </div>
        </div>

        <div className="nav-section">
          <div
            className={`nav-item ${activeSection === 'library' ? 'active' : ''}`}
            onClick={() => onNavItemClick('library')}
          >
            <Library size={24} />
            <span>{t('navigation:library')}</span>
          </div>
          <div
            className={`nav-item ${activeSection === 'create' ? 'active' : ''}`}
            onClick={() => onNavItemClick('create')}
          >
            <Plus size={24} />
            <span>{t('navigation:create')}</span>
          </div>
        </div>
      </nav>
    </div>
  )
}
