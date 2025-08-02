import { Download, Home, Library, Search, User } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface MobileNavigationProps {
  activeSection: 'home' | 'search' | 'library' | 'download' | 'profile'
  onSectionChange: (section: 'home' | 'search' | 'library' | 'download' | 'profile') => void
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  activeSection,
  onSectionChange,
}) => {
  const { t } = useTranslation()

  const navItems = [
    { id: 'home', icon: Home, label: t('navigation:home', 'Início') },
    { id: 'search', icon: Search, label: t('navigation:search', 'Buscar') },
    { id: 'library', icon: Library, label: t('navigation:library', 'Sua Biblioteca') },
    { id: 'download', icon: Download, label: t('navigation:download', 'Baixar aplicativo') },
    { id: 'profile', icon: User, label: t('navigation:profile', 'Perfil') },
  ] as const

  return (
    <nav className="mobile-navigation">
      {navItems.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          className={`mobile-nav-item ${activeSection === id ? 'active' : ''}`}
          onClick={() => onSectionChange(id)}
          aria-label={label}
        >
          <Icon size={20} />
          <span className="mobile-nav-label">{label}</span>
        </button>
      ))}
    </nav>
  )
} 