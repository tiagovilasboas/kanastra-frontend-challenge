import { useTranslation } from 'react-i18next'

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
  const { isAuthenticated } = useSpotifyAuth()

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
          <div className="language-selector-container">
            <LanguageSelector size="compact" />
          </div>
          {isAuthenticated && <UserMenu />}
        </div>
      </div>
    </header>
  )
}
