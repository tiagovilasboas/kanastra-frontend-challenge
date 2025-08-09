import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { AppProvider } from '@/app/providers/app-provider'
import { router } from '@/app/router'
import { logger } from '@/utils/logger'
import { registerServiceWorker } from '@/utils/serviceWorkerStrategy'
import { initWebVitals, performanceMonitor } from '@/utils/webVitals'

// Initialize performance monitoring
performanceMonitor.startTimer('app-initialization')

// Initialize Web Vitals monitoring
initWebVitals()

// Initialize Service Worker for caching strategy
registerServiceWorker()

// Start monitoring long tasks
performanceMonitor.observeLongTasks()

// Set global error handler
window.addEventListener('error', (event) => {
  logger.logError('Global error caught', event.error, {
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
  })
})

window.addEventListener('unhandledrejection', (event) => {
  logger.logError('Unhandled promise rejection', new Error(event.reason), {
    reason: event.reason,
  })
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  </React.StrictMode>,
)

// End app initialization timing
performanceMonitor.endTimer('app-initialization')
