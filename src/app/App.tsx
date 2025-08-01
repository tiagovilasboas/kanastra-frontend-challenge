import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'

import { Header } from '@/components/layout'

function App() {
  const { t } = useTranslation()
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Suspense fallback={<div>{t('loading')}</div>}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  )
}

export default App
