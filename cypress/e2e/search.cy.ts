describe('Search Page E2E - Happy Path', () => {
  beforeEach(() => {
    cy.visit('/search')
  })

  it('should display search page with all search types and perform basic search', () => {
    // Verify search page loads correctly
    cy.get('[data-testid="search-header"]').should('be.visible')
    cy.get('[data-testid="search-input"]').should('be.visible')
    cy.get('[data-testid="search-filters"]').should('be.visible')

    // Verify all search types are available
    cy.get('[data-testid="search-type-button"]').should('have.length', 7) // artist, album, track, playlist, show, episode, audiobook

    // Test search functionality
    cy.get('[data-testid="search-input"]').type('rock')
    cy.get('[data-testid="search-button"]').click()

    // Verify search results are displayed
    cy.get('[data-testid="search-results"]').should('be.visible')

    // Verify skeleton loading appears briefly
    cy.get('[data-testid="skeleton-card"]').should('exist')

    // Wait for results to load
    cy.get('[data-testid="search-results"]', { timeout: 10000 }).should(
      'not.contain',
      'skeleton',
    )
  })

  it('should switch between search types and display appropriate results', () => {
    // Perform initial search
    cy.get('[data-testid="search-input"]').type('jazz')
    cy.get('[data-testid="search-button"]').click()

    // Test switching to artists
    cy.get('[data-testid="search-type-button"]').contains('Artistas').click()
    cy.get('[data-testid="search-results"]').should('be.visible')
    cy.url().should('include', '/search/artist')

    // Test switching to albums
    cy.get('[data-testid="search-type-button"]').contains('Álbuns').click()
    cy.get('[data-testid="search-results"]').should('be.visible')
    cy.url().should('include', '/search/album')

    // Test switching to tracks
    cy.get('[data-testid="search-type-button"]').contains('Músicas').click()
    cy.get('[data-testid="search-results"]').should('be.visible')
    cy.url().should('include', '/search/track')

    // Test switching back to all
    cy.get('[data-testid="search-type-button"]').contains('Tudo').click()
    cy.get('[data-testid="search-results"]').should('be.visible')
    cy.url().should('include', '/search')
  })

  it('should handle empty search results gracefully', () => {
    // Search for something that likely won't return results
    cy.get('[data-testid="search-input"]').type('xyz123nonexistent')
    cy.get('[data-testid="search-button"]').click()

    // Verify empty state is handled
    cy.get('[data-testid="search-results"]', { timeout: 10000 }).should(
      'be.visible',
    )

    // Should show some indication of no results (either empty state or message)
    cy.get('body')
      .should('contain', 'Nenhum resultado encontrado')
      .or('contain', 'No results found')
  })

  it('should maintain search state when navigating between types', () => {
    // Perform search
    cy.get('[data-testid="search-input"]').type('pop')
    cy.get('[data-testid="search-button"]').click()

    // Verify search query is maintained in input
    cy.get('[data-testid="search-input"]').should('have.value', 'pop')

    // Switch to different type
    cy.get('[data-testid="search-type-button"]').contains('Artistas').click()

    // Verify search query is still there
    cy.get('[data-testid="search-input"]').should('have.value', 'pop')

    // Verify results are displayed for the new type
    cy.get('[data-testid="search-results"]').should('be.visible')
  })
})
