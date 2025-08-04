import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useNavigationStore } from '@/stores/navigationStore'

export function MobileNavigation() {
  const { t } = useTranslation()
  const { activeSection, setActiveSection } = useNavigationStore()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    {
      id: 'home',
      label: t('navigation:home', 'Início'),
    },
    {
      id: 'library',
      label: t('navigation:library', 'Sua Biblioteca'),
    },
    {
      id: 'create',
      label: t('navigation:create', 'Criar Playlist'),
    },
  ]

  const handleNavItemClick = (sectionId: string) => {
    setActiveSection(sectionId as 'home' | 'library' | 'create')
    setIsOpen(false)
  }

  const handleOverlayClick = () => {
    setIsOpen(false)
  }

  const handleDrawerClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden flex items-center justify-center w-10 h-10 bg-none border-none text-white cursor-pointer p-2 rounded-md transition-all duration-200 hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-[#1DB954] focus-visible:outline-offset-2"
        aria-label={t('navigation:openMenu', 'Abrir menu')}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Menu Overlay */}
      <div
        className={`mobile-menu-overlay ${isOpen ? 'active' : ''}`}
        onClick={handleOverlayClick}
      />

      {/* Mobile Menu Drawer */}
      <div
        className={`mobile-menu-drawer ${isOpen ? 'active' : ''}`}
        onClick={handleDrawerClick}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-lg font-bold text-white">
            {t('navigation:menu', 'Menu')}
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="bg-none border-none text-gray-400 cursor-pointer p-2 rounded-md transition-all duration-200 hover:text-white hover:bg-gray-700"
            aria-label={t('navigation:closeMenu', 'Fechar menu')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <div className="space-y-2">
            {navItems.map((item) => {
              const isActive = activeSection === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavItemClick(item.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-md font-medium transition-all duration-200 text-left ${
                    isActive
                      ? 'text-white bg-gray-800'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
        </nav>
      </div>
    </>
  )
}
