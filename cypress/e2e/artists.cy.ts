describe('Artists Page E2E - Happy Path', () => {
  beforeEach(() => {
    cy.visit('/artists')
  })

  it('should display artists page with popular artists and skeleton loading', () => {
    // Verify page loads correctly
    cy.get('h1').should('contain', 'Artistas populares')

    // Verify skeleton loading appears initially
    cy.get('[data-testid="skeleton-card"]').should('exist')

    // Wait for artists to load
    cy.get('[data-testid="artist-card"]', { timeout: 10000 }).should('exist')

    // Verify skeleton is no longer visible
    cy.get('[data-testid="skeleton-card"]').should('not.exist')

    // Verify multiple artist cards are displayed
    cy.get('[data-testid="artist-card"]').should('have.length.greaterThan', 0)
  })

  it('should display artist cards with correct information', () => {
    // Wait for artists to load
    cy.get('[data-testid="artist-card"]', { timeout: 10000 })
      .first()
      .should('be.visible')

    // Verify artist card structure
    cy.get('[data-testid="artist-card"]')
      .first()
      .within(() => {
        // Should have artist image
        cy.get('img').should('be.visible')

        // Should have artist name
        cy.get('[data-testid="artist-name"]').should('be.visible')

        // Should have artist genres (if available)
        cy.get('[data-testid="artist-genres"]').should('exist')
      })
  })

  it('should navigate to individual artist page when clicking on artist card', () => {
    // Wait for artists to load
    cy.get('[data-testid="artist-card"]', { timeout: 10000 })
      .first()
      .should('be.visible')

    // Get the first artist's name for verification
    cy.get('[data-testid="artist-card"]')
      .first()
      .find('[data-testid="artist-name"]')
      .invoke('text')
      .then((artistName) => {
        // Click on the first artist card
        cy.get('[data-testid="artist-card"]').first().click()

        // Verify navigation to artist page
        cy.url().should('include', '/artist/')

        // Verify artist page loads with the same artist name
        cy.get('[data-testid="artist-header"]').should('contain', artistName)
      })
  })

  it('should handle responsive layout correctly', () => {
    // Wait for artists to load
    cy.get('[data-testid="artist-card"]', { timeout: 10000 }).should('exist')

    // Test mobile viewport
    cy.viewport('iphone-x')
    cy.get('[data-testid="artist-card"]').should('be.visible')

    // Test tablet viewport
    cy.viewport('ipad-2')
    cy.get('[data-testid="artist-card"]').should('be.visible')

    // Test desktop viewport
    cy.viewport(1920, 1080)
    cy.get('[data-testid="artist-card"]').should('be.visible')
  })

  it('should maintain page state when navigating back from artist page', () => {
    // Wait for artists to load
    cy.get('[data-testid="artist-card"]', { timeout: 10000 })
      .first()
      .should('be.visible')

    // Remember the number of artists on the page
    cy.get('[data-testid="artist-card"]').then(($cards) => {
      const initialCount = $cards.length

      // Click on an artist card
      cy.get('[data-testid="artist-card"]').first().click()

      // Navigate back
      cy.go('back')

      // Verify we're back on the artists page
      cy.url().should('eq', Cypress.config().baseUrl + '/artists')

      // Verify the same number of artists are still displayed
      cy.get('[data-testid="artist-card"]').should('have.length', initialCount)
    })
  })
})
