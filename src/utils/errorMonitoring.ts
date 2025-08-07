import { AppError } from './errorHandler'
import { logger } from './logger'

export interface ErrorReport {
  error: AppError
  userAgent: string
  url: string
  timestamp: Date
  sessionId: string
  userId?: string
}

export interface ErrorMonitoringConfig {
  enabled: boolean
  endpoint?: string
  apiKey?: string
  environment: 'development' | 'staging' | 'production'
  sampleRate: number // 0-1, percentage of errors to report
}

class ErrorMonitoring {
  private config: ErrorMonitoringConfig
  private sessionId: string
  private userId?: string

  constructor(config: ErrorMonitoringConfig) {
    this.config = config
    this.sessionId = this.generateSessionId()
    this.setupGlobalErrorHandlers()
  }

  // Set user ID for error tracking
  setUserId(userId: string): void {
    this.userId = userId
    // Removed debug logs for cleaner production code
  }

  // Report error to monitoring service
  async reportError(error: AppError): Promise<void> {
    if (!this.config.enabled) {
      // Removed debug logs for cleaner production code
      return
    }

    // Apply sampling
    if (Math.random() > this.config.sampleRate) {
      // Removed debug logs for cleaner production code
      return
    }

    const errorReport: ErrorReport = {
      error,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date(),
      sessionId: this.sessionId,
      userId: this.userId,
    }

    try {
      await this.sendErrorReport(errorReport)
      // Removed debug logs for cleaner production code
    } catch (reportError) {
      logger.error('Failed to send error report', reportError)
    }
  }

  // Report React error boundary errors
  reportReactError(error: Error, errorInfo: React.ErrorInfo): void {
    const appError: AppError = {
      code: 'REACT_ERROR',
      message: error.message,
      details: { error, errorInfo },
      timestamp: new Date(),
      context: 'React Error Boundary',
    }

    this.reportError(appError)
  }

  // Report unhandled promise rejections
  reportUnhandledRejection(reason: unknown, promise: Promise<unknown>): void {
    const appError: AppError = {
      code: 'UNHANDLED_REJECTION',
      message: reason instanceof Error ? reason.message : String(reason),
      details: { reason, promise },
      timestamp: new Date(),
      context: 'Unhandled Promise Rejection',
    }

    this.reportError(appError)
  }

  // Report network errors
  reportNetworkError(error: unknown, context?: string): void {
    const appError: AppError = {
      code: 'NETWORK_ERROR',
      message: error instanceof Error ? error.message : String(error),
      details: error,
      timestamp: new Date(),
      context: context || 'Network Request',
    }

    this.reportError(appError)
  }

  // Get current session ID
  getSessionId(): string {
    return this.sessionId
  }

  // Generate new session ID
  generateNewSession(): void {
    this.sessionId = this.generateSessionId()
    // Removed debug logs for cleaner production code
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private setupGlobalErrorHandlers(): void {
    if (typeof window === 'undefined') return

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.reportUnhandledRejection(event.reason, event.promise)
    })

    // Handle global errors
    window.addEventListener('error', (event) => {
      const appError: AppError = {
        code: 'GLOBAL_ERROR',
        message: event.message,
        details: {
          error: event.error,
          filename: event.filename,
          lineno: event.lineno,
        },
        timestamp: new Date(),
        context: 'Global Error Handler',
      }

      this.reportError(appError)
    })

    // Handle console errors
    const originalConsoleError = console.error
    console.error = (...args) => {
      originalConsoleError.apply(console, args)

      // Only report if it's an actual error, not just console.error calls
      if (args[0] instanceof Error) {
        const appError: AppError = {
          code: 'CONSOLE_ERROR',
          message: args[0].message,
          details: args,
          timestamp: new Date(),
          context: 'Console Error',
        }

        this.reportError(appError)
      }
    }

    // Removed debug logs for cleaner production code
  }

  private async sendErrorReport(errorReport: ErrorReport): Promise<void> {
    if (!this.config.endpoint) {
      // Removed debug logs for cleaner production code
      logger.error('Error Report', errorReport)
      return
    }

    const response = await fetch(this.config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.config.apiKey && {
          Authorization: `Bearer ${this.config.apiKey}`,
        }),
      },
      body: JSON.stringify({
        ...errorReport,
        environment: this.config.environment,
        timestamp: errorReport.timestamp.toISOString(),
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to send error report: ${response.status}`)
    }
  }
}

// Default configuration
const defaultConfig: ErrorMonitoringConfig = {
  enabled: import.meta.env.PROD, // Only enable in production
  environment:
    (import.meta.env.MODE as 'development' | 'staging' | 'production') ||
    'development',
  sampleRate: 1.0, // Report all errors by default
}

// Create singleton instance
export const errorMonitoring = new ErrorMonitoring(defaultConfig)

// Export for configuration
export const configureErrorMonitoring = (
  config: Partial<ErrorMonitoringConfig>,
): void => {
  Object.assign(defaultConfig, config)
  // Removed debug logs for cleaner production code
}
