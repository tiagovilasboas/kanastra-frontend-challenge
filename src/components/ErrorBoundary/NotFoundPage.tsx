import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'

export const NotFoundPage: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[50vh]">
      <h1 className="text-red-500 text-3xl font-bold mb-6">
        {t('ui:notFound.title', '404 - Page Not Found')}
      </h1>

      <p className="text-gray-400 text-lg mb-8 max-w-md">
        {t(
          'ui:notFound.description',
          'Sorry, the page you are looking for does not exist.',
        )}
      </p>

      <Button asChild>
        <Link to="/">{t('ui:notFound.backToHome', 'Back to Home')}</Link>
      </Button>
    </div>
  )
}
