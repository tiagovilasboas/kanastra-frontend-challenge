import { Component, ErrorInfo, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

// Wrapper component to provide translation
// eslint-disable-next-line react/prop-types
export const ErrorBoundary: React.FC<Props> = ({ children, fallback }) => {
  const { t } = useTranslation()

  class ErrorBoundaryBase extends Component<{ t: typeof t }, State> {
    constructor(props: { t: typeof t }) {
      super(props)
      this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error): State {
      return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
      this.setState({ error, errorInfo })
    }

    handleReset = () => {
      this.setState({ hasError: false, error: undefined, errorInfo: undefined })
    }

    render() {
      const { t } = this.props
      if (this.state.hasError) {
        if (fallback) {
          return fallback
        }

        return (
          <div className="flex flex-col items-center justify-center p-8 text-center min-h-[50vh]">
            <h1 className="text-red-500 text-3xl font-bold mb-6">
              {t('ui:errorBoundary.title', 'Oops! Something went wrong')}
            </h1>

            <p className="text-gray-400 text-lg mb-8 max-w-md">
              {t(
                'ui:errorBoundary.description',
                'Sorry, an unexpected error occurred. Try reloading the page.',
              )}
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="my-6 text-left w-full max-w-lg">
                <summary className="cursor-pointer text-white font-medium mb-2">
                  {t('ui:errorBoundary.details', 'Error details (development)')}
                </summary>
                <pre className="text-xs bg-gray-800 p-4 rounded border border-gray-600 mt-2 overflow-auto whitespace-pre-wrap text-white">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <Button onClick={this.handleReset} variant="default">
              {t('ui:errorBoundary.tryAgain', 'Try Again')}
            </Button>
          </div>
        )
      }

      return children
    }
  }

  return <ErrorBoundaryBase t={t} />
}
