import { logger } from './logger'

export interface AppError {
  code: string
  message: string
  details?: unknown
  timestamp: Date
  context?: string
}

export class ErrorHandler {
  private static instance: ErrorHandler
  private errors: AppError[] = []

  private constructor() {}

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler()
    }
    return ErrorHandler.instance
  }

  // Handle API errors
  handleApiError(error: unknown, context?: string): AppError {
    const appError: AppError = {
      code: this.getErrorCode(error),
      message: this.getErrorMessage(error),
      details: error,
      timestamp: new Date(),
      context,
    }

    this.logError(appError)
    this.storeError(appError)
    return appError
  }

  // Handle authentication errors
  handleAuthError(error: unknown, context?: string): AppError {
    const appError: AppError = {
      code: 'AUTH_ERROR',
      message: this.getAuthErrorMessage(error),
      details: error,
      timestamp: new Date(),
      context,
    }

    this.logError(appError)
    this.storeError(appError)
    return appError
  }

  // Handle validation errors
  handleValidationError(error: unknown, context?: string): AppError {
    const appError: AppError = {
      code: 'VALIDATION_ERROR',
      message: this.getValidationErrorMessage(error),
      details: error,
      timestamp: new Date(),
      context,
    }

    this.logError(appError)
    this.storeError(appError)
    return appError
  }

  // Handle network errors
  handleNetworkError(error: unknown, context?: string): AppError {
    const appError: AppError = {
      code: 'NETWORK_ERROR',
      message: this.getNetworkErrorMessage(error),
      details: error,
      timestamp: new Date(),
      context,
    }

    this.logError(appError)
    this.storeError(appError)
    return appError
  }

  // Get all stored errors
  getErrors(): AppError[] {
    return [...this.errors]
  }

  // Clear stored errors
  clearErrors(): void {
    this.errors = []
  }

  // Get errors by context
  getErrorsByContext(context: string): AppError[] {
    return this.errors.filter((error) => error.context === context)
  }

  private getErrorCode(error: unknown): string {
    if (error && typeof error === 'object' && 'response' in error) {
      const response = (error as { response: { status: number } }).response
      if (response.status >= 500) return 'SERVER_ERROR'
      if (response.status >= 400) return 'CLIENT_ERROR'
    }
    if (error && typeof error === 'object' && 'status' in error) {
      const status = (error as { status: number }).status
      if (status >= 500) return 'SERVER_ERROR'
      if (status >= 400) return 'CLIENT_ERROR'
    }
    return 'UNKNOWN_ERROR'
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message
    }
    if (error && typeof error === 'object' && 'message' in error) {
      return String((error as { message: string }).message)
    }
    return 'An unknown error occurred'
  }

  private getAuthErrorMessage(error: unknown): string {
    if (error && typeof error === 'object' && 'message' in error) {
      const message = String(
        (error as { message: string }).message,
      ).toLowerCase()
      if (message.includes('invalid_client')) {
        return 'Invalid client'
      }
      if (message.includes('redirect_uri')) {
        return 'Redirect URI mismatch'
      }
      if (message.includes('code_verifier')) {
        return 'Code verifier missing'
      }
      if (message.includes('invalid credentials')) {
        return 'Invalid credentials'
      }
    }
    return 'Authentication failed. Please try again.'
  }

  private getValidationErrorMessage(error: unknown): string {
    if (error && typeof error === 'object' && 'message' in error) {
      const message = String((error as { message: string }).message)
      if (message.includes('Required') || message.includes('Invalid email')) {
        return message
      }
    }
    return 'Validation failed. Please check your input.'
  }

  private getNetworkErrorMessage(error: unknown): string {
    if (error && typeof error === 'object' && 'message' in error) {
      const message = String((error as { message: string }).message)
      if (message.includes('fetch')) {
        return 'Network connection failed. Please check your internet connection.'
      }
      if (message.includes('timeout')) {
        return 'timeout of 5000ms exceeded'
      }
      if (message.includes('Network request failed')) {
        return 'Network request failed'
      }
    }
    return 'Network error occurred. Please try again.'
  }

  private logError(error: AppError): void {
    logger.error(`[${error.code}] ${error.message}`, {
      context: error.context,
      details: error.details,
      timestamp: error.timestamp,
    })
  }

  private storeError(error: AppError): void {
    this.errors.push(error)
    // Keep only last 100 errors to prevent memory issues
    if (this.errors.length > 100) {
      this.errors = this.errors.slice(-100)
    }
  }
}

export const errorHandler = ErrorHandler.getInstance()
