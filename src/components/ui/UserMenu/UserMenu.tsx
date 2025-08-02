import { useEffect,useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useSpotifyAuth } from '@/hooks/useSpotifyAuth'
import { logger } from '@/utils/logger'

export const UserMenu: React.FC = () => {
  const { t } = useTranslation()
  const { logout } = useSpotifyAuth()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logger.debug('User initiated logout from menu')
    logout()
    setIsOpen(false)
  }

  return (
    <div className="user-menu" ref={menuRef}>
      <button
        className="user-menu-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('auth:userMenu', 'Menu do usuário')}
        aria-expanded={isOpen}
      >
        <div className="user-avatar">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
              fill="currentColor"
            />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="user-menu-dropdown">
          <div className="user-menu-header">
            <div className="user-info">
              <div className="user-name">{t('auth:user', 'Usuário')}</div>
              <div className="user-status">{t('auth:connected', 'Conectado')}</div>
            </div>
          </div>
          
          <div className="user-menu-actions">
            <button
              className="user-menu-item logout-button"
              onClick={handleLogout}
              aria-label={t('auth:logout', 'Sair')}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"
                  fill="currentColor"
                />
              </svg>
              {t('auth:logout', 'Sair')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 