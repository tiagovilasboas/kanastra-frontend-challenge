import { useQueryClient } from '@tanstack/react-query'
import { LogIn, LogOut, Menu, Search, User } from 'lucide-react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { LanguageSelector } from '@/components/ui/LanguageSelector'
import { SpotifyIcon } from '@/components/ui/SpotifyIcon'
import { useDebounce } from '@/hooks/useDebounce'
import { useSpotifyAuth } from '@/hooks/useSpotifyAuth'
import { useSearchStore } from '@/stores/searchStore'

export interface HeaderProps {
  onMenuToggle?: () => void
  searchPlaceholder?: string
}

export function Header({ onMenuToggle, searchPlaceholder }: HeaderProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { isAuthenticated, login, logout } = useSpotifyAuth()
  const { searchQuery, setSearchQuery, setDebouncedSearchQuery } =
    useSearchStore()

  // Debounce the search query with 350ms delay
  const debouncedSearchQuery = useDebounce(searchQuery, 350)

  // Update debounced search query in store when it changes
  useEffect(() => {
    setDebouncedSearchQuery(debouncedSearchQuery)
  }, [debouncedSearchQuery, setDebouncedSearchQuery])

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)

    // If input is cleared, invalidate queries
    if (!value.trim()) {
      queryClient.removeQueries({
        queryKey: ['spotify-search'],
      })
      queryClient.removeQueries({
        queryKey: ['spotify-search-by-type'],
      })
    }

    // Navigate to search page if user types something
    if (value.trim()) {
      const queryParams = new URLSearchParams({
        q: value,
        market: 'BR',
      })
      navigate(`/search?${queryParams.toString()}`)
    }
  }

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      const queryParams = new URLSearchParams({
        q: searchQuery,
        market: 'BR',
      })
      navigate(`/search?${queryParams.toString()}`)
    }
  }

  return (
    <header className="bg-background border-b border-border px-3 sm:px-4 py-2 sm:py-3 z-50">
      <div className="flex items-center justify-between gap-2 sm:gap-4 max-w-7xl mx-auto">
        {/* Left side - Menu button and Logo */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="lg:hidden"
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>

          {/* Logo */}
          <div className="flex items-center gap-1 sm:gap-2">
            <SpotifyIcon color="green" size={24} />
            <h1 className="text-base sm:text-lg font-bold text-foreground hidden sm:block">
              {t('navigation:spotifyExplorer', 'Spotify Explorer')}
            </h1>
          </div>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-sm sm:max-w-md mx-2 sm:mx-4">
          <div className="relative">
            <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
            <Input
              data-testid="search-input"
              placeholder={
                searchPlaceholder ||
                t('search:placeholder', 'Pesquisar artistas, álbuns ou músicas')
              }
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              className="pl-7 sm:pl-10 h-9 sm:h-10 text-sm sm:text-base bg-muted/50 border-0 focus:bg-background"
            />
          </div>
        </div>

        {/* Right side - Language selector and User actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Language Selector */}
          <LanguageSelector />

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <User className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={logout} variant="destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  {t('auth:logout', 'Logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              size="sm"
              onClick={login}
              className="text-xs sm:text-sm bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 font-medium"
            >
              <LogIn className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">
                {t('auth:login', 'Login')}
              </span>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
