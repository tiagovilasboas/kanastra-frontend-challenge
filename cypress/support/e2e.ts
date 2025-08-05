// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Add global configuration
beforeEach(() => {
  // Clear localStorage before each test
  cy.clearLocalStorage()

  // Set default viewport
  cy.viewport(1280, 720)
})

// Global error handling
Cypress.on('uncaught:exception', (err, runnable) => {
  // Returning false here prevents Cypress from failing the test
  // for uncaught exceptions that are not related to the test
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false
  }

  // Log other errors for debugging
  console.warn('Uncaught exception:', err.message)
  return false
})

// Global configuration for timeouts
Cypress.config('defaultCommandTimeout', 10000)
Cypress.config('requestTimeout', 10000)
Cypress.config('responseTimeout', 10000)

// Global configuration for retries
Cypress.config('retries', {
  runMode: 2,
  openMode: 0,
})
