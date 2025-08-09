interface LogLevel {
  debug: boolean
  info: boolean
  warn: boolean
  error: boolean
}

interface LogContext {
  component?: string
  action?: string
  userId?: string
  sessionId?: string
  [key: string]: unknown
}

interface PerformanceMetric {
  name: string
  duration: number
  startTime: number
  endTime: number
}

class Logger {
  private isProduction = import.meta.env.PROD
  private context: LogContext = {}
  private performanceMetrics: Map<string, number> = new Map()

  setContext(context: LogContext): void {
    this.context = { ...this.context, ...context }
  }

  clearContext(): void {
    this.context = {}
  }

  private shouldLog(level: keyof LogLevel): boolean {
    if (this.isProduction) {
      // In production, only errors and warnings
      return level === 'error' || level === 'warn'
    }
    return true // In development, all logs
  }

  private formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString()
    const contextStr =
      Object.keys(this.context).length > 0
        ? ` [${Object.entries(this.context)
            .map(([k, v]) => `${k}:${v}`)
            .join(', ')}]`
        : ''
    return `[${timestamp}] [${level}]${contextStr} ${message}`
  }

  debug(message: string, data?: unknown): void {
    if (this.shouldLog('debug')) {
      console.debug(`🔍 ${this.formatMessage('DEBUG', message)}`, data || '')
    }
  }

  info(message: string, data?: unknown): void {
    if (this.shouldLog('info')) {
      console.info(`ℹ️ ${this.formatMessage('INFO', message)}`, data || '')
    }
  }

  warn(message: string, data?: unknown): void {
    if (this.shouldLog('warn')) {
      console.warn(`⚠️ ${this.formatMessage('WARN', message)}`, data || '')
    }
  }

  error(message: string, error?: unknown): void {
    if (this.shouldLog('error')) {
      console.error(`❌ ${this.formatMessage('ERROR', message)}`, error || '')
    }
  }

  // Performance monitoring
  startTimer(name: string): void {
    this.performanceMetrics.set(name, performance.now())
  }

  endTimer(name: string): PerformanceMetric | null {
    const startTime = this.performanceMetrics.get(name)
    if (!startTime) {
      this.warn(`Timer '${name}' not found`)
      return null
    }

    const endTime = performance.now()
    const duration = endTime - startTime
    this.performanceMetrics.delete(name)

    const metric: PerformanceMetric = {
      name,
      duration,
      startTime,
      endTime,
    }

    this.debug(`Performance: ${name} took ${duration.toFixed(2)}ms`, metric)
    return metric
  }

  // API call logging
  logApiCall(
    method: string,
    url: string,
    duration?: number,
    status?: number,
  ): void {
    const statusEmoji = status && status >= 200 && status < 300 ? '✅' : '❌'
    const durationStr = duration ? ` (${duration.toFixed(2)}ms)` : ''
    this.info(`${statusEmoji} API ${method} ${url}${durationStr}`, {
      method,
      url,
      duration,
      status,
    })
  }

  // User action logging
  logUserAction(
    action: string,
    component?: string,
    data?: Record<string, unknown>,
  ): void {
    this.info(`👤 User action: ${action}`, {
      action,
      component,
      ...(data || {}),
    })
  }

  // Error reporting with stack trace
  logError(message: string, error: Error, context?: LogContext): void {
    const errorData = {
      message: error.message,
      stack: error.stack,
      name: error.name,
      ...context,
    }
    this.error(message, errorData)
  }
}

export const logger = new Logger()
