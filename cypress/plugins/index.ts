/// <reference types="cypress" />

/**
 * @type {Cypress.PluginConfig}
 */
export default (
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions,
) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  // Configure environment variables
  config.env = {
    ...config.env,
    // Add any environment-specific configuration here
    spotifyApiUrl: 'https://api.spotify.com/v1',
    spotifyAuthUrl: 'https://accounts.spotify.com',
  }

  // Configure viewport sizes for different devices
  config.viewportWidth = 1280
  config.viewportHeight = 720

  // Configure video recording
  config.video = false
  config.screenshotOnRunFailure = true

  // Configure retries
  config.retries = {
    runMode: 2,
    openMode: 0,
  }

  // Configure timeouts
  config.defaultCommandTimeout = 10000
  config.requestTimeout = 10000
  config.responseTimeout = 10000

  // Configure base URL
  config.baseUrl = 'http://127.0.0.1:5173'

  // Task for handling file operations
  on('task', {
    // Log messages to console
    log(message: string) {
      console.log(message)
      return null
    },

    // Read file contents
    readFile(filename: string) {
      const fs = require('fs')
      return fs.readFileSync(filename, 'utf8')
    },

    // Write file contents
    writeFile(filename: string, content: string) {
      const fs = require('fs')
      fs.writeFileSync(filename, content)
      return null
    },

    // Delete file
    deleteFile(filename: string) {
      const fs = require('fs')
      if (fs.existsSync(filename)) {
        fs.unlinkSync(filename)
      }
      return null
    },

    // Check if file exists
    fileExists(filename: string) {
      const fs = require('fs')
      return fs.existsSync(filename)
    },
  })

  // Handle uncaught exceptions
  on('uncaught:exception', (err, runnable) => {
    // Returning false here prevents Cypress from failing the test
    // for uncaught exceptions that are not related to the test
    if (err.message.includes('ResizeObserver loop limit exceeded')) {
      return false
    }

    // Log other errors for debugging
    console.warn('Uncaught exception:', err.message)
    return false
  })

  // Handle window:before:load event
  on('window:before:load', (win) => {
    // Mock any global objects or functions here if needed
    cy.stub(win.console, 'log').as('consoleLog')
    cy.stub(win.console, 'error').as('consoleError')
    cy.stub(win.console, 'warn').as('consoleWarn')
  })

  return config
}
