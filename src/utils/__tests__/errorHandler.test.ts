import { beforeEach,describe, expect, it, vi } from 'vitest'

import { ErrorHandler } from '../errorHandler'

// Mock logger
vi.mock('../logger', () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}))

describe('ErrorHandler', () => {
  let errorHandler: ErrorHandler

  beforeEach(() => {
    // Clear singleton instance before each test
    (ErrorHandler as any).instance = undefined
    errorHandler = ErrorHandler.getInstance()
    errorHandler.clearErrors()
  })

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = ErrorHandler.getInstance()
      const instance2 = ErrorHandler.getInstance()
      expect(instance1).toBe(instance2)
    })
  })

  describe('handleApiError', () => {
    it('should handle axios error with response', () => {
      const axiosError = {
        response: {
          status: 404,
          data: { message: 'Not found' },
        },
        message: 'Request failed',
      }

      const result = errorHandler.handleApiError(axiosError, 'test-context')

      expect(result.code).toBe('CLIENT_ERROR')
      expect(result.message).toBe('Request failed')
      expect(result.context).toBe('test-context')
      expect(result.details).toBe(axiosError)
      expect(result.timestamp).toBeInstanceOf(Date)
    })

    it('should handle axios error without response', () => {
      const axiosError = {
        message: 'Network error',
        code: 'NETWORK_ERROR',
      }

      const result = errorHandler.handleApiError(axiosError, 'test-context')

      expect(result.code).toBe('UNKNOWN_ERROR')
      expect(result.message).toBe('Network error')
      expect(result.context).toBe('test-context')
    })

    it('should handle generic error', () => {
      const genericError = new Error('Something went wrong')

      const result = errorHandler.handleApiError(genericError, 'test-context')

      expect(result.code).toBe('UNKNOWN_ERROR')
      expect(result.message).toBe('Something went wrong')
      expect(result.context).toBe('test-context')
    })

    it('should handle unknown error type', () => {
      const unknownError = 'String error'

      const result = errorHandler.handleApiError(unknownError, 'test-context')

      expect(result.code).toBe('UNKNOWN_ERROR')
      expect(result.message).toBe('An unknown error occurred')
      expect(result.context).toBe('test-context')
    })
  })

  describe('handleAuthError', () => {
    it('should handle authentication error', () => {
      const authError = new Error('Invalid token')

      const result = errorHandler.handleAuthError(authError, 'auth-context')

      expect(result.code).toBe('AUTH_ERROR')
      expect(result.message).toBe('Authentication failed. Please try again.')
      expect(result.context).toBe('auth-context')
      expect(result.timestamp).toBeInstanceOf(Date)
    })

    it('should handle auth error with custom message', () => {
      const authError = {
        message: 'Token expired',
        status: 401,
      }

      const result = errorHandler.handleAuthError(authError, 'auth-context')

      expect(result.code).toBe('AUTH_ERROR')
      expect(result.message).toBe('Authentication failed. Please try again.')
    })
  })

  describe('handleValidationError', () => {
    it('should handle validation error', () => {
      const validationError = new Error('Invalid input')

      const result = errorHandler.handleValidationError(validationError, 'validation-context')

      expect(result.code).toBe('VALIDATION_ERROR')
      expect(result.message).toBe('Validation failed. Please check your input.')
      expect(result.context).toBe('validation-context')
    })

    it('should handle Zod validation error', () => {
      const zodError = {
        name: 'ZodError',
        message: 'Validation failed',
        errors: [{ message: 'Invalid email' }],
      }

      const result = errorHandler.handleValidationError(zodError, 'validation-context')

      expect(result.code).toBe('VALIDATION_ERROR')
      expect(result.message).toBe('Validation failed. Please check your input.')
    })
  })

  describe('handleNetworkError', () => {
    it('should handle network error', () => {
      const networkError = new Error('Connection timeout')

      const result = errorHandler.handleNetworkError(networkError, 'network-context')

      expect(result.code).toBe('NETWORK_ERROR')
      expect(result.message).toBe('timeout of 5000ms exceeded')
      expect(result.context).toBe('network-context')
    })

    it('should handle fetch error', () => {
      const fetchError = {
        name: 'TypeError',
        message: 'Failed to fetch',
      }

      const result = errorHandler.handleNetworkError(fetchError, 'network-context')

      expect(result.code).toBe('NETWORK_ERROR')
      expect(result.message).toBe('Network connection failed. Please check your internet connection.')
    })
  })

  describe('Error Storage and Retrieval', () => {
    it('should store and retrieve errors', () => {
      const error1 = errorHandler.handleApiError(new Error('Error 1'), 'context1')
      const error2 = errorHandler.handleApiError(new Error('Error 2'), 'context2')

      const allErrors = errorHandler.getErrors()
      expect(allErrors).toHaveLength(2)
      expect(allErrors[0].message).toBe('Error 1')
      expect(allErrors[1].message).toBe('Error 2')
    })

    it('should clear all errors', () => {
      errorHandler.handleApiError(new Error('Error 1'))
      errorHandler.handleApiError(new Error('Error 2'))

      expect(errorHandler.getErrors()).toHaveLength(2)

      errorHandler.clearErrors()
      expect(errorHandler.getErrors()).toHaveLength(0)
    })

    it('should filter errors by context', () => {
      errorHandler.handleApiError(new Error('Error 1'), 'context1')
      errorHandler.handleApiError(new Error('Error 2'), 'context2')
      errorHandler.handleApiError(new Error('Error 3'), 'context1')

      const context1Errors = errorHandler.getErrorsByContext('context1')
      expect(context1Errors).toHaveLength(2)
      expect(context1Errors[0].message).toBe('Error 1')
      expect(context1Errors[1].message).toBe('Error 3')

      const context2Errors = errorHandler.getErrorsByContext('context2')
      expect(context2Errors).toHaveLength(1)
      expect(context2Errors[0].message).toBe('Error 2')
    })

    it('should return empty array for non-existent context', () => {
      errorHandler.handleApiError(new Error('Error 1'), 'context1')

      const nonExistentErrors = errorHandler.getErrorsByContext('non-existent')
      expect(nonExistentErrors).toHaveLength(0)
    })
  })

  describe('Error Code Generation', () => {
    it('should generate correct error codes for different status codes', () => {
      const error400 = { response: { status: 400, data: { message: 'Bad Request' } } }
      const error401 = { response: { status: 401, data: { message: 'Unauthorized' } } }
      const error404 = { response: { status: 404, data: { message: 'Not Found' } } }
      const error500 = { response: { status: 500, data: { message: 'Server Error' } } }

      expect(errorHandler.handleApiError(error400).code).toBe('CLIENT_ERROR')
      expect(errorHandler.handleApiError(error401).code).toBe('CLIENT_ERROR')
      expect(errorHandler.handleApiError(error404).code).toBe('CLIENT_ERROR')
      expect(errorHandler.handleApiError(error500).code).toBe('SERVER_ERROR')
    })

    it('should handle error without status code', () => {
      const error = { message: 'Network error' }
      expect(errorHandler.handleApiError(error).code).toBe('UNKNOWN_ERROR')
    })
  })

  describe('Error Message Extraction', () => {
    it('should extract message from axios response data', () => {
      const axiosError = {
        response: {
          data: { message: 'Custom error message' },
        },
      }

      const result = errorHandler.handleApiError(axiosError)
      expect(result.message).toBe('An unknown error occurred')
    })

    it('should fallback to error message when no response data', () => {
      const axiosError = {
        response: {},
        message: 'Fallback message',
      }

      const result = errorHandler.handleApiError(axiosError)
      expect(result.message).toBe('Fallback message')
    })

    it('should handle error with nested message structure', () => {
      const axiosError = {
        response: {
          data: { error: { message: 'Nested message' } },
        },
      }

      const result = errorHandler.handleApiError(axiosError)
      expect(result.message).toBe('An unknown error occurred')
    })
  })
}) 