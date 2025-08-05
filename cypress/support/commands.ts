/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// -- This is a parent command --
Cypress.Commands.add('login', (email, password) => {
  console.log('Custom command example: Login', email, password)
})

// -- This is a child command --
Cypress.Commands.add('drag', { prevSubject: 'element' }, (subject, options) => {
  return subject
})

// -- This is a dual command --
Cypress.Commands.add(
  'dismiss',
  { prevSubject: 'optional' },
  (subject, options) => {
    return subject
  },
)

// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Custom commands for Spotify Explorer

/**
 * Mock Spotify API responses
 */
Cypress.Commands.add(
  'mockSpotifyAPI',
  (endpoint: string, response: any, statusCode = 200) => {
    cy.intercept('GET', `https://api.spotify.com/v1/${endpoint}*`, {
      statusCode,
      body: response,
    }).as(`spotify-${endpoint.replace(/\//g, '-')}`)
  },
)

/**
 * Mock Spotify search API
 */
Cypress.Commands.add(
  'mockSpotifySearch',
  (query: string, type: string, response: any) => {
    cy.intercept(
      'GET',
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}*`,
      {
        statusCode: 200,
        body: response,
      },
    ).as(`search-${type}-${query.replace(/\s+/g, '-')}`)
  },
)

/**
 * Mock Spotify authentication
 */
Cypress.Commands.add('mockSpotifyAuth', (success = true) => {
  if (success) {
    cy.intercept('POST', 'https://accounts.spotify.com/api/token', {
      statusCode: 200,
      body: {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        expires_in: 3600,
        token_type: 'Bearer',
      },
    }).as('spotify-auth-success')
  } else {
    cy.intercept('POST', 'https://accounts.spotify.com/api/token', {
      statusCode: 400,
      body: { error: 'invalid_grant' },
    }).as('spotify-auth-error')
  }
})

/**
 * Set localStorage data
 */
Cypress.Commands.add('setLocalStorage', (key: string, value: any) => {
  cy.window().then((win) => {
    win.localStorage.setItem(
      key,
      typeof value === 'string' ? value : JSON.stringify(value),
    )
  })
})

/**
 * Get localStorage data
 */
Cypress.Commands.add('getLocalStorage', (key: string) => {
  cy.window().then((win) => {
    return win.localStorage.getItem(key)
  })
})

/**
 * Clear localStorage
 */
Cypress.Commands.add('clearLocalStorage', () => {
  cy.window().then((win) => {
    win.localStorage.clear()
  })
})

/**
 * Wait for loading state to disappear
 */
Cypress.Commands.add(
  'waitForLoading',
  (selector = '[data-testid*="loading"]') => {
    cy.get(selector).should('not.exist')
  },
)

/**
 * Wait for error state to appear
 */
Cypress.Commands.add('waitForError', (selector = '[data-testid*="error"]') => {
  cy.get(selector).should('be.visible')
})

/**
 * Check if element has specific class
 */
Cypress.Commands.add(
  'hasClass',
  { prevSubject: 'element' },
  (subject, className: string) => {
    cy.wrap(subject).should('have.class', className)
  },
)

/**
 * Check if element does not have specific class
 */
Cypress.Commands.add(
  'notHaveClass',
  { prevSubject: 'element' },
  (subject, className: string) => {
    cy.wrap(subject).should('not.have.class', className)
  },
)

/**
 * Navigate to page and wait for it to load
 */
Cypress.Commands.add('visitPage', (path: string) => {
  cy.visit(path)
  cy.get('body').should('be.visible')
})

/**
 * Click element and wait for navigation
 */
Cypress.Commands.add(
  'clickAndWait',
  (selector: string, expectedUrl?: string) => {
    cy.get(selector).click()
    if (expectedUrl) {
      cy.url().should('include', expectedUrl)
    }
  },
)

/**
 * Type in input and wait for debounce
 */
Cypress.Commands.add('typeWithDebounce', (selector: string, text: string) => {
  cy.get(selector).clear().type(text)
  // Wait for potential debounce
  cy.wait(500)
})

/**
 * Check if element contains text (case insensitive)
 */
Cypress.Commands.add(
  'containsText',
  { prevSubject: 'element' },
  (subject, text: string) => {
    cy.wrap(subject).should('contain.text', text)
  },
)

/**
 * Mock network error
 */
Cypress.Commands.add('mockNetworkError', (endpoint: string) => {
  cy.intercept('GET', `https://api.spotify.com/v1/${endpoint}*`, {
    forceNetworkError: true,
  }).as(`network-error-${endpoint.replace(/\//g, '-')}`)
})

/**
 * Mock slow response
 */
Cypress.Commands.add(
  'mockSlowResponse',
  (endpoint: string, response: any, delay = 2000) => {
    cy.intercept('GET', `https://api.spotify.com/v1/${endpoint}*`, {
      delay,
      statusCode: 200,
      body: response,
    }).as(`slow-${endpoint.replace(/\//g, '-')}`)
  },
)

/**
 * Check performance
 */
Cypress.Commands.add('checkPerformance', (maxTime = 3000) => {
  const startTime = Date.now()
  cy.window().then(() => {
    const loadTime = Date.now() - startTime
    expect(loadTime).to.be.lessThan(maxTime)
  })
})

/**
 * Set viewport and wait for resize
 */
Cypress.Commands.add('setViewport', (width: number, height: number) => {
  cy.viewport(width, height)
  cy.wait(100) // Wait for resize
})

/**
 * Mock empty response
 */
Cypress.Commands.add('mockEmptyResponse', (endpoint: string) => {
  cy.intercept('GET', `https://api.spotify.com/v1/${endpoint}*`, {
    statusCode: 200,
    body: { items: [], total: 0 },
  }).as(`empty-${endpoint.replace(/\//g, '-')}`)
})

// Type definitions for custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to mock Spotify API responses
       * @example cy.mockSpotifyAPI('artists/123', { id: '123', name: 'Artist' })
       */
      mockSpotifyAPI(
        endpoint: string,
        response: any,
        statusCode?: number,
      ): Chainable<void>

      /**
       * Custom command to mock Spotify search API
       * @example cy.mockSpotifySearch('test', 'artist', { artists: { items: [] } })
       */
      mockSpotifySearch(
        query: string,
        type: string,
        response: any,
      ): Chainable<void>

      /**
       * Custom command to mock Spotify authentication
       * @example cy.mockSpotifyAuth(true)
       */
      mockSpotifyAuth(success?: boolean): Chainable<void>

      /**
       * Custom command to set localStorage data
       * @example cy.setLocalStorage('favorites', { artists: [] })
       */
      setLocalStorage(key: string, value: any): Chainable<void>

      /**
       * Custom command to get localStorage data
       * @example cy.getLocalStorage('favorites')
       */
      getLocalStorage(key: string): Chainable<string | null>

      /**
       * Custom command to clear localStorage
       * @example cy.clearLocalStorage()
       */
      clearLocalStorage(): Chainable<void>

      /**
       * Custom command to wait for loading state to disappear
       * @example cy.waitForLoading()
       */
      waitForLoading(selector?: string): Chainable<void>

      /**
       * Custom command to wait for error state to appear
       * @example cy.waitForError()
       */
      waitForError(selector?: string): Chainable<void>

      /**
       * Custom command to check if element has specific class
       * @example cy.get('[data-testid="button"]').hasClass('active')
       */
      hasClass(className: string): Chainable<void>

      /**
       * Custom command to check if element does not have specific class
       * @example cy.get('[data-testid="button"]').notHaveClass('active')
       */
      notHaveClass(className: string): Chainable<void>

      /**
       * Custom command to navigate to page and wait for it to load
       * @example cy.visitPage('/artists')
       */
      visitPage(path: string): Chainable<void>

      /**
       * Custom command to click element and wait for navigation
       * @example cy.clickAndWait('[data-testid="nav-artists"]', '/artists')
       */
      clickAndWait(selector: string, expectedUrl?: string): Chainable<void>

      /**
       * Custom command to type in input and wait for debounce
       * @example cy.typeWithDebounce('[data-testid="search-input"]', 'test')
       */
      typeWithDebounce(selector: string, text: string): Chainable<void>

      /**
       * Custom command to check if element contains text (case insensitive)
       * @example cy.get('[data-testid="title"]').containsText('Welcome')
       */
      containsText(text: string): Chainable<void>

      /**
       * Custom command to mock network error
       * @example cy.mockNetworkError('artists/123')
       */
      mockNetworkError(endpoint: string): Chainable<void>

      /**
       * Custom command to mock slow response
       * @example cy.mockSlowResponse('artists/123', { id: '123' }, 3000)
       */
      mockSlowResponse(
        endpoint: string,
        response: any,
        delay?: number,
      ): Chainable<void>

      /**
       * Custom command to check performance
       * @example cy.checkPerformance(5000)
       */
      checkPerformance(maxTime?: number): Chainable<void>

      /**
       * Custom command to set viewport and wait for resize
       * @example cy.setViewport(1920, 1080)
       */
      setViewport(width: number, height: number): Chainable<void>

      /**
       * Custom command to mock empty response
       * @example cy.mockEmptyResponse('search')
       */
      mockEmptyResponse(endpoint: string): Chainable<void>

      // Original Cypress commands
      login(email: string, password: string): Chainable<void>
      drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
      dismiss(
        subject: string | Element,
        options?: Partial<TypeOptions>,
      ): Chainable<Element>
    }
  }
}
