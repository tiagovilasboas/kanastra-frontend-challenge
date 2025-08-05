/// <reference types="cypress" />

declare namespace Cypress {
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

    /**
     * Custom command to set language
     * @example cy.setLanguage('pt')
     */
    setLanguage(languageCode: 'pt' | 'en'): Chainable<void>

    /**
     * Custom command to set language using the language selector
     * @example cy.setLanguageViaSelector('en')
     */
    setLanguageViaSelector(languageCode: 'pt' | 'en'): Chainable<void>
  }
}
