import '@testing-library/jest-dom'

import * as matchers from '@testing-library/jest-dom/matchers'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll,expect } from 'vitest'

// Extend Vitest's expect method with methods from react-testing-library
expect.extend(matchers)

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn().mockReturnValue(null),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  key: vi.fn(),
  length: 0
}

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  key: vi.fn(),
  length: 0
}

// Mock window.location
const locationMock = {
  href: 'http://localhost:3000',
  origin: 'http://localhost:3000',
  protocol: 'http:',
  host: 'localhost:3000',
  hostname: 'localhost',
  port: '3000',
  pathname: '/',
  search: '',
  hash: '',
  assign: vi.fn(),
  replace: vi.fn(),
  reload: vi.fn()
}

// Mock window.history
const historyMock = {
  back: vi.fn(),
  forward: vi.fn(),
  go: vi.fn(),
  pushState: vi.fn(),
  replaceState: vi.fn(),
  length: 1
}

// Export for use in tests
export { historyMock }

beforeAll(() => {
  // Setup global mocks
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true
  })
  
  Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock,
    writable: true
  })
  
  Object.defineProperty(window, 'location', {
    value: locationMock,
    writable: true
  })
  
  Object.defineProperty(window, 'history', {
    value: historyMock,
    writable: true
  })
  
  // Mock crypto for PKCE
  Object.defineProperty(window, 'crypto', {
    value: {
      getRandomValues: vi.fn((arr) => {
        for (let i = 0; i < arr.length; i++) {
          arr[i] = i % 256
        }
        return arr
      }),
      subtle: {
        digest: vi.fn().mockResolvedValue(new ArrayBuffer(32)),
        importKey: vi.fn().mockResolvedValue({}),
        sign: vi.fn().mockResolvedValue(new ArrayBuffer(64))
      }
    },
    writable: true
  })
})

// Cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup()
  // Reset all mocks
  vi.clearAllMocks()
  localStorageMock.clear()
  sessionStorageMock.clear()
})
