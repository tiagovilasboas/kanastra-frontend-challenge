import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'

function App() {
  const { t } = useTranslation()
  return (
    <div className="app">
      <header className="header">
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
          {t('brand')}
        </h1>
      </header>
      <main className="main-content">
        <Suspense fallback={<div>{t('loading')}</div>}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  )
}

export default App
