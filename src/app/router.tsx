import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'

import { AppLayout } from '@/components/layout'

// Lazy load pages
const HomePage = lazy(() => import('@/pages/HomePage').then(module => ({ default: module.HomePage })))
const ArtistPage = lazy(() => import('@/pages/ArtistPage').then(module => ({ default: module.ArtistPage })))
const ArtistsPage = lazy(() => import('@/pages/ArtistsPage').then(module => ({ default: module.ArtistsPage })))
const SearchPage = lazy(() => import('@/pages/SearchPage').then(module => ({ default: module.SearchPage })))
const AlbumsPage = lazy(() => import('@/pages/AlbumsPage').then(module => ({ default: module.AlbumsPage })))
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage').then(module => ({ default: module.FavoritesPage })))

// Loading component for Suspense
const PageSuspense = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>}>{children}</Suspense>
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <PageSuspense><HomePage /></PageSuspense>,
      },
      {
        path: 'search',
        element: <PageSuspense><SearchPage /></PageSuspense>,
      },
      {
        path: 'artist/:id',
        element: <PageSuspense><ArtistPage /></PageSuspense>,
      },
      {
        path: 'artists',
        element: <PageSuspense><ArtistsPage /></PageSuspense>,
      },
      {
        path: 'albums',
        element: <PageSuspense><AlbumsPage /></PageSuspense>,
      },
      {
        path: 'favorites',
        element: <PageSuspense><FavoritesPage /></PageSuspense>,
      },
    ],
  },
])
