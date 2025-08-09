import { AlertTriangle, RefreshCw, Wifi, WifiOff } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface ErrorFallbackProps {
  error: Error
  resetError: () => void
  context?: string
}

interface NetworkErrorFallbackProps {
  onRetry: () => void
  context?: string
}

interface LoadingErrorFallbackProps {
  onRetry: () => void
  resource?: string
}

// Generic error fallback
export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
  context = 'application',
}) => {
  const { t } = useTranslation()

  const isNetworkError =
    error.message.includes('fetch') ||
    error.message.includes('NetworkError') ||
    error.message.includes('Failed to fetch')

  const isAuthError =
    error.message.includes('401') ||
    error.message.includes('403') ||
    error.message.includes('unauthorized')

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          {isNetworkError ? (
            <WifiOff className="h-12 w-12 text-destructive" />
          ) : (
            <AlertTriangle className="h-12 w-12 text-destructive" />
          )}
        </div>
        <CardTitle>
          {isNetworkError
            ? t('errors:networkError', 'Connection Error')
            : isAuthError
              ? t('errors:authError', 'Authentication Error')
              : t('errors:genericError', 'Something went wrong')}
        </CardTitle>
        <CardDescription>
          {isNetworkError
            ? t(
                'errors:networkErrorDesc',
                'Please check your internet connection and try again.',
              )
            : isAuthError
              ? t(
                  'errors:authErrorDesc',
                  'Please refresh the page to re-authenticate.',
                )
              : t(
                  'errors:genericErrorDesc',
                  'An unexpected error occurred in the {context}.',
                  { context },
                )}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4">
            <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
              {t('errors:technicalDetails', 'Technical Details')}
            </summary>
            <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto max-h-32">
              {error.stack}
            </pre>
          </details>
        )}
      </CardContent>

      <CardFooter>
        <Button
          onClick={resetError}
          className="w-full"
          variant={isAuthError ? 'default' : 'outline'}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          {isAuthError
            ? t('errors:refresh', 'Refresh Page')
            : t('errors:tryAgain', 'Try Again')}
        </Button>
      </CardFooter>
    </Card>
  )
}

// Network-specific error fallback
export const NetworkErrorFallback: React.FC<NetworkErrorFallbackProps> = ({
  onRetry,
  context = 'data',
}) => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <WifiOff className="h-16 w-16 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">
        {t('errors:connectionLost', 'Connection Lost')}
      </h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        {t(
          'errors:connectionLostDesc',
          'Unable to load {context}. Please check your connection.',
          { context },
        )}
      </p>
      <Button onClick={onRetry} variant="outline">
        <Wifi className="mr-2 h-4 w-4" />
        {t('errors:reconnect', 'Reconnect')}
      </Button>
    </div>
  )
}

// Loading-specific error fallback
export const LoadingErrorFallback: React.FC<LoadingErrorFallbackProps> = ({
  onRetry,
  resource = 'content',
}) => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
      <AlertTriangle className="h-12 w-12 text-muted-foreground mb-3" />
      <h4 className="font-medium mb-2">
        {t('errors:loadingFailed', 'Failed to Load')}
      </h4>
      <p className="text-sm text-muted-foreground mb-4">
        {t('errors:loadingFailedDesc', 'Could not load {resource}', {
          resource,
        })}
      </p>
      <Button onClick={onRetry} size="sm" variant="outline">
        <RefreshCw className="mr-2 h-3 w-3" />
        {t('errors:retry', 'Retry')}
      </Button>
    </div>
  )
}

// Compact error fallback for smaller components
export const CompactErrorFallback: React.FC<{ onRetry: () => void }> = ({
  onRetry,
}) => {
  const { t } = useTranslation()

  return (
    <div className="flex items-center justify-center p-4 bg-muted/50 rounded border">
      <AlertTriangle className="h-4 w-4 text-destructive mr-2" />
      <span className="text-sm mr-3">
        {t('errors:loadError', 'Load error')}
      </span>
      <Button onClick={onRetry} size="sm" variant="outline">
        {t('errors:retry', 'Retry')}
      </Button>
    </div>
  )
}
