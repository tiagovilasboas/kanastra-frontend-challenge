import { logger } from './logger'

interface WebVitalMetric {
  name: string
  value: number
  delta: number
  entries: PerformanceEntry[]
  id: string
  navigationType: string
}

interface PerformanceData {
  metric: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  timestamp: number
  url: string
  userAgent: string
}

// Web Vitals thresholds based on Core Web Vitals recommendations
const THRESHOLDS = {
  LCP: { good: 2500, needsImprovement: 4000 }, // Largest Contentful Paint
  FID: { good: 100, needsImprovement: 300 }, // First Input Delay
  CLS: { good: 0.1, needsImprovement: 0.25 }, // Cumulative Layout Shift
  FCP: { good: 1800, needsImprovement: 3000 }, // First Contentful Paint
  TTFB: { good: 800, needsImprovement: 1800 }, // Time to First Byte
  INP: { good: 200, needsImprovement: 500 }, // Interaction to Next Paint
}

function getRating(
  metric: string,
  value: number,
): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[metric as keyof typeof THRESHOLDS]
  if (!threshold) return 'good'

  if (value <= threshold.good) return 'good'
  if (value <= threshold.needsImprovement) return 'needs-improvement'
  return 'poor'
}

function sendToAnalytics(data: PerformanceData): void {
  // In production, send to your analytics service
  if (import.meta.env.PROD) {
    // Example: Google Analytics 4
    // gtag('event', 'web_vitals', {
    //   metric_name: data.metric,
    //   metric_value: data.value,
    //   metric_rating: data.rating,
    // })
    // Example: Custom analytics endpoint
    // fetch('/api/analytics/web-vitals', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // }).catch(() => {}) // Silent fail
  }

  // Always log for development
  logger.info(`Web Vitals: ${data.metric}`, {
    value: data.value,
    rating: data.rating,
    url: data.url,
  })
}

function handleWebVital(metric: WebVitalMetric): void {
  const data: PerformanceData = {
    metric: metric.name,
    value: Math.round(metric.value),
    rating: getRating(metric.name, metric.value),
    timestamp: Date.now(),
    url: window.location.href,
    userAgent: navigator.userAgent,
  }

  sendToAnalytics(data)
}

// Initialize Web Vitals monitoring
export async function initWebVitals(): Promise<void> {
  try {
    // Dynamically import web-vitals to avoid affecting page load
    const { onCLS, onFCP, onLCP, onTTFB } = await import('web-vitals')

    // Monitor Core Web Vitals
    onLCP(handleWebVital)
    onCLS(handleWebVital)
    onFCP(handleWebVital)
    onTTFB(handleWebVital)

    // Try to monitor INP if available (newer metric)
    try {
      const { onINP } = await import('web-vitals')
      onINP(handleWebVital)
    } catch {
      // INP not available in older versions
    }

    logger.info('Web Vitals monitoring initialized')
  } catch (error) {
    logger.warn('Failed to initialize Web Vitals monitoring', { error })
  }
}

// Manual performance measurements
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private timers: Map<string, number> = new Map()

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  // Start timing a custom operation
  startTimer(name: string): void {
    this.timers.set(name, performance.now())
  }

  // End timing and log the result
  endTimer(name: string): number | null {
    const startTime = this.timers.get(name)
    if (!startTime) {
      logger.warn(`Timer '${name}' not found`)
      return null
    }

    const duration = performance.now() - startTime
    this.timers.delete(name)

    logger.info(`Performance: ${name}`, { duration: Math.round(duration) })

    // Send custom timing to analytics
    sendToAnalytics({
      metric: `custom_${name}`,
      value: Math.round(duration),
      rating:
        duration < 1000
          ? 'good'
          : duration < 3000
            ? 'needs-improvement'
            : 'poor',
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    })

    return duration
  }

  // Measure resource loading times
  measureResourceTiming(resourceType?: string): void {
    if (!('performance' in window) || !('getEntriesByType' in performance)) {
      return
    }

    const resources = performance.getEntriesByType(
      'resource',
    ) as PerformanceResourceTiming[]

    resources.forEach((resource) => {
      if (resourceType && !resource.name.includes(resourceType)) {
        return
      }

      const duration = resource.responseEnd - resource.requestStart
      const size = resource.transferSize || 0

      logger.debug(`Resource timing: ${resource.name}`, {
        duration: Math.round(duration),
        size,
        type: resource.initiatorType,
      })
    })
  }

  // Monitor long tasks (> 50ms)
  observeLongTasks(): void {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.duration > 50) {
              logger.warn('Long task detected', {
                duration: Math.round(entry.duration),
                startTime: Math.round(entry.startTime),
              })

              sendToAnalytics({
                metric: 'long_task',
                value: Math.round(entry.duration),
                rating: 'poor',
                timestamp: Date.now(),
                url: window.location.href,
                userAgent: navigator.userAgent,
              })
            }
          })
        })

        observer.observe({ entryTypes: ['longtask'] })
        logger.info('Long task monitoring enabled')
      } catch (error) {
        logger.warn('Long task monitoring not available', { error })
      }
    }
  }

  // Get current page performance metrics
  getPageMetrics(): Record<string, number> {
    if (!('performance' in window) || !performance.timing) {
      return {}
    }

    const timing = performance.timing
    const navigation = performance.navigation

    return {
      // Navigation timing
      dns: timing.domainLookupEnd - timing.domainLookupStart,
      tcp: timing.connectEnd - timing.connectStart,
      ssl: timing.secureConnectionStart
        ? timing.connectEnd - timing.secureConnectionStart
        : 0,
      ttfb: timing.responseStart - timing.requestStart,
      download: timing.responseEnd - timing.responseStart,
      domContentLoaded:
        timing.domContentLoadedEventEnd - timing.navigationStart,
      loadComplete: timing.loadEventEnd - timing.navigationStart,

      // Navigation type
      navigationType: navigation.type,
      redirectCount: navigation.redirectCount,
    }
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance()

// Utility function to measure async operations
export async function measureAsync<T>(
  name: string,
  asyncOperation: () => Promise<T>,
): Promise<T> {
  performanceMonitor.startTimer(name)
  try {
    const result = await asyncOperation()
    performanceMonitor.endTimer(name)
    return result
  } catch (error) {
    performanceMonitor.endTimer(name)
    throw error
  }
}
