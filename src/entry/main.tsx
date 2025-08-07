import '../config/i18n'
// import '@mantine/core/styles.css'
import '../styles/globals.css'

// Silence console.log/debug in production to avoid unnecessary logs
if (import.meta.env.PROD) {
  console.info = () => {}
  console.debug = () => {}
}

import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { AppProvider } from '../app/providers/app-provider'
import { router } from '../app/router'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  </React.StrictMode>,
)
