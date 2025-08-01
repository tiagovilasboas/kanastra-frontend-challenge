import { createBrowserRouter } from 'react-router-dom'

import App from './App'
import ArtistPage from '@/pages/ArtistPage'
import CallbackPage from '@/pages/CallbackPage'
import HomePage from '@/pages/HomePage'

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
