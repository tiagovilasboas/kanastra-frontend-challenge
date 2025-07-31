import { Group } from '@mantine/core'
import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'

import { LanguageSelector } from '@/components/LanguageSelector'

function App() {
  const { t } = useTranslation()
  return (
    <div className="app">
      <div
        style={{
          height: 60,
          padding: '1rem',
          borderBottom: '1px solid var(--mantine-color-gray-3)',
          backgroundColor: 'var(--mantine-color-body)',
        }}
      >
        <Group justify="space-between" h="100%">
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
            {t('brand')}
          </h1>
          <LanguageSelector />
        </Group>
      </div>
      <main className="main-content">
        <Suspense fallback={<div>{t('loading')}</div>}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  )
}

export default App
