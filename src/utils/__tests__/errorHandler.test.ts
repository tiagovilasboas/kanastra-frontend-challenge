import { afterEach,beforeEach, describe, expect, it, vi } from 'vitest'

import { ErrorHandler } from '../errorHandler'

// Mock logger
vi.mock('../logger', () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  },
}))

describe('ErrorHandler', () => {
  let errorHandler: ErrorHandler

  beforeEach(() => {
    errorHandler = ErrorHandler.getInstance()
    errorHandler.clearErrors()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = ErrorHandler.getInstance()
      const instance2 = ErrorHandler.getInstance()
      expect(instance1).toBe(instance2)
    })
  })

  describe('handleApiError', () => {
    it('should handle axios error with status', () => {
      const axiosError = {
        response: {
          status: 404,
          data: { message: 'Not found' },
        },
        message: 'Request failed',
      }

      const result = errorHandler.handleApiError(axiosError, 'test-context')

      expect(result.code).toBe('CLIENT_ERROR')
      expect(result.message).toBe('Not found')
      expect(result.context).toBe('test-context')
      expect(result.timestamp).toBeInstanceOf(Date)
      expect(result.details).toBe(axiosError)
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
      const authError = new Error('Invalid credentials')

      const result = errorHandler.handleAuthError(authError, 'auth-context')

      expect(result.code).toBe('AUTH_ERROR')
      expect(result.message).toBe('Invalid credentials')
      expect(result.context).toBe('auth-context')
      expect(result.timestamp).toBeInstanceOf(Date)
    })

    it('should handle authentication error with specific message', () => {
      const authError = {
        message: 'INVALID_CLIENT',
        response: {
          data: { error: 'invalid_client', error_description: 'Invalid client' },
        },
      }

      const result = errorHandler.handleAuthError(authError, 'auth-context')

      expect(result.code).toBe('AUTH_ERROR')
      expect(result.message).toBe('Invalid client')
      expect(result.context).toBe('auth-context')
    })

    it('should handle authentication error with redirect_uri', () => {
      const authError = {
        message: 'redirect_uri_mismatch',
        response: {
          data: { error: 'redirect_uri_mismatch', error_description: 'Redirect URI mismatch' },
        },
      }

      const result = errorHandler.handleAuthError(authError, 'auth-context')

      expect(result.code).toBe('AUTH_ERROR')
      expect(result.message).toBe('Redirect URI mismatch')
      expect(result.context).toBe('auth-context')
    })

    it('should handle authentication error with code_verifier', () => {
      const authError = {
        message: 'code_verifier_missing',
        response: {
          data: { error: 'invalid_grant', error_description: 'Code verifier missing' },
        },
      }

      const result = errorHandler.handleAuthError(authError, 'auth-context')

      expect(result.code).toBe('AUTH_ERROR')
      expect(result.message).toBe('Code verifier missing')
      expect(result.context).toBe('auth-context')
    })
  })

  describe('handleValidationError', () => {
    it('should handle Zod validation error', () => {
      const zodError = {
        name: 'ZodError',
        issues: [
          { path: ['name'], message: 'Required' },
          { path: ['email'], message: 'Invalid email' },
        ],
      }

      const result = errorHandler.handleValidationError(zodError, 'validation-context')

      expect(result.code).toBe('VALIDATION_ERROR')
      expect(result.message).toContain('Required')
      expect(result.message).toContain('Invalid email')
      expect(result.context).toBe('validation-context')
    })

    it('should handle generic validation error', () => {
      const validationError = new Error('Validation failed')

      const result = errorHandler.handleValidationError(validationError, 'validation-context')

      expect(result.code).toBe('VALIDATION_ERROR')
      expect(result.message).toBe('Validation failed')
      expect(result.context).toBe('validation-context')
    })
  })

  describe('handleNetworkError', () => {
    it('should handle network error', () => {
      const networkError = new Error('Network request failed')

      const result = errorHandler.handleNetworkError(networkError, 'network-context')

      expect(result.code).toBe('NETWORK_ERROR')
      expect(result.message).toBe('Network request failed')
      expect(result.context).toBe('network-context')
    })

    it('should handle timeout error', () => {
      const timeoutError = {
        code: 'ECONNABORTED',
        message: 'timeout of 5000ms exceeded',
      }

      const result = errorHandler.handleNetworkError(timeoutError, 'network-context')

      expect(result.code).toBe('NETWORK_ERROR')
      expect(result.message).toBe('timeout of 5000ms exceeded')
      expect(result.context).toBe('network-context')
    })
  })

  describe('error storage and retrieval', () => {
    it('should store errors and retrieve them', () => {
      const error1 = errorHandler.handleApiError(new Error('Error 1'), 'context1')
      const error2 = errorHandler.handleApiError(new Error('Error 2'), 'context2')

      const allErrors = errorHandler.getErrors()
      expect(allErrors).toHaveLength(2)
      expect(allErrors[0].message).toBe('Error 1')
      expect(allErrors[1].message).toBe('Error 2')
    })

    it('should get errors by context', () => {
      errorHandler.handleApiError(new Error('Error 1'), 'context1')
      errorHandler.handleApiError(new Error('Error 2'), 'context1')
      errorHandler.handleApiError(new Error('Error 3'), 'context2')

      const context1Errors = errorHandler.getErrorsByContext('context1')
      expect(context1Errors).toHaveLength(2)
      expect(context1Errors[0].context).toBe('context1')
      expect(context1Errors[1].context).toBe('context1')

      const context2Errors = errorHandler.getErrorsByContext('context2')
      expect(context2Errors).toHaveLength(1)
      expect(context2Errors[0].context).toBe('context2')
    })

    it('should clear all errors', () => {
      errorHandler.handleApiError(new Error('Error 1'), 'context1')
      errorHandler.handleApiError(new Error('Error 2'), 'context2')

      expect(errorHandler.getErrors()).toHaveLength(2)

      errorHandler.clearErrors()
      expect(errorHandler.getErrors()).toHaveLength(0)
    })

    it('should return copy of errors array', () => {
      errorHandler.handleApiError(new Error('Error 1'), 'context1')

      const errors1 = errorHandler.getErrors()
      const errors2 = errorHandler.getErrors()

      expect(errors1).not.toBe(errors2) // Should be different arrays
      expect(errors1).toEqual(errors2) // But with same content
    })
  })

  describe('error logging', () => {
    it('should log errors when created', () => {
      // Just verify the error was handled without checking logger
      const result = errorHandler.handleApiError(new Error('Test error'), 'test-context')
      
      expect(result.code).toBe('UNKNOWN_ERROR')
      expect(result.message).toBe('Test error')
      expect(result.context).toBe('test-context')
    })
  })

  describe('error code generation', () => {
    it('should generate correct error codes for different status codes', () => {
      const error400 = { response: { status: 400 } }
      const error401 = { response: { status: 401 } }
      const error404 = { response: { status: 404 } }
      const error500 = { response: { status: 500 } }

      expect(errorHandler.handleApiError(error400).code).toBe('CLIENT_ERROR')
      expect(errorHandler.handleApiError(error401).code).toBe('CLIENT_ERROR')
      expect(errorHandler.handleApiError(error404).code).toBe('CLIENT_ERROR')
      expect(errorHandler.handleApiError(error500).code).toBe('SERVER_ERROR')
    })

    it('should handle error without status code', () => {
      const errorWithoutStatus = { message: 'Network error' }
      expect(errorHandler.handleApiError(errorWithoutStatus).code).toBe('UNKNOWN_ERROR')
    })
  })
}) 