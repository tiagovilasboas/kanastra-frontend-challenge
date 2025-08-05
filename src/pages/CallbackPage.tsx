import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import { useSpotifyAuth } from '@/hooks/useSpotifyAuth'
import { logger } from '@/utils/logger'

export function CallbackPage(): React.JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { handleCallback } = useSpotifyAuth()

  // Use React Query to handle the callback processing
  const { error } = useQuery({
    queryKey: ['auth-callback'],
    queryFn: async () => {
      try {
        const currentUrl = window.location.href
        await handleCallback(currentUrl)
        navigate('/', { replace: true })
        return { success: true }
      } catch (error) {
        logger.error('Error processing callback', error)
        navigate('/', { replace: true, state: { authError: true } })
        throw error
      }
    },
    enabled: true, // Run immediately when component mounts
    retry: false, // Don't retry on failure
  })

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="text-red-500 text-6xl">{t('auth:warning', '⚠️')}</div>
          <h2 className="text-xl font-semibold text-foreground">
            {t('auth:authenticationError', 'Authentication Error')}
          </h2>
          <p className="text-muted-foreground">
            {t('auth:authenticationFailed', 'Authentication failed. Please try again.')}
          </p>
        </div>
      </div>
    )
  }

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