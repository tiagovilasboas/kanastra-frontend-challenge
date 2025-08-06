import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export const useNavigationHistory = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const historyRef = useRef<string[]>([])

  // Add current route to history when it changes
  useEffect(() => {
    const currentPath = location.pathname + location.search

    // Don't add if it's the same route
    if (historyRef.current[historyRef.current.length - 1] !== currentPath) {
      historyRef.current.push(currentPath)
    }

    // Keep only the last 10 routes to prevent memory leaks
    if (historyRef.current.length > 10) {
      historyRef.current = historyRef.current.slice(-10)
    }
  }, [location.pathname, location.search])

  // Function to go back to the previous page
  const goBack = () => {
    // Remove current route
    historyRef.current.pop()

    // Get previous route
    const previousRoute = historyRef.current[historyRef.current.length - 1]

    if (previousRoute) {
      navigate(previousRoute)
    } else {
      // If no history, go to home
      navigate('/')
    }
  }

  // Function to get the previous route
  const getPreviousRoute = (): string => {
    const previousRoute = historyRef.current[historyRef.current.length - 2]
    return previousRoute || '/'
  }

  return {
    goBack,
    getPreviousRoute,
    history: historyRef.current,
  }
}
