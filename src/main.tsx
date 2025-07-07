import './i18n'
import React from 'react'

import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'

import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { router } from './app/router.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider defaultColorScheme="light">
      <RouterProvider router={router} />
    </MantineProvider>
  </React.StrictMode>,
)
