import { Menu, Music } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

export function MobileNavigation() {
  const { t } = useTranslation()

  const playlists = [
    '21st Birthday',
    'April, 2023',
    'Gym Session',
    'Classic Anthems',
    'R&B Favourites',
    'Classical Music',
    'Hayleys Bday',
    'Discover Weekly',
    'Liked From Radio'
  ]

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="lg:hidden"
          aria-label={t('navigation:openMenu', 'Abrir menu')}
        >
          <Menu size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 bg-sidebar border-r border-sidebar-border">
        <SheetHeader>
          <SheetTitle className="text-sidebar-foreground">
            <div className="flex items-center gap-2">
              <Music className="w-6 h-6 text-primary" />
              <span>{t('navigation:spotifyExplorer', 'Spotify Explorer')}</span>
            </div>
          </SheetTitle>
        </SheetHeader>
        
        <Separator className="my-4" />
        
        {/* Navigation */}
        <div className="space-y-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 hover:bg-sidebar-accent"
          >
            <span className="text-lg">🏠</span>
            <span>{t('navigation:home', 'Home')}</span>
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 hover:bg-sidebar-accent"
          >
            <span className="text-lg">🔍</span>
            <span>{t('navigation:search', 'Search')}</span>
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 hover:bg-sidebar-accent"
          >
            <span className="text-lg">📚</span>
            <span>{t('navigation:library', 'Your Library')}</span>
          </Button>
        </div>

        <Separator className="my-4" />

        {/* Actions */}
        <div className="space-y-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 hover:bg-sidebar-accent"
          >
            <span className="text-lg">➕</span>
            <span>{t('navigation:createPlaylist', 'Create Playlist')}</span>
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 hover:bg-sidebar-accent"
          >
            <span className="text-lg">❤️</span>
            <span>{t('navigation:likedSongs', 'Liked Songs')}</span>
          </Button>
        </div>

        <Separator className="my-4" />

        {/* Playlists */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-2">
            {playlists.map((playlist, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start text-sm text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
              >
                {playlist}
              </Button>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
