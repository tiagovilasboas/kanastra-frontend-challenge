import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Outlet } from 'react-router-dom'

import { ThemeToggle } from '@/components/ThemeToggle'

function App() {
  const { t } = useTranslation()
  return (
    <div className="app">
      <header className="header">
        <Link
          to="/"
          style={{
            textDecoration: 'none',
            color: 'inherit',
            fontSize: '1.5rem',
            fontWeight: 'bold',
          }}
        >
          {t('brand')}
        </Link>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/">{t('nav.home')}</Link>
          <Link to="/about">{t('nav.about')}</Link>
          <ThemeToggle />
        </nav>
      </header>
      <main className="main-content">
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </Suspense>
      </main>
      <footer className="footer">
        <p>
          {t('footer.madeBy', { author: 'Tiago Vilas Boas' })}{' '}
        </p>
      </footer>
    </div>
  )
}

export default App
