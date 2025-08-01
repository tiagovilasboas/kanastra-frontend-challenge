import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'

function App() {
  const { t } = useTranslation()
  return (
    <div className="app">
      <main className="main-content">
        <Suspense fallback={<div>{t('loading')}</div>}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  )
}

export default App
