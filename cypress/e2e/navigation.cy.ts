describe('Navigation Menu E2E', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should display sidebar navigation with all menu items', () => {
    // Verify sidebar navigation is visible
    cy.get('[data-testid="sidebar-navigation"]').should('be.visible')

    // Verify all navigation items are present
    cy.get('[data-testid="nav-item-"]').should('be.visible') // Home
    cy.get('[data-testid="nav-item-search"]').should('be.visible')
    cy.get('[data-testid="nav-item-artists"]').should('be.visible')
    cy.get('[data-testid="nav-item-albums"]').should('be.visible')
    cy.get('[data-testid="nav-item-favorites"]').should('be.visible')

    // Verify navigation items have correct text
    cy.get('[data-testid="nav-item-"]').should('contain', 'Início')
    cy.get('[data-testid="nav-item-search"]').should('contain', 'Buscar')
    cy.get('[data-testid="nav-item-artists"]').should('contain', 'Artistas')
    cy.get('[data-testid="nav-item-albums"]').should('contain', 'Álbuns')
    cy.get('[data-testid="nav-item-favorites"]').should('contain', 'Favoritos')
  })

  it('should navigate to search page when clicking search menu item', () => {
    // Click on search navigation item
    cy.get('[data-testid="nav-item-search"]').click()

    // Verify navigation to search page
    cy.url().should('include', '/search')

    // Verify search page elements are visible
    cy.get('[data-testid="search-header"]').should('be.visible')
    cy.get('[data-testid="search-input"]').should('be.visible')
    cy.get('[data-testid="search-filters"]').should('be.visible')
  })

  it('should navigate to artists page when clicking artists menu item', () => {
    // Click on artists navigation item
    cy.get('[data-testid="nav-item-artists"]').click()

    // Verify navigation to artists page
    cy.url().should('include', '/artists')

    // Verify artists page elements are visible
    cy.get('h1').should('contain', 'Artistas populares')

    // Wait for artists to load
    cy.get('[data-testid="artist-card"]', { timeout: 10000 }).should('exist')
  })

  it('should navigate to albums page when clicking albums menu item', () => {
    // Click on albums navigation item
    cy.get('[data-testid="nav-item-albums"]').click()

    // Verify navigation to albums page
    cy.url().should('include', '/albums')

    // Verify albums page loads
    cy.get('h1').should('be.visible')
  })

  it('should navigate to favorites page when clicking favorites menu item', () => {
    // Click on favorites navigation item
    cy.get('[data-testid="nav-item-favorites"]').click()

    // Verify navigation to favorites page
    cy.url().should('include', '/favorites')

    // Verify favorites page loads
    cy.get('h1').should('be.visible')
  })

  it('should navigate back to home when clicking home menu item', () => {
    // First navigate to another page
    cy.get('[data-testid="nav-item-search"]').click()
    cy.url().should('include', '/search')

    // Click on home navigation item
    cy.get('[data-testid="nav-item-"]').click()

    // Verify navigation back to home
    cy.url().should('eq', Cypress.config().baseUrl + '/')

    // Verify home page elements are visible
    cy.get('header').should('be.visible')
  })

  it('should highlight active navigation item based on current page', () => {
    // On home page, home item should be active
    cy.get('[data-testid="nav-item-"]').should(
      'have.class',
      'bg-sidebar-accent',
    )

    // Navigate to search page
    cy.get('[data-testid="nav-item-search"]').click()
    cy.url().should('include', '/search')

    // Search item should be active
    cy.get('[data-testid="nav-item-search"]').should(
      'have.class',
      'bg-sidebar-accent',
    )

    // Navigate to artists page
    cy.get('[data-testid="nav-item-artists"]').click()
    cy.url().should('include', '/artists')

    // Artists item should be active
    cy.get('[data-testid="nav-item-artists"]').should(
      'have.class',
      'bg-sidebar-accent',
    )
  })

  it('should handle mobile menu toggle', () => {
    // Set mobile viewport
    cy.viewport('iphone-x')

    // Verify mobile menu button is visible
    cy.get('header button:has(.lucide-menu)').should('be.visible')

    // Click mobile menu button
    cy.get('header button:has(.lucide-menu)').click()

    // Verify sidebar is visible on mobile
    cy.get('[data-testid="sidebar-navigation"]').should('be.visible')

    // Navigate using mobile menu
    cy.get('[data-testid="nav-item-search"]').click()

    // Verify navigation worked
    cy.url().should('include', '/search')

    // Verify sidebar is closed after navigation on mobile
    cy.get('[data-testid="sidebar-navigation"]').should('not.be.visible')
  })

  it('should maintain navigation state across page refreshes', () => {
    // Navigate to artists page
    cy.get('[data-testid="nav-item-artists"]').click()
    cy.url().should('include', '/artists')

    // Refresh the page
    cy.reload()

    // Verify we're still on artists page
    cy.url().should('include', '/artists')

    // Verify artists page still loads correctly
    cy.get('h1').should('contain', 'Artistas populares')
  })

  it('should handle rapid navigation between pages', () => {
    // Rapidly navigate between pages
    cy.get('[data-testid="nav-item-search"]').click()
    cy.url().should('include', '/search')

    cy.get('[data-testid="nav-item-artists"]').click()
    cy.url().should('include', '/artists')

    cy.get('[data-testid="nav-item-albums"]').click()
    cy.url().should('include', '/albums')

    cy.get('[data-testid="nav-item-favorites"]').click()
    cy.url().should('include', '/favorites')

    // Verify final page loads correctly
    cy.get('h1').should('be.visible')
  })

  it('should handle navigation with browser back/forward buttons', () => {
    // Navigate to search page
    cy.get('[data-testid="nav-item-search"]').click()
    cy.url().should('include', '/search')

    // Navigate to artists page
    cy.get('[data-testid="nav-item-artists"]').click()
    cy.url().should('include', '/artists')

    // Use browser back button
    cy.go('back')
    cy.url().should('include', '/search')

    // Use browser forward button
    cy.go('forward')
    cy.url().should('include', '/artists')
  })
})
