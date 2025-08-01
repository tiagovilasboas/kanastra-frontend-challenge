import './config/i18n'
import '@mantine/core/styles.css'
import './styles/globals.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { AppProvider } from './app/providers/app-provider'
import { router } from './app/router.tsx'
import App from './app/App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
