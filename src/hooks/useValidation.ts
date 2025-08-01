import { useCallback, useState } from 'react'
import { z } from 'zod'

interface ValidationResult<T> {
  isValid: boolean
  data: T | null
  errors: string[]
}

export function useValidation<T>(schema: z.ZodSchema<T>) {
  const [errors, setErrors] = useState<string[]>([])

  const validate = useCallback(
    (data: unknown): ValidationResult<T> => {
      try {
        const validatedData = schema.parse(data)
        setErrors([])
        return {
          isValid: true,
          data: validatedData,
          errors: [],
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errorMessages = error.errors.map((err) => err.message)
          setErrors(errorMessages)
          return {
            isValid: false,
            data: null,
            errors: errorMessages,
          }
        }

        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Erro de validação desconhecido'
        setErrors([errorMessage])
        return {
          isValid: false,
          data: null,
          errors: [errorMessage],
        }
      }
    },
    [schema],
  )

  const validateAsync = useCallback(
    async (data: unknown): Promise<ValidationResult<T>> => {
      try {
        const validatedData = await schema.parseAsync(data)
        setErrors([])
        return {
          isValid: true,
          data: validatedData,
          errors: [],
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errorMessages = error.errors.map((err) => err.message)
          setErrors(errorMessages)
          return {
            isValid: false,
            data: null,
            errors: errorMessages,
          }
        }

        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Erro de validação desconhecido'
        setErrors([errorMessage])
        return {
          isValid: false,
          data: null,
          errors: [errorMessage],
        }
      }
    },
    [schema],
  )

  const clearErrors = useCallback(() => {
    setErrors([])
  }, [])

  return {
    validate,
    validateAsync,
    errors,
    clearErrors,
  }
}
