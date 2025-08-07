interface LogLevel {
  debug: boolean
  info: boolean
  warn: boolean
  error: boolean
}

class Logger {
  private isProduction = import.meta.env.PROD

  private shouldLog(level: keyof LogLevel): boolean {
    if (this.isProduction) {
      // Em produção, apenas erros
      return level === 'error'
    }
    return true // Em desenvolvimento, todos os logs
  }

  debug(message: string, data?: unknown): void {
    if (this.shouldLog('debug')) {
      console.debug(`🔍 [DEBUG] ${message}`, data || '')
    }
  }

  info(message: string, data?: unknown): void {
    if (this.shouldLog('info')) {
      console.info(`ℹ️ [INFO] ${message}`, data || '')
    }
  }

  warn(message: string, data?: unknown): void {
    if (this.shouldLog('warn')) {
      console.warn(`⚠️ [WARN] ${message}`, data || '')
    }
  }

  error(message: string, error?: unknown): void {
    if (this.shouldLog('error')) {
      console.error(`❌ [ERROR] ${message}`, error || '')
    }
  }
}

export const logger = new Logger()
