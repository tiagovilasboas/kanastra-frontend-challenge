import { Component, ErrorInfo, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/Button'

import styles from './ErrorBoundary.module.css'

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
          <div className={styles.errorContainer}>
            <h1 className={styles.errorTitle}>
              {t('ui:errorBoundary.title', 'Oops! Something went wrong')}
            </h1>

            <p className={styles.errorDescription}>
              {t(
                'ui:errorBoundary.description',
                'Sorry, an unexpected error occurred. Try reloading the page.',
              )}
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className={styles.errorDetails}>
                <summary>
                  {t('ui:errorBoundary.details', 'Error details (development)')}
                </summary>
                <pre className={styles.errorStack}>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <Button onClick={this.handleReset} variant="primary">
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
