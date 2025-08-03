import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'

import { PageLoading } from '@/components/ui/LoadingSkeleton'

import { App } from './App'

// Lazy load pages
const HomePage = lazy(() =>
  import('@/pages/HomePage').then((module) => ({ default: module.HomePage })),
)
const ArtistPage = lazy(() =>
  import('@/pages/ArtistPage').then((module) => ({
    default: module.ArtistPage,
  })),
)
const CallbackPage = lazy(() =>
  import('@/pages/CallbackPage').then((module) => ({
    default: module.CallbackPage,
  })),
)

// Loading component for Suspense
const PageSuspense = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoading />}>{children}</Suspense>
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <PageSuspense>
            <HomePage />
          </PageSuspense>
        ),
      },
      {
        path: '/artist/:id',
        element: (
          <PageSuspense>
            <ArtistPage />
          </PageSuspense>
        ),
      },
    ],
  },
  {
    path: '/callback',
    element: (
      <PageSuspense>
        <CallbackPage />
      </PageSuspense>
    ),
  },
])
