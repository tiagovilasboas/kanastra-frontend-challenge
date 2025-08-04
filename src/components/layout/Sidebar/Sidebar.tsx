import { Home, Library, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useNavigationStore } from '@/stores/navigationStore'

export const Sidebar = () => {
  const { t } = useTranslation()
  const { activeSection, setActiveSection } = useNavigationStore()

  const navItems = [
    {
      id: 'home',
      icon: Home,
      label: t('navigation:home', 'Início'),
    },
    {
      id: 'library',
      icon: Library,
      label: t('navigation:library', 'Sua Biblioteca'),
    },
    {
      id: 'create',
      icon: Plus,
      label: t('navigation:create', 'Criar Playlist'),
    },
  ]

  return (
    <div className="sidebar">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3 text-[#1DB954] text-xl font-bold">
          <div className="w-6 h-6 bg-[#1DB954] rounded-sm flex items-center justify-center">
            <span className="text-black text-xs font-bold">
              {t('app:logo', 'S')}
            </span>
          </div>
          <span>{t('app:appName', 'Spotify')}</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-6">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id

            return (
              <div key={item.id} className="space-y-2">
                <button
                  onClick={() =>
                    setActiveSection(item.id as 'home' | 'library' | 'create')
                  }
                  className={`w-full flex items-center gap-3 px-2 py-3 rounded-md font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-white bg-gray-800'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </button>
              </div>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
