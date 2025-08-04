import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation } from 'react-router-dom'
import { Toaster } from 'sonner'



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

      </div>
    )
  }

  return (
    <div className="app" data-testid="app-container">
      <Suspense fallback={<div>{t('loading')}</div>}>
        <Outlet />
      </Suspense>

      <Toaster richColors position="top-center" duration={4000} closeButton />
    </div>
  )
}
