import { Suspense } from 'react'
import { Link, Outlet } from 'react-router-dom'

import { ThemeToggle } from '@/components/ThemeToggle'

function App() {
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
          React Boilerplate
        </Link>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
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
          Made with ❤️ by{' '}
          <a
            href="https://github.com/tiagovilasboas"
            target="_blank"
            rel="noopener noreferrer"
          >
            Tiago Vilas Boas
          </a>
        </p>
      </footer>
    </div>
  )
}

export default App
