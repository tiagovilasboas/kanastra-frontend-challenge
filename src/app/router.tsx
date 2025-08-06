import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'

import { ErrorBoundary } from '@/components/ErrorBoundary'
import { AppLayout } from '@/components/layout'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

// Lazy loading para melhorar performance
const HomePage = lazy(() =>
  import('@/pages/HomePage').then((module) => ({ default: module.HomePage })),
)
const SearchPage = lazy(() =>
  import('@/pages/SearchPage').then((module) => ({
    default: module.SearchPage,
  })),
)
const SearchByTypePage = lazy(() =>
  import('@/pages/SearchByTypePage').then((module) => ({
    default: module.SearchByTypePage,
  })),
)
const AlbumsPage = lazy(() =>
  import('@/pages/AlbumsPage').then((m) => ({ default: m.AlbumsPage })),
)
const FavoritesPage = lazy(() =>
  import('@/pages/FavoritesPage').then((m) => ({ default: m.FavoritesPage })),
)
const ArtistsPage = lazy(() =>
  import('@/pages/ArtistsPage').then((module) => ({
    default: module.ArtistsPage,
  })),
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

// Componente de loading para Suspense
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <LoadingSpinner size="lg" />
  </div>
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <ErrorBoundary>{null}</ErrorBoundary>,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: 'search',
        element: (
          <Suspense fallback={<PageLoader />}>
            <SearchPage />
          </Suspense>
        ),
      },
      {
        path: 'albums',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AlbumsPage />
          </Suspense>
        ),
      },
      {
        path: 'favorites',
        element: (
          <Suspense fallback={<PageLoader />}>
            <FavoritesPage />
          </Suspense>
        ),
      },
      {
        path: 'artists',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ArtistsPage />
          </Suspense>
        ),
      },
      {
        path: 'search/:type',
        element: (
          <Suspense fallback={<PageLoader />}>
            <SearchByTypePage />
          </Suspense>
        ),
      },
      {
        path: 'artist/:id',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ArtistPage />
          </Suspense>
        ),
      },

      {
        path: 'callback',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CallbackPage />
          </Suspense>
        ),
      },
    ],
  },
])
