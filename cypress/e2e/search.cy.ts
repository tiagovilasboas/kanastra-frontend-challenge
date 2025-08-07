describe('Search Page E2E - Happy Path', () => {
  beforeEach(() => {
    cy.visit('/search')
  })

  it('should display search page with all search types and perform basic search', () => {
    // Check if search page loads correctly
    cy.get('[data-testid="search-header"]').should('be.visible')
    cy.get('[data-testid="search-input"]').should('be.visible')
    cy.get('[data-testid="search-button"]').should('be.visible')

    // Type a search query
    cy.get('[data-testid="search-input"]').type('coldplay')
    cy.get('[data-testid="search-button"]').click()

    // Wait for search results
    cy.get('[data-testid="search-results"]').should('be.visible')

    // Check if results are displayed
    cy.get('[data-testid="search-results"]').should('contain', 'coldplay')
  })

  it('should switch between search types and display appropriate results', () => {
    // Type a search query
    cy.get('[data-testid="search-input"]').type('coldplay')
    cy.get('[data-testid="search-button"]').click()

    // Wait for search results
    cy.get('[data-testid="search-results"]').should('be.visible')

    // Test switching to playlists
    cy.get('[data-testid="search-type-button"]').contains('Playlists').click()
    cy.url().should('include', '/search/playlist')
    cy.get('[data-testid="search-results"]').should('be.visible')

    // Test switching to tracks
    cy.get('[data-testid="search-type-button"]').contains('Músicas').click()
    cy.url().should('include', '/search/track')
    cy.get('[data-testid="search-results"]').should('be.visible')

    // Test switching back to playlists
    cy.get('[data-testid="search-type-button"]').contains('Playlists').click()
    cy.url().should('include', '/search/playlist')
    cy.get('[data-testid="search-results"]').should('be.visible')

    // Test switching to artists
    cy.get('[data-testid="search-type-button"]').contains('Artistas').click()
    cy.url().should('include', '/search/artist')
    cy.get('[data-testid="search-results"]').should('be.visible')

    // Test switching back to all
    cy.get('[data-testid="search-type-button"]').contains('Tudo').click()
    cy.url().should('include', '/search')
    cy.get('[data-testid="search-results"]').should('be.visible')
  })

  it('should handle empty search results gracefully', () => {
    // Type a search query that should return no results
    cy.get('[data-testid="search-input"]').type('xyz123nonexistent')
    cy.get('[data-testid="search-button"]').click()

    // Check if no results message is displayed
    cy.get('[data-testid="search-results"]').should('be.visible')
    cy.contains('No results found').should('be.visible')
  })

  it('should maintain search state when navigating between types', () => {
    // Type a search query
    cy.get('[data-testid="search-input"]').type('coldplay')
    cy.get('[data-testid="search-button"]').click()

    // Wait for search results
    cy.get('[data-testid="search-results"]').should('be.visible')

    // Navigate to playlists and verify query is maintained
    cy.get('[data-testid="search-type-button"]').contains('Playlists').click()
    cy.url().should('include', 'q=coldplay')
    cy.url().should('include', '/search/playlist')

    // Navigate to tracks and verify query is maintained
    cy.get('[data-testid="search-type-button"]').contains('Músicas').click()
    cy.url().should('include', 'q=coldplay')
    cy.url().should('include', '/search/track')

    // Navigate back to all and verify query is maintained
    cy.get('[data-testid="search-type-button"]').contains('Tudo').click()
    cy.url().should('include', 'q=coldplay')
    cy.url().should('include', '/search')
  })

  it('should handle rapid type switching without losing data', () => {
    // Type a search query
    cy.get('[data-testid="search-input"]').type('coldplay')
    cy.get('[data-testid="search-button"]').click()

    // Wait for search results
    cy.get('[data-testid="search-results"]').should('be.visible')

    // Rapidly switch between types
    cy.get('[data-testid="search-type-button"]').contains('Playlists').click()
    cy.wait(500)
    cy.get('[data-testid="search-type-button"]').contains('Músicas').click()
    cy.wait(500)
    cy.get('[data-testid="search-type-button"]').contains('Artistas').click()
    cy.wait(500)
    cy.get('[data-testid="search-type-button"]').contains('Playlists').click()
    cy.wait(500)

    // Verify we're on playlists page with results
    cy.url().should('include', '/search/playlist')
    cy.url().should('include', 'q=coldplay')
    cy.get('[data-testid="search-results"]').should('be.visible')
  })

  it('should handle direct navigation to specific search types', () => {
    // Navigate directly to playlist search
    cy.visit('/search/playlist?q=coldplay')
    cy.get('[data-testid="search-results"]').should('be.visible')
    cy.url().should('include', '/search/playlist')
    cy.url().should('include', 'q=coldplay')

    // Navigate directly to track search
    cy.visit('/search/track?q=coldplay')
    cy.get('[data-testid="search-results"]').should('be.visible')
    cy.url().should('include', '/search/track')
    cy.url().should('include', 'q=coldplay')

    // Navigate directly to artist search
    cy.visit('/search/artist?q=coldplay')
    cy.get('[data-testid="search-results"]').should('be.visible')
    cy.url().should('include', '/search/artist')
    cy.url().should('include', 'q=coldplay')
  })
})
