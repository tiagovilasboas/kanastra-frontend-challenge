import { Button, Stack, Text, Title } from '@mantine/core'
import { Component, ErrorInfo, ReactNode } from 'react'
import { WithTranslation, withTranslation } from 'react-i18next'

interface Props extends WithTranslation {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

class ErrorBoundaryBase extends Component<Props, State> {
  constructor(props: Props) {
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
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Stack gap="lg" align="center" className="p-xl text-center">
          <Title order={1} c="red">
            {t('errorBoundary:title', 'Oops! Something went wrong')}
          </Title>

          <Text color="dimmed" size="lg">
            {t(
              'errorBoundary:description',
              'Sorry, an unexpected error occurred. Try reloading the page.',
            )}
          </Text>

          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="text-left">
              <summary>
                {t('errorBoundary:details', 'Error details (development)')}
              </summary>
              <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-auto">
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}

          <Button onClick={this.handleReset} variant="filled" color="blue">
            {t('errorBoundary:tryAgain', 'Try Again')}
          </Button>
        </Stack>
      )
    }

    return this.props.children
  }
}

export const ErrorBoundary = withTranslation()(ErrorBoundaryBase)
