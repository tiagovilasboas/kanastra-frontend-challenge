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
      <div className="flex items-center justify-between gap-6 p-4 lg:p-6 max-w-7xl mx-auto">
        {/* Search Container */}
        <div className="flex-1 max-w-md lg:max-w-lg">
          <SearchInput
            onSearch={onSearch}
            placeholder={searchPlaceholder || t('search:placeholder')}
          />
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu */}
          <div className="lg:hidden">
            <MobileNavigation />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <LanguageSelector />

            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <UserMenu />
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={login}
                    className="bg-gradient-to-r from-[#1DB954] to-[#1ed760] text-black font-semibold hover:from-[#1ed760] hover:to-[#1fdf64] transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    <span className="hidden sm:inline">
                      {t('auth:loginWithSpotify')}
                    </span>
                    <span className="sm:hidden">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                      </svg>
                    </span>
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
