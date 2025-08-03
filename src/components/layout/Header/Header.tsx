import { Play } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { MobileNavigation } from '@/components/layout/MobileNavigation'
import { Button } from '@/components/ui/Button'
import { LanguageSelector } from '@/components/ui/LanguageSelector'
import { SearchInput } from '@/components/ui/SearchInput'
import { UserMenu } from '@/components/ui/UserMenu'
import { useSpotifyAuth } from '@/hooks/useSpotifyAuth'

interface HeaderProps {
  onSearch: (query: string) => void
  searchPlaceholder?: string
}

export function Header({ onSearch, searchPlaceholder }: HeaderProps) {
  const { t } = useTranslation()
  const { isAuthenticated, isLoading, login } = useSpotifyAuth()

  return (
    <header className="main-header">
      <div className="header-content">
        <div className="search-container">
          <SearchInput
            onSearch={onSearch}
            placeholder={searchPlaceholder || t('search:placeholder')}
          />
        </div>
        <div className="header-actions">
          <MobileNavigation />
          <div className="language-selector-container">
            <LanguageSelector size="compact" />
          </div>
          {!isLoading && (
            <>
              {isAuthenticated ? (
                <UserMenu />
              ) : (
                <Button
                  variant="gradient"
                  size="xs"
                  onClick={login}
                  className="spotify-login-button mobile-compact"
                  leftSection={<Play size={14} />}
                >
                  {t('auth:loginWithSpotify')}
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  )
}
