import { Home, Library, Menu, Plus, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useNavigationStore } from '@/stores'

export function MobileNavigation() {
  const { t } = useTranslation()
  const { activeSection, setActiveSection } = useNavigationStore()
  const [isOpen, setIsOpen] = useState(false)

  const handleNavClick = (section: 'home' | 'library' | 'create') => {
    setActiveSection(section)
    setIsOpen(false) // Fecha o menu ao clicar
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      {/* Hamburger Button - Visível apenas no mobile */}
      <button
        className="mobile-menu-button"
        onClick={toggleMenu}
        aria-label={t('navigation:menu')}
      >
        <Menu size={24} />
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="mobile-menu-overlay" onClick={() => setIsOpen(false)}>
          <div
            className="mobile-menu-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header do menu */}
            <div className="mobile-menu-header">
              <h2 className="mobile-menu-title">{t('app:appName')}</h2>
              <button
                className="mobile-menu-close"
                onClick={() => setIsOpen(false)}
                aria-label={t('navigation:close')}
              >
                <X size={24} />
              </button>
            </div>

            {/* Navegação */}
            <nav className="mobile-menu-nav">
              <div
                className={`mobile-menu-item ${activeSection === 'home' ? 'active' : ''}`}
                onClick={() => handleNavClick('home')}
              >
                <Home size={20} className="mobile-menu-icon" />
                <span>{t('navigation:home')}</span>
              </div>

              <div
                className={`mobile-menu-item ${activeSection === 'library' ? 'active' : ''}`}
                onClick={() => handleNavClick('library')}
              >
                <Library size={20} className="mobile-menu-icon" />
                <span>{t('navigation:library')}</span>
              </div>

              <div
                className={`mobile-menu-item ${activeSection === 'create' ? 'active' : ''}`}
                onClick={() => handleNavClick('create')}
              >
                <Plus size={20} className="mobile-menu-icon" />
                <span>{t('navigation:create')}</span>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
