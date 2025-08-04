import { LogIn, LogOut, Menu, Music, Search, User } from 'lucide-react'
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
import { useSpotifyAuth } from '@/hooks/useSpotifyAuth'
import { useSearchStore } from '@/stores/searchStore'

export interface HeaderProps {
  onMenuToggle?: () => void
  searchPlaceholder?: string
}

export function Header({ onMenuToggle, searchPlaceholder }: HeaderProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isAuthenticated, login, logout } = useSpotifyAuth()
  const { searchQuery, setSearchQuery } = useSearchStore()

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)

    // Navigate to search page if user types something
    if (value.trim()) {
      navigate('/search')
    }
  }

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate('/search')
    }
  }

  return (
    <header className="bg-background border-b border-border px-4 py-3 z-50">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left side - Menu button and Logo */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <Music className="w-6 h-6 text-primary" />
            <h1 className="text-lg font-bold text-foreground hidden sm:block">
              {t('navigation:spotifyExplorer', 'Spotify Explorer')}
            </h1>
          </div>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={
                searchPlaceholder ||
                t(
                  'search:placeholder',
                  'Search for artists, tracks, and albums',
                )
              }
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              className="pl-10 bg-muted/50 border-0 focus:bg-background"
            />
          </div>
        </div>

        {/* Right side - Language selector and User actions */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <LanguageSelector />

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <User className="w-4 h-4" />
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
            <Button size="sm" onClick={login}>
              <LogIn className="w-4 h-4 mr-2" />
              {t('auth:login', 'Login')}
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
