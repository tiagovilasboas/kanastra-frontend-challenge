describe('Navigation Domain', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('Route Navigation', () => {
    it('should navigate to home page', () => {
      cy.visit('/')
      cy.url().should('eq', Cypress.config().baseUrl + '/')
      cy.get('h1').should('contain', 'Welcome to Spotify Explorer')
    })

    it('should navigate to artists page', () => {
      cy.visit('/artists')
      cy.url().should('include', '/artists')
      cy.get('[data-testid="artists-page"]').should('be.visible')
    })

    it('should navigate to albums page', () => {
      cy.visit('/albums')
      cy.url().should('include', '/albums')
      cy.get('[data-testid="albums-page"]').should('be.visible')
    })

    it('should navigate to search page', () => {
      cy.visit('/search')
      cy.url().should('include', '/search')
      cy.get('[data-testid="search-page"]').should('be.visible')
    })

    it('should navigate to favorites page', () => {
      cy.visit('/favorites')
      cy.url().should('include', '/favorites')
      cy.get('[data-testid="favorites-page"]').should('be.visible')
    })

    it('should navigate to artist detail page', () => {
      const artistId = 'test-artist-id'
      cy.visit(`/artist/${artistId}`)
      cy.url().should('include', `/artist/${artistId}`)
      cy.get('[data-testid="artist-page"]').should('be.visible')
    })
  })

  describe('Navigation Menu', () => {
    it('should display navigation menu items', () => {
      cy.get('[data-testid="nav-menu"]').within(() => {
        cy.get('[data-testid="nav-home"]').should('be.visible')
        cy.get('[data-testid="nav-artists"]').should('be.visible')
        cy.get('[data-testid="nav-albums"]').should('be.visible')
        cy.get('[data-testid="nav-search"]').should('be.visible')
        cy.get('[data-testid="nav-favorites"]').should('be.visible')
      })
    })

    it('should highlight active navigation item', () => {
      cy.visit('/artists')
      cy.get('[data-testid="nav-artists"]').should('have.class', 'active')

      cy.visit('/albums')
      cy.get('[data-testid="nav-albums"]').should('have.class', 'active')
    })

    it('should navigate via menu clicks', () => {
      // Navigate to artists via menu
      cy.get('[data-testid="nav-artists"]').click()
      cy.url().should('include', '/artists')

      // Navigate to albums via menu
      cy.get('[data-testid="nav-albums"]').click()
      cy.url().should('include', '/albums')

      // Navigate to search via menu
      cy.get('[data-testid="nav-search"]').click()
      cy.url().should('include', '/search')

      // Navigate to favorites via menu
      cy.get('[data-testid="nav-favorites"]').click()
      cy.url().should('include', '/favorites')

      // Navigate back to home via menu
      cy.get('[data-testid="nav-home"]').click()
      cy.url().should('eq', Cypress.config().baseUrl + '/')
    })
  })

  describe('Breadcrumb Navigation', () => {
    it('should display breadcrumbs on nested pages', () => {
      cy.visit('/artist/test-artist-id')

      cy.get('[data-testid="breadcrumbs"]').within(() => {
        cy.get('[data-testid="breadcrumb-home"]').should('be.visible')
        cy.get('[data-testid="breadcrumb-artists"]').should('be.visible')
        cy.get('[data-testid="breadcrumb-current"]').should('be.visible')
      })
    })

    it('should navigate via breadcrumbs', () => {
      cy.visit('/artist/test-artist-id')

      // Navigate to artists via breadcrumb
      cy.get('[data-testid="breadcrumb-artists"]').click()
      cy.url().should('include', '/artists')

      // Navigate to home via breadcrumb
      cy.get('[data-testid="breadcrumb-home"]').click()
      cy.url().should('eq', Cypress.config().baseUrl + '/')
    })
  })

  describe('Mobile Navigation', () => {
    beforeEach(() => {
      cy.viewport('iphone-x')
    })

    it('should show mobile menu button on small screens', () => {
      cy.get('[data-testid="mobile-menu-button"]').should('be.visible')
      cy.get('[data-testid="nav-menu"]').should('not.be.visible')
    })

    it('should toggle mobile menu', () => {
      cy.get('[data-testid="mobile-menu-button"]').click()
      cy.get('[data-testid="nav-menu"]').should('be.visible')

      cy.get('[data-testid="mobile-menu-button"]').click()
      cy.get('[data-testid="nav-menu"]').should('not.be.visible')
    })

    it('should navigate via mobile menu', () => {
      cy.get('[data-testid="mobile-menu-button"]').click()

      cy.get('[data-testid="nav-artists"]').click()
      cy.url().should('include', '/artists')
      cy.get('[data-testid="nav-menu"]').should('not.be.visible')
    })
  })

  describe('Browser Navigation', () => {
    it('should handle browser back button', () => {
      cy.visit('/artists')
      cy.visit('/albums')

      cy.go('back')
      cy.url().should('include', '/artists')
    })

    it('should handle browser forward button', () => {
      cy.visit('/artists')
      cy.visit('/albums')
      cy.go('back')

      cy.go('forward')
      cy.url().should('include', '/albums')
    })

    it('should update browser history', () => {
      cy.visit('/artists')
      cy.visit('/albums')
      cy.visit('/search')

      cy.go('back')
      cy.url().should('include', '/albums')

      cy.go('back')
      cy.url().should('include', '/artists')
    })
  })

  describe('Deep Linking', () => {
    it('should handle direct URL access', () => {
      cy.visit('/artist/test-artist-id')
      cy.get('[data-testid="artist-page"]').should('be.visible')
    })

    it('should handle URL with query parameters', () => {
      cy.visit('/search?q=test&type=artist')
      cy.get('[data-testid="search-page"]').should('be.visible')
      cy.get('[data-testid="search-input"]').should('have.value', 'test')
    })

    it('should handle invalid routes gracefully', () => {
      cy.visit('/invalid-route')
      cy.get('[data-testid="not-found-page"]').should('be.visible')
    })
  })

  describe('Navigation Performance', () => {
    it('should navigate between pages quickly', () => {
      const startTime = Date.now()

      cy.visit('/artists').then(() => {
        const loadTime = Date.now() - startTime
        expect(loadTime).to.be.lessThan(3000) // 3 seconds max
      })
    })

    it('should maintain scroll position on navigation', () => {
      cy.visit('/artists')
      cy.scrollTo('bottom')

      cy.get('[data-testid="nav-albums"]').click()
      cy.visit('/artists')

      // Should be at top of page after navigation
      cy.window().its('scrollY').should('eq', 0)
    })
  })
})
