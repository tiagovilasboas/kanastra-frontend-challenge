import { Search } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

export const AlbumsPage: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 lg:p-6">
      <div className="max-w-md mx-auto mt-12 text-center space-y-4">
        <Search className="w-16 h-16 mx-auto text-muted-foreground" />
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          {t('albums:title', 'Álbuns')}
        </h1>
        <p className="text-muted-foreground">
          {t(
            'albums:underConstruction',
            'Esta página de álbuns está em construção. Em breve você poderá explorar lançamentos e coleções!',
          )}
        </p>
      </div>
    </div>
  )
}
