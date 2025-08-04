import { Heart, Music } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'

export const FavoritesPage: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">
              {t('favorites:title', 'Favorites')}
            </h1>
          </div>
          <p className="text-muted-foreground">
            {t('favorites:description', 'Your favorite artists, songs, and albums')}
          </p>
        </div>

        {/* Coming Soon */}
        <Card>
          <CardContent className="p-12">
            <div className="text-center space-y-4">
              <Music className="w-16 h-16 text-muted-foreground mx-auto" />
              <div>
                <CardTitle className="text-xl mb-2">
                  {t('favorites:comingSoonTitle', 'Coming Soon')}
                </CardTitle>
                <CardDescription className="text-base">
                  {t('favorites:comingSoonMessage', 'The favorites feature is under development. You can still explore and discover new artists through search and browsing.')}
                </CardDescription>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 