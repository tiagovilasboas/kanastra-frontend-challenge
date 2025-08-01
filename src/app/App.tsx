import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'

export const App: React.FC = () => {
  const { t } = useTranslation()
  return (
    <div className="app" data-testid="app-container">
      <main className="main-content">
        <Suspense fallback={<div>{t('loading')}</div>}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  )
}
