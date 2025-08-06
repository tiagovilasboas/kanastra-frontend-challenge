import { Heart } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

export const FavoritesPage: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 lg:p-6">
      <div className="max-w-md mx-auto mt-12 text-center space-y-4">
        <Heart className="w-16 h-16 mx-auto text-primary" />
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          {t('favorites:title', 'Favoritos')}
        </h1>
        <p className="text-muted-foreground">
          {t(
            'favorites:underConstruction',
            'Sua lista de favoritos está chegando! Em breve você poderá acessar suas músicas, álbuns e artistas preferidos.',
          )}
        </p>
      </div>
    </div>
  )
}
