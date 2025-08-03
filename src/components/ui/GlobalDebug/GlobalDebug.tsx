import { lazy, Suspense } from 'react'

// Lazy load GlobalDebug only in development
const GlobalDebugComponent = lazy(() =>
  import('./GlobalDebugComponent').then((module) => ({
    default: module.GlobalDebugComponent,
  })),
)

export const GlobalDebug: React.FC = () => {
  // Only render in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <Suspense fallback={null}>
      <GlobalDebugComponent />
    </Suspense>
  )
}
