import { createBrowserRouter } from 'react-router-dom'

import { ArtistPage } from '@/pages/ArtistPage'
import { CallbackPage } from '@/pages/CallbackPage'
import { HomePage } from '@/pages/HomePage'

import { App } from './App'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: '/artist/:id',
        element: <ArtistPage />,
      },
    ],
  },
  {
    path: '/callback',
    element: <CallbackPage />,
  },
])
