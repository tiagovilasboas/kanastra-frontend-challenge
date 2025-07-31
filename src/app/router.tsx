import { createBrowserRouter } from 'react-router-dom'

import App from '@/App'
import HomePage from '@/pages/HomePage'
import DesignSystemPage from '@/pages/DesignSystemPage'
import CallbackPage from '@/pages/CallbackPage'

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
        path: '/design-system',
        element: <DesignSystemPage />,
      },
    ],
  },
  {
    path: '/callback',
    element: <CallbackPage />,
  },
])
