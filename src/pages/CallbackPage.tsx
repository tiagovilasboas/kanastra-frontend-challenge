import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useSpotifyAuth } from '@/hooks/useSpotifyAuth'
import { logger } from '@/utils/logger'

export function CallbackPage(): React.JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { handleCallback } = useSpotifyAuth()

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Removed debug logs for cleaner production code
        
        // Get the current URL with all parameters
        const currentUrl = window.location.href
        
        // Handle the callback
        await handleCallback(currentUrl)
        
        // Redirect to home page after successful authentication
                  // Removed debug logs for cleaner production code
        navigate('/', { replace: true })
      } catch (error) {
        logger.error('Error processing callback', error)
        // Redirect to home page with error state
        navigate('/', { replace: true, state: { authError: true } })
      }
    }

    processCallback()
  }, [handleCallback, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <h2 className="text-xl font-semibold text-foreground">
          {t('auth:processingLogin', 'Processing login...')}
        </h2>
        <p className="text-muted-foreground">
          {t('auth:pleaseWait', 'Please wait while we complete your authentication.')}
        </p>
      </div>
    </div>
  )
} 