import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation } from 'react-router-dom'
import { Toaster } from 'sonner'

import { GlobalDebug } from '@/components/ui/GlobalDebug'

export const App: React.FC = () => {
  const { t } = useTranslation()
  const location = useLocation()

  // Don't show layout for callback page
  const isCallbackPage = location.pathname === '/callback'

  if (isCallbackPage) {
    return (
      <div className="app" data-testid="app-container">
        <Suspense fallback={<div>{t('loading')}</div>}>
          <Outlet />
        </Suspense>
        <GlobalDebug />
      </div>
    )
  }

  return (
    <div className="app" data-testid="app-container">
      <Suspense fallback={<div>{t('loading')}</div>}>
        <Outlet />
      </Suspense>
      <GlobalDebug />
      <Toaster richColors position="top-center" duration={4000} closeButton />
    </div>
  )
}
